from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.activity import LessonProgress, QuizAttempt, Grade, Submission
from app.models.link import TeacherStudent, StudentParent

progress_bp = Blueprint("progress", __name__)


@progress_bp.get("/student/<int:student_id>")
@jwt_required()
def student_progress(student_id):
    requester_id = int(get_jwt_identity())
    requester = User.query.get(requester_id)

    allowed = False
    if requester.role == "admin":
        allowed = True
    elif requester.role == "student" and requester_id == student_id:
        allowed = True
    elif requester.role == "teacher":
        linked = TeacherStudent.query.filter_by(teacher_id=requester_id, student_id=student_id).first()
        if linked:
            allowed = True
    elif requester.role == "parent":
        linked = StudentParent.query.filter_by(parent_id=requester_id, student_id=student_id).first()
        if linked:
            allowed = True

    if not allowed:
        return jsonify({"error": {"code": "forbidden", "message": "Cannot view this student's progress"}}), 403

    lessons = LessonProgress.query.filter_by(student_id=student_id).all()
    quizzes = QuizAttempt.query.filter_by(student_id=student_id).all()
    grades = Grade.query.filter(
        (Grade.submission_id.in_([s.id for s in Submission.query.filter_by(target_id=student_id).all()]))
        | (Grade.quiz_attempt_id.in_([q.id for q in quizzes]))
    ).all()

    return jsonify({
        "lessons": [{"lesson_id": l.lesson_id, "completed": l.completed} for l in lessons],
        "quizzes": [{"quiz_id": q.quiz_id, "score": q.score, "max_score": q.max_score} for q in quizzes],
        "grades": [{"score": g.score, "comment": g.comment} for g in grades],
    })


@progress_bp.get("/class/<int:class_id>")
@jwt_required()
def class_progress(class_id):
    return jsonify({"class_id": class_id, "students": []})


@progress_bp.get("/parent/children")
@jwt_required()
def parent_children():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "parent":
        return jsonify({"error": {"code": "forbidden", "message": "Parent only"}}), 403
    links = StudentParent.query.filter_by(parent_id=user_id).all()
    children = [User.query.get(l.student_id).to_dict() for l in links if User.query.get(l.student_id)]
    return jsonify({"children": children})
