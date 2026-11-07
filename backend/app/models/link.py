from app.extensions import db


class StudentParent(db.Model):
    __tablename__ = "student_parent"

    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)


class TeacherStudent(db.Model):
    __tablename__ = "teacher_student"

    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
