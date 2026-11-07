from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.content import (
    Subject, Course, Lesson, Quiz, Question, QuestionOption,
)

content_bp = Blueprint("content", __name__)


@content_bp.get("/subjects")
@jwt_required()
def list_subjects():
    subjects = Subject.query.all()
    return jsonify({"subjects": [{"id": s.id, "title": s.title, "description": s.description} for s in subjects]})


@content_bp.get("/courses")
@jwt_required()
def list_courses():
    courses = Course.query.all()
    return jsonify({"courses": [{"id": c.id, "subject_id": c.subject_id, "title": c.title} for c in courses]})


@content_bp.get("/lessons")
@jwt_required()
def list_lessons():
    lessons = Lesson.query.all()
    return jsonify({"lessons": [{"id": l.id, "course_id": l.course_id, "title": l.title, "type": l.type} for l in lessons]})


@content_bp.get("/quizzes")
@jwt_required()
def list_quizzes():
    quizzes = Quiz.query.all()
    return jsonify({"quizzes": [{"id": q.id, "lesson_id": q.lesson_id, "title": q.title} for q in quizzes]})


@content_bp.get("/questions/<int:quiz_id>")
@jwt_required()
def list_questions(quiz_id):
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    return jsonify({"questions": [{"id": q.id, "text": q.text, "options": [{"id": o.id, "text": o.text, "is_correct": o.is_correct} for o in q.options]} for q in questions]})
