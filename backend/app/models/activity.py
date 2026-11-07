from app.extensions import db


class AssignmentTemplate(db.Model):
    __tablename__ = "assignment_templates"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=True)
    title = db.Column(db.JSON, nullable=False)
    instructions = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    item_type = db.Column(db.String(20), nullable=False)  # lesson|quiz|assignment
    item_id = db.Column(db.Integer, nullable=True)
    assigned_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    title = db.Column(db.JSON, nullable=False)
    instructions = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    targets = db.relationship(
        "AssignmentTarget", backref="assignment", cascade="all, delete-orphan"
    )


class AssignmentTarget(db.Model):
    __tablename__ = "assignment_targets"

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(
        db.Integer, db.ForeignKey("assignments.id"), nullable=False
    )
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(20), default="not_started")
    completed_at = db.Column(db.DateTime, nullable=True)


class LessonProgress(db.Model):
    __tablename__ = "lesson_progress"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)


class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempts"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)
    score = db.Column(db.Integer, default=0)
    max_score = db.Column(db.Integer, default=0)
    completed_at = db.Column(db.DateTime, server_default=db.func.now())


class QuizAnswer(db.Model):
    __tablename__ = "quiz_answers"

    id = db.Column(db.Integer, primary_key=True)
    attempt_id = db.Column(
        db.Integer, db.ForeignKey("quiz_attempts.id"), nullable=False
    )
    question_id = db.Column(
        db.Integer, db.ForeignKey("questions.id"), nullable=False
    )
    option_id = db.Column(db.Integer, db.ForeignKey("question_options.id"))


class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    target_id = db.Column(
        db.Integer, db.ForeignKey("assignment_targets.id"), nullable=False
    )
    file_url = db.Column(db.String(500), nullable=True)
    text = db.Column(db.Text, nullable=True)
    submitted_at = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(db.String(20), default="submitted")


class Grade(db.Model):
    __tablename__ = "grades"

    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(
        db.Integer, db.ForeignKey("submissions.id"), nullable=True
    )
    quiz_attempt_id = db.Column(
        db.Integer, db.ForeignKey("quiz_attempts.id"), nullable=True
    )
    score = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.JSON, nullable=True)
    graded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    graded_at = db.Column(db.DateTime, server_default=db.func.now())
