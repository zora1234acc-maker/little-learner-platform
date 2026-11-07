from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.activity import Assignment, AssignmentTarget
from app.models.link import TeacherStudent

assign_bp = Blueprint("assign", __name__)


@assign_bp.get("")
@jwt_required()
def list_assignments():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404

    if user.role == "teacher":
        linked_students = [ts.student_id for ts in TeacherStudent.query.filter_by(teacher_id=user_id).all()]
        assignments = Assignment.query.filter_by(assigned_by=user_id).all()
        return jsonify({"assignments": [{"id": a.id, "title": a.title, "item_type": a.item_type, "due_date": a.due_date.isoformat() if a.due_date else None} for a in assignments]})
    elif user.role == "student":
        targets = AssignmentTarget.query.filter_by(student_id=user_id).all()
        return jsonify({"targets": [{"id": t.id, "assignment_id": t.assignment_id, "status": t.status} for t in targets]})
    else:
        assignments = Assignment.query.all()
        return jsonify({"assignments": [{"id": a.id, "title": a.title, "item_type": a.item_type} for a in assignments]})
