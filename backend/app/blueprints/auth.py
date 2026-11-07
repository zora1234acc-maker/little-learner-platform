from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.is_active:
        return (
            jsonify(
                {
                    "error": {
                        "code": "invalid_credentials",
                        "message": "Invalid email or password",
                    }
                }
            ),
            401,
        )

    if not user.check_password(password):
        return (
            jsonify(
                {
                    "error": {
                        "code": "invalid_credentials",
                        "message": "Invalid email or password",
                    }
                }
            ),
            401,
        )

    token = create_access_token(identity=str(user.id))
    return jsonify(
        {
            "token": token,
            "user": {
                "id": user.id,
                "role": user.role,
                "full_name": user.full_name,
                "email": user.email,
                "preferred_lang": user.preferred_lang,
            },
        }
    )


@auth_bp.post("/token-login")
def token_login():
    data = request.get_json() or {}
    token_value = data.get("token")

    user = User.query.filter_by(login_token_hash=token_value).first()
    if not user or user.role != "student" or not user.is_active:
        return (
            jsonify(
                {
                    "error": {
                        "code": "invalid_token",
                        "message": "Invalid QR/PIN token",
                    }
                }
            ),
            401,
        )

    token = create_access_token(identity=str(user.id))
    return jsonify(
        {
            "token": token,
            "user": {
                "id": user.id,
                "role": user.role,
                "full_name": user.full_name,
                "email": user.email,
                "preferred_lang": user.preferred_lang,
            },
        }
    )


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404
    return jsonify(
        {
            "id": user.id,
            "role": user.role,
            "full_name": user.full_name,
            "email": user.email,
            "preferred_lang": user.preferred_lang,
        }
    )


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    token = create_access_token(identity=user_id)
    return jsonify({"token": token})
