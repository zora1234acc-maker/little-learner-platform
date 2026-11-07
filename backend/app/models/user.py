from app.extensions import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    role = db.Column(
        db.Enum("admin", "teacher", "student", "parent", name="user_role"),
        nullable=False,
    )
    full_name = db.Column(db.String(255), nullable=False)
    preferred_lang = db.Column(db.String(10), default="en")
    is_active = db.Column(db.Boolean, default=True)
    login_method = db.Column(
        db.Enum("password", "qr", "pin", "picture", name="login_method"),
        default="password",
    )
    login_token_hash = db.Column(db.String(255), nullable=True)
    avatar = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now()
    )

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        if not self.password_hash:
            return False
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "full_name": self.full_name,
            "preferred_lang": self.preferred_lang,
            "is_active": self.is_active,
            "login_method": self.login_method,
            "avatar": self.avatar,
        }
