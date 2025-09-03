from flask import Flask
from .commands import setup_commands
from .models import db

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///mi_db.sqlite3"
    db.init_app(app)

    setup_commands(app)

    return app