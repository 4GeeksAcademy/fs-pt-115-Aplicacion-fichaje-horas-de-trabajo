"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Status, Holidays, Schedule, Signing, Request, RequestType
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import time, datetime

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


    existing_user = db.session.execute(
        db.select(User).where(User.email == data["email"])
    ).scalar_one_or_none()
    if existing_user:
        return jsonify({"msg": "User with this email already exists"}), 400
    
    status_name = data.get("status_name", "Activo")
    status = db.session.execute(
        db.select(Status).where(Status.name == status_name)
    ).scalar_one_or_none()

    if not status:
        return jsonify({"msg": f"Status '{status_name}' not found"}), 400


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

#Usuarios

@api.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = user.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 400
    return jsonify(user.serialize())

@api.route("/users", methods=["POST"])
def create_user():
    data = request.json
    user = User(
        last_name=data["last_name"],
        surname=data["surname"],
        first_name=data["first_name"],
        email=data["email"],
        DNI=data["DNI"],
        rol=data["rol"],
        is_admin=data["is_admin"],
        status_id=data["status_id"]
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)
    if not user: 
        return jsonify({"error": "Usuario no encontrado"}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado"}), 200


#Vacaciones

@api.route("/users/<int:user_id>/holidays", methods=["GET"])
def get_holidays(user_id):
    holidays = Holidays.query.filter_by(user_id=user_id).all()
    return jsonify([h.serialize() for h in holidays])


@api.route("/users/<int:user_id>/holidays", methods=["POST"])
def add_holidays(user_id):
    data = request.json
    holiday = Holidays(
        user_id=user_id,
        tatal_days= data.get["total_days"],
        used_days= data.get["used_days"],
        remaining_days= data.get("remaining_days", data.get("total_days"))
    )
    db.session.add(holiday)
    db.session.commit()
    return jsonify(holiday.serialize()), 200


#Horarios

@api.route("/users/<int:user_id>/schedules", methods=["GET"])
def get_schedules(user_id):
    schedules = Schedule.query.filter_by(user_id=user_id).all()
    return jsonify([s.serialize() for s in schedules])

@api.route("/users/<int:user_id>/schedules", methods=["POST"])
def add_schedule(user_id):
    data = request.json
    schedule = Schedule(
        user_id=user_id,
        shift=data["shift"],
        start_time=time.fromisoformat(data["start_time"]),
        end_time=time.fromisoformat(data["end_time"]),
        day=data["day"]
    )
    db.session.add(schedule)
    db.session.commit()
    return jsonify(schedule.serialize()), 201


#Fichajes

@api.route("/users/<int:user_id>/signings", methods=["GET"])
def get_signings(user_id):
    signings = Signing.query.filter_by(user_id=user_id).all()
    return jsonify([s.serialize() for s in signings])

@api.route("/users/<int:user_id>/signings", methods=["POST"])
def add_signing(user_id):
    data = request.json
    signing = Signing(
        user_id=user_id,
        schedule_id=data.get("schedule_id"),
        type=data.get("type", "in"),
        datetime=datetime.fromisoformat(data["datetime"]),
        lat=data.get("lat"),
        long=data.get("long")
    )
    db.session.add(signing)
    db.session.commit()
    return jsonify(signing.serialize()), 201


#Requests

@api.route("/users/<int:user_id>/requests", methods=["GET"])
def get_requests(user_id):
    requests = Request.query.filter_by(user_id=user_id).all()
    return jsonify([r.serialize() for r in requests])

@api.route("/users/<int:user_id>/requests", methods=["POST"])
def add_request(user_id):
    data = request.json
    req = Request(
        user_id=user_id,
        admin_id=data.get("admin_id"),
        start_date=datetime.fromisoformat(data["start_date"]),
        end_date=datetime.fromisoformat(data["end_date"]),
        comment=data.get("comment")
    )
    db.session.add(req)
    db.session.commit()

    req_type = RequestType(
        request_id=req.id,
        holidays=data.get("holidays"),
        shift_change=data.get("shift_change"),
        schedule_change=data.get("schedule_change"),
        salary_advance=data.get("salary_advance"),
        others=data.get("others")
    )
    db.session.add(req_type)
    db.session.commit()

    return jsonify(req.serialize()), 201

@api.route("/requests/<int:request_id>", methods=["DELETE"])
def delete_request(request_id):
    req = Request.query.get(request_id)
    if not req:
        return jsonify({"error": "Solicitud no encontrada"}), 404
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Solicitud eliminada"}), 200