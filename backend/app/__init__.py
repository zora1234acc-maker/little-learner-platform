from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, jwt, cors, migrate, bcrypt


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    # Error handler
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": {"code": "not_found", "message": "Resource not found"}}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": {"code": "internal_server_error", "message": "Internal server error"}}), 500

    # Health check
    @app.get("/api/v1/health")
    def health():
        return jsonify({"status": "ok", "service": "little-learner"}), 200

    # Register blueprints
    from app.blueprints.auth import auth_bp
    from app.blueprints.users import users_bp
    from app.blueprints.content import content_bp
    from app.blueprints.assign import assign_bp
    from app.blueprints.progress import progress_bp
    from app.blueprints.cms import cms_bp
    from app.blueprints.media import media_bp

    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(users_bp, url_prefix="/api/v1/users")
    app.register_blueprint(content_bp, url_prefix="/api/v1/content")
    app.register_blueprint(assign_bp, url_prefix="/api/v1/assign")
    app.register_blueprint(progress_bp, url_prefix="/api/v1/progress")
    app.register_blueprint(cms_bp, url_prefix="/api/v1/cms")
    app.register_blueprint(media_bp, url_prefix="/api/v1/media")

    return app
