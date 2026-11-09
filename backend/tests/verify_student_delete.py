"""Verification harness for the student-removal path (T026, FR-020/FR-031).

Runs against in-memory SQLite with foreign keys enforced, so the old bare
`db.session.delete(user)` would raise an IntegrityError and this must not.

Includes a negative control: a bare delete of a still-referenced user is
asserted to fail, proving the checks above are not vacuous.

Run from the backend directory:

    cd backend; python tests/verify_student_delete.py

Exits 0 when every check and the control pass, 1 otherwise.
"""
import os
import sys

# Allow `import app` when this file is executed directly from any cwd.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import event

from app import create_app
from app.extensions import db
from app.models.activity import (
    Assignment,
    AssignmentTarget,
    Grade,
    LessonProgress,
    QuizAnswer,
    QuizAttempt,
    Submission,
)
from app.models.link import StudentParent, TeacherStudent
from app.models.user import User


class TestConfig:
    SECRET_KEY = "test"
    JWT_SECRET_KEY = "test"
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = ["http://localhost:5173"]


app = create_app(TestConfig)


def enforce_foreign_keys(connection, _record):
    connection.execute("PRAGMA foreign_keys=ON")


def seed():
    admin = User(email="admin@t.example", role="admin", full_name="Admin")
    student = User(email="kid@t.example", role="student", full_name="Kid", year_level="Grade 1", class_name="1A")
    other = User(email="other@t.example", role="student", full_name="Other", year_level="Grade 2", class_name="2A")
    teacher = User(email="teacher@t.example", role="teacher", full_name="Teacher")
    parent = User(email="parent@t.example", role="parent", full_name="Parent")
    db.session.add_all([admin, student, other, teacher, parent])
    db.session.commit()

    ids = {
        "admin": admin.id,
        "student": student.id,
        "other": other.id,
        "teacher": teacher.id,
        "parent": parent.id,
    }

    # Content prerequisites, so FK-enforced inserts for targets/attempts resolve.
    from app.models.content import Course, Lesson, Question, QuestionOption, Quiz, Subject

    subject = Subject(title={"en": "Math"}, is_published=True)
    db.session.add(subject)
    db.session.commit()
    course = Course(subject_id=subject.id, title={"en": "Numbers"}, is_published=True)
    db.session.add(course)
    db.session.commit()
    lesson = Lesson(course_id=course.id, title={"en": "Counting"}, type="reading", is_published=True)
    db.session.add(lesson)
    db.session.commit()
    quiz = Quiz(lesson_id=lesson.id, title={"en": "Count quiz"}, is_published=True)
    db.session.add(quiz)
    db.session.commit()
    question = Question(quiz_id=quiz.id, text={"en": "How many?"})
    db.session.add(question)
    db.session.commit()
    option = QuestionOption(question_id=question.id, text={"en": "Two"}, is_correct=True)
    db.session.add(option)
    db.session.commit()

    ids["lesson"] = lesson.id
    ids["quiz"] = quiz.id
    ids["question"] = question.id
    ids["option"] = option.id

    db.session.add_all(
        [
            StudentParent(student_id=student.id, parent_id=parent.id),
            StudentParent(student_id=other.id, parent_id=parent.id),
            TeacherStudent(teacher_id=teacher.id, student_id=student.id),
            TeacherStudent(teacher_id=teacher.id, student_id=other.id),
        ]
    )
    assignment = Assignment(item_type="assignment", item_id=None, assigned_by=teacher.id, title={"en": "Work"})
    db.session.add(assignment)
    db.session.commit()

    target = AssignmentTarget(assignment_id=assignment.id, student_id=student.id)
    other_target = AssignmentTarget(assignment_id=assignment.id, student_id=other.id)
    db.session.add_all([target, other_target])
    db.session.commit()

    submission = Submission(target_id=target.id, text="mine")
    db.session.add(submission)
    db.session.commit()

    attempt = QuizAttempt(student_id=student.id, quiz_id=ids["quiz"], score=1, max_score=2)
    db.session.add(attempt)
    db.session.commit()

    db.session.add_all(
        [
            Grade(submission_id=submission.id, score=80, graded_by=teacher.id),
            Grade(quiz_attempt_id=attempt.id, score=50, graded_by=teacher.id),
            QuizAnswer(
                attempt_id=attempt.id,
                question_id=ids["question"],
                option_id=ids["option"],
            ),
            LessonProgress(student_id=student.id, lesson_id=ids["lesson"], completed=True),
        ]
    )
    db.session.commit()
    return ids


def count(model, **filters):
    query = model.query
    if filters:
        query = query.filter_by(**filters)
    return query.count()


with app.app_context():
    # Register the FK pragma now that the engine exists.
    event.listen(db.engine, "connect", enforce_foreign_keys)
    db.create_all()
    print("FK enforcement:", db.session.execute(db.text("PRAGMA foreign_keys")).scalar())
    ids = seed()

    client = app.test_client()
    token = (
        __import__("flask_jwt_extended", fromlist=["create_access_token"])
        .create_access_token(identity=str(ids["admin"]))
    )
    response = client.delete(
        f"/api/v1/users/{ids['student']}", headers={"Authorization": f"Bearer {token}"}
    )
    print("DELETE status:", response.status_code, response.get_json())

    student_id = ids["student"]
    checks = {
        "user removed": User.query.filter_by(id=student_id).count() == 0,
        "student_parent removed": count(StudentParent, student_id=student_id) == 0,
        "teacher_student removed": count(TeacherStudent, student_id=student_id) == 0,
        "targets removed": count(AssignmentTarget, student_id=student_id) == 0,
        "attempts removed": count(QuizAttempt, student_id=student_id) == 0,
        "progress removed": count(LessonProgress, student_id=student_id) == 0,
        "submissions removed": count(Submission) == 0,
        "grades removed": count(Grade) == 0,
        "quiz answers removed": count(QuizAnswer) == 0,
        # The surviving student must be untouched.
        "other student kept": User.query.filter_by(id=ids["other"]).count() == 1,
        "other links kept": count(StudentParent, student_id=ids["other"]) == 1
        and count(TeacherStudent, student_id=ids["other"]) == 1,
        "other target kept": count(AssignmentTarget, student_id=ids["other"]) == 1,
    }

    for name, ok in checks.items():
        print(("PASS  " if ok else "FAIL  ") + name)

    failed = [name for name, ok in checks.items() if not ok]

    # Control: with FK enforcement on, a bare delete of a still-referenced user
    # must fail. This proves the harness above would have caught the original
    # defect rather than passing vacuously.
    control_caught = False
    try:
        doomed = User.query.get(ids["other"])
        db.session.delete(doomed)
        db.session.commit()
    except Exception as exc:
        control_caught = "FOREIGN KEY" in str(exc).upper() or "IntegrityError" in type(exc).__name__
        db.session.rollback()
    print(("PASS  " if control_caught else "FAIL  ") + "bare delete is rejected by FK (control)")

    print("RESULT:", "ALL PASS" if not failed else f"{len(failed)} FAILED")
    sys.exit(1 if failed or not control_caught else 0)
