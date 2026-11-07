from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.cms import SiteSetting, MenuItem, FooterBlock, Page, PageSection

cms_bp = Blueprint("cms", __name__)


def t(field, lang="en"):
    if not field:
        return ""
    if isinstance(field, str):
        return field
    return field.get(lang, field.get("en", ""))


@cms_bp.get("/public/site")
def public_site():
    lang = request.args.get("lang", "en")
    settings = SiteSetting.query.all()
    return jsonify({"settings": {s.key: s.value for s in settings}, "lang": lang})


@cms_bp.get("/public/menus")
def public_menus():
    lang = request.args.get("lang", "en")
    location = request.args.get("location")
    query = MenuItem.query.filter_by(is_visible=True)
    if location:
        query = query.filter_by(location=location)
    items = query.order_by(MenuItem.position).all()
    return jsonify([{"id": i.id, "label": t(i.label, lang), "url": i.url, "position": i.position} for i in items])


@cms_bp.get("/public/pages/<slug>")
def public_page(slug):
    lang = request.args.get("lang", "en")
    page = Page.query.filter_by(slug=slug, status="published").first()
    if not page:
        return jsonify({"error": {"code": "not_found", "message": "Page not published"}}), 404
    sections = PageSection.query.filter_by(page_id=page.id).order_by(PageSection.position).all()
    return jsonify({
        "id": page.id,
        "slug": page.slug,
        "title": t(page.title, lang),
        "sections": [{"id": s.id, "type": s.type, "content": s.content.get(lang, s.content.get("en", {}))} for s in sections],
    })


@cms_bp.get("/public/home")
def public_home():
    lang = request.args.get("lang", "en")
    page = Page.query.filter_by(slug="home", status="published").first()
    if not page:
        return jsonify({"error": {"code": "not_found", "message": "Home page not found"}}), 404
    sections = PageSection.query.filter_by(page_id=page.id).order_by(PageSection.position).all()
    return jsonify({
        "id": page.id,
        "slug": page.slug,
        "title": t(page.title, lang),
        "sections": [{"id": s.id, "type": s.type, "content": s.content.get(lang, s.content.get("en", {}))} for s in sections],
    })


@cms_bp.put("/settings")
@jwt_required()
def update_settings():
    data = request.get_json() or {}
    for key, value in data.items():
        setting = SiteSetting.query.filter_by(key=key).first()
        if setting:
            setting.value = value
        else:
            setting = SiteSetting(key=key, value=value)
            db.session.add(setting)
    db.session.commit()
    return jsonify({"ok": True})
