from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.extensions import db
from app.models.user import User
from app.models.link import StudentParent, TeacherStudent
from app.models.activity import (
    Assignment,
    AssignmentTarget,
    Grade,
    LessonProgress,
    QuizAnswer,
    QuizAttempt,
    Submission,
)

users_bp = Blueprint("users", __name__)


def admin_required():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or user.role != "admin":
        return jsonify({"error": {"code": "forbidden", "message": "Admin only"}}), 403
    return user


# ===== Student roster rules (mirrors frontend/src/api/mock.js) =====


def text_value(value):
    """Coerce to a trimmed string so whitespace-only input reads as empty."""
    return str(value).strip() if value is not None else ""


def normalize_identity(value):
    """Sign-in identities compare without surrounding whitespace or casing."""
    return text_value(value).lower()


def looks_like_email(value):
    raw = text_value(value)
    if raw.count("@") != 1:
        return False
    local, _, domain = raw.partition("@")
    return bool(local) and bool(domain)


def student_year_level(data, fallback=None):
    """Year level comes from `year_level`; `grade` is read as the legacy key."""
    if data.get("year_level") is not None:
        return text_value(data.get("year_level"))
    if data.get("grade") is not None:
        return text_value(data.get("grade"))
    return text_value(fallback)


def student_field_errors(merged, year_level):
    """Report each violation against its own field (FR-005, FR-009)."""
    fields = {}
    if not text_value(merged.get("full_name")):
        fields["full_name"] = "Name is required."

    email = text_value(merged.get("email"))
    if not email:
        fields["email"] = "Sign-in identity is required."
    elif not looks_like_email(email):
        fields["email"] = "Enter a valid email address."

    if not year_level:
        fields["year_level"] = "Year level is required."

    if not text_value(merged.get("class_name")):
        fields["class_name"] = "Class is required."

    return fields


def find_duplicate_identity(email, exclude_id=None):
    """Normalised identity lookup, so casing/whitespace alone never clashes."""
    normalized = normalize_identity(email)
    if not normalized:
        return None
    query = User.query.filter(func.lower(func.trim(User.email)) == normalized)
    if exclude_id is not None:
        query = query.filter(User.id != exclude_id)
    return query.first()


def validation_response(fields):
    return (
        jsonify(
            {
                "error": {
                    "code": "validation_error",
                    "message": "Please correct the highlighted fields.",
                    "fields": fields,
                }
            }
        ),
        400,
    )


def duplicate_response():
    return (
        jsonify(
            {
                "error": {
                    "code": "exists",
                    "message": "That sign-in identity is already registered.",
                }
            }
        ),
        409,
    )


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
    role = data.get("role") or "student"
    email = text_value(data.get("email"))
    password = data.get("password")
    full_name = data.get("full_name")
    year_level = student_year_level(data)

    # The roster rules gate students only; other roles keep their old behaviour.
    if role == "student":
        fields = student_field_errors(data, year_level)
        if fields:
            return validation_response(fields)
        if find_duplicate_identity(email):
            return duplicate_response()

    new_user = User(
        email=email or data.get("email"),
        role=role,
        full_name=full_name,
        preferred_lang=data.get("preferred_lang", "en"),
        login_method=data.get(
            "login_method", "pin" if role == "student" else "password"
        ),
        avatar=data.get("avatar"),
        year_level=year_level if role == "student" else None,
        class_name=text_value(data.get("class_name")) if role == "student" else None,
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
    # Validation runs before any mutation, so a refused edit leaves the stored
    # record exactly as it was (FR-013).
    merged = {**target.to_dict(), **data}
    role = data.get("role") or target.role
    year_level = student_year_level(data, target.year_level)

    if role == "student":
        fields = student_field_errors(merged, year_level)
        if fields:
            return validation_response(fields)
        if find_duplicate_identity(merged.get("email"), exclude_id=target.id):
            return duplicate_response()

    for field in [
        "full_name",
        "email",
        "role",
        "preferred_lang",
        "is_active",
        "login_method",
        "avatar",
        "year_level",
        "class_name",
    ]:
        if field in data:
            setattr(target, field, data[field])
    if role == "student" and year_level:
        target.year_level = year_level
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
    # Ordered application-side cleanup in a single transaction. Traversing the
    # graph explicitly (rather than adding ON DELETE CASCADE or a soft delete)
    # keeps every pre-existing row valid and leaves no orphans behind
    # (FR-020, FR-031).
    try:
        target_ids = [
            row.id
            for row in AssignmentTarget.query.filter_by(student_id=user_id).all()
        ]
        for assignment in Assignment.query.filter_by(assigned_by=user_id).all():
            target_ids.extend(row.id for row in assignment.targets)

        target_ids = list(dict.fromkeys(target_ids))

        submission_ids = (
            [
                row.id
                for row in Submission.query.filter(
                    Submission.target_id.in_(target_ids)
                ).all()
            ]
            if target_ids
            else []
        )
        attempt_ids = [
            row.id for row in QuizAttempt.query.filter_by(student_id=user_id).all()
        ]

        if submission_ids:
            Grade.query.filter(Grade.submission_id.in_(submission_ids)).delete(
                synchronize_session=False
            )
        if attempt_ids:
            Grade.query.filter(Grade.quiz_attempt_id.in_(attempt_ids)).delete(
                synchronize_session=False
            )
            QuizAnswer.query.filter(QuizAnswer.attempt_id.in_(attempt_ids)).delete(
                synchronize_session=False
            )
        if target_ids:
            Submission.query.filter(Submission.target_id.in_(target_ids)).delete(
                synchronize_session=False
            )
        Grade.query.filter(Grade.graded_by == user_id).delete(synchronize_session=False)

        if target_ids:
            AssignmentTarget.query.filter(AssignmentTarget.id.in_(target_ids)).delete(
                synchronize_session=False
            )
        LessonProgress.query.filter_by(student_id=user_id).delete(
            synchronize_session=False
        )
        QuizAttempt.query.filter_by(student_id=user_id).delete(synchronize_session=False)
        StudentParent.query.filter(
            (StudentParent.student_id == user_id)
            | (StudentParent.parent_id == user_id)
        ).delete(synchronize_session=False)
        TeacherStudent.query.filter(
            (TeacherStudent.student_id == user_id)
            | (TeacherStudent.teacher_id == user_id)
        ).delete(synchronize_session=False)
        Assignment.query.filter_by(assigned_by=user_id).delete(
            synchronize_session=False
        )

        db.session.delete(target)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

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
