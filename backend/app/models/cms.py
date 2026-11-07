from app.extensions import db


class SiteSetting(db.Model):
    __tablename__ = "site_settings"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.JSON, nullable=False)


class MenuItem(db.Model):
    __tablename__ = "menu_items"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(20), nullable=False)  # header|footer
    label = db.Column(db.JSON, nullable=False)
    url = db.Column(db.String(500), nullable=False)
    position = db.Column(db.Integer, default=0)
    parent_id = db.Column(db.Integer, nullable=True)
    is_visible = db.Column(db.Boolean, default=True)


class FooterBlock(db.Model):
    __tablename__ = "footer_blocks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.JSON, nullable=False)
    content = db.Column(db.JSON, nullable=False)
    position = db.Column(db.Integer, default=0)


class Page(db.Model):
    __tablename__ = "pages"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    title = db.Column(db.JSON, nullable=False)
    status = db.Column(db.String(20), default="published")
    seo = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    sections = db.relationship(
        "PageSection", backref="page", cascade="all, delete-orphan"
    )


class PageSection(db.Model):
    __tablename__ = "page_sections"

    id = db.Column(db.Integer, primary_key=True)
    page_id = db.Column(db.Integer, db.ForeignKey("pages.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    content = db.Column(db.JSON, nullable=False)
    position = db.Column(db.Integer, default=0)
