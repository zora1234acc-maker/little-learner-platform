from flask import Blueprint, request, jsonify

media_bp = Blueprint("media", __name__)


@media_bp.post("/upload")
def upload():
    return jsonify({"error": {"code": "not_implemented", "message": "Media upload not yet implemented"}}), 501
