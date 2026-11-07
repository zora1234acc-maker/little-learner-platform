from app.extensions import db


class Subject(db.Model):
    __tablename__ = "subjects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.JSON, nullable=False)
    description = db.Column(db.JSON, nullable=True)
    position = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    courses = db.relationship("Course", backref="subject", cascade="all, delete-orphan")


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"), nullable=False)
    title = db.Column(db.JSON, nullable=False)
    description = db.Column(db.JSON, nullable=True)
    position = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    lessons = db.relationship("Lesson", backref="course", cascade="all, delete-orphan")


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    title = db.Column(db.JSON, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # video|reading
    body = db.Column(db.JSON, nullable=True)
    video_url = db.Column(db.String(500), nullable=True)
    audio_url = db.Column(db.JSON, nullable=True)
    position = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    quizzes = db.relationship("Quiz", backref="lesson", cascade="all, delete-orphan")


class Quiz(db.Model):
    __tablename__ = "quizzes"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)
    title = db.Column(db.JSON, nullable=False)
    description = db.Column(db.JSON, nullable=True)
    position = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    questions = db.relationship("Question", backref="quiz", cascade="all, delete-orphan")


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)
    text = db.Column(db.JSON, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    position = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    options = db.relationship(
        "QuestionOption", backref="question", cascade="all, delete-orphan"
    )


class QuestionOption(db.Model):
    __tablename__ = "question_options"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(
        db.Integer, db.ForeignKey("questions.id"), nullable=False
    )
    text = db.Column(db.JSON, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    position = db.Column(db.Integer, default=0)
