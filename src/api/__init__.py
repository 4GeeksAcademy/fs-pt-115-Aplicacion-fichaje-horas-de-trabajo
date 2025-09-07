from flask import Flask
from .commands import setup_commands
from .models import db
from .historial_status import load_statuses

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///mi_db.sqlite3"
    db.init_app(app)

    setup_commands(app)

    with app.app_context():
        load_statuses()

    return app