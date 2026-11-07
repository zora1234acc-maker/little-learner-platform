"""Seed script for the first admin user."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User


def seed_admin():
    app = create_app()
    with app.app_context():
        db.create_all()

        admin = User.query.filter_by(role="admin").first()
        if admin:
            print("Admin already exists.")
            return

        admin = User(
            email="admin@littlelearner.example",
            full_name="System Admin",
            role="admin",
            preferred_lang="en",
            login_method="password",
        )
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()
        print("Admin created: admin@littlelearner.example / admin123")


if __name__ == "__main__":
    seed_admin()
