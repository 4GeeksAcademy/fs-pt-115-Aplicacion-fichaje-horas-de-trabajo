from flask import Flask
from .commands import setup_commands
from .models import db
from .historial_status import load_statuses , seed_status, STATUS

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://gitpod:postgres@localhost:5432/example"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    setup_commands(app)

    with app.app_context():
        return app