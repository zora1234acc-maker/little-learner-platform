from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.link import StudentParent, TeacherStudent

users_bp = Blueprint("users", __name__)


def admin_required():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or user.role != "admin":
        return jsonify({"error": {"code": "forbidden", "message": "Admin only"}}), 403
    return user


@users_bp.get("")
@jwt_required()
def list_users():
    user = admin_required()
    if isinstance(user, tuple):
        return user
    users = User.query.all()
    return jsonify({"users": [u.to_dict() for u in users]})


@users_bp.post("")
@jwt_required()
def create_user():
    user = admin_required()
    if isinstance(user, tuple):
        return user
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    full_name = data.get("full_name")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": {"code": "exists", "message": "Email already registered"}}), 409

    new_user = User(
        email=email,
        role=role,
        full_name=full_name,
        preferred_lang=data.get("preferred_lang", "en"),
        login_method=data.get("login_method", "password"),
        avatar=data.get("avatar"),
    )
    if password:
        new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201


@users_bp.patch("/<int:user_id>")
@jwt_required()
def update_user(user_id):
    user = admin_required()
    if isinstance(user, tuple):
        return user
    target = User.query.get(user_id)
    if not target:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404
    data = request.get_json() or {}
    for field in ["full_name", "email", "role", "preferred_lang", "is_active", "login_method", "avatar"]:
        if field in data:
            setattr(target, field, data[field])
    if "password" in data:
        target.set_password(data["password"])
    db.session.commit()
    return jsonify(target.to_dict())


@users_bp.delete("/<int:user_id>")
@jwt_required()
def delete_user(user_id):
    user = admin_required()
    if isinstance(user, tuple):
        return user
    target = User.query.get(user_id)
    if not target:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404
    db.session.delete(target)
    db.session.commit()
    return jsonify({"ok": True})


@users_bp.post("/links")
@jwt_required()
def create_link():
    user = admin_required()
    if isinstance(user, tuple):
        return user
    data = request.get_json() or {}
    student_id = data.get("student_id")
    parent_id = data.get("parent_id")
    teacher_id = data.get("teacher_id")

    if student_id and parent_id:
        link = StudentParent(student_id=student_id, parent_id=parent_id)
        db.session.add(link)
    if teacher_id and student_id:
        link = TeacherStudent(teacher_id=teacher_id, student_id=student_id)
        db.session.add(link)
    db.session.commit()
    return jsonify({"ok": True})
