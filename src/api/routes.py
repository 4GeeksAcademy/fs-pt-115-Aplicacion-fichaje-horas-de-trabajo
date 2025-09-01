"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Status
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    required_fields = ["email", "password", "first_name", "surname", "last_name", "DNI"]
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"msg": f"Missing fields: {', '.join(missing)}"}), 400

   
    status = db.session.get(Status, 1)
    if not status:
        status = Status(
            id=1,
            working="Activo",
            break_="En descanso",
            holiday="De vacaciones",
            not_working="Inactivo"
        )
        db.session.add(status)
        db.session.commit()

    existing_user = db.session.execute(
        db.select(User).where(User.email == data["email"])
    ).scalar_one_or_none()
    if existing_user:
        return jsonify({"msg": "User with this email already exists"}), 400


    new_user = User(
        email=data["email"],
        first_name=data["first_name"],
        surname=data["surname"],
        last_name=data["last_name"],
        DNI=data["DNI"],
        rol=data["rol"],
        is_admin=data["is_admin"],
        status_id=status.id
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

