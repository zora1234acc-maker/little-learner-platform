import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql+psycopg2://littlelearner:littlelearner@localhost:5432/littlelearner"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES", 3600))
    BCRYPT_LOG_ROUNDS = int(os.environ.get("BCRYPT_LOG_ROUNDS", 12))
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    UPLOAD_MAX_SIZE = int(os.environ.get("UPLOAD_MAX_SIZE", 5242880))
    RETENTION_DAYS_ACTIVITY = int(os.environ.get("RETENTION_DAYS_ACTIVITY", 90))
    RETENTION_DAYS_DEACTIVATED = int(os.environ.get("RETENTION_DAYS_DEACTIVATED", 365))
