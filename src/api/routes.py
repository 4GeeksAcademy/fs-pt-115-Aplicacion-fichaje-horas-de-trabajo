"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Status, Holidays, Schedule, Signing, Request, RequestType, StatusHistory, StatusRequest
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import time, datetime
from api.historial_status import STATUS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from .historial_status import STATUS

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

    required_fields = ["email", "password", "first_name", "surname", "last_name", "DNI", "rol", "address", "iban", "birth_date"]
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"msg": f"Missing fields: {', '.join(missing)}"}), 400
    
    email = data["email"]
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"msg": "Email inválido"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Ese email ya está registrado"}), 400
    

    if User.query.filter_by(DNI=data["DNI"]).first():
        return jsonify({"msg": "Ese DNI ya está registrado"}), 400


    if len(data["password"]) < 8:
        return jsonify({"msg": "La contraseña debe tener al menos 8 caracteres"}), 400
    
    iban = data.get("iban", "")
    if len(iban) < 15 or len(iban) > 34:
        return jsonify({"msg": "IBAN inválido. Debe tener entre 15 y 34 caracteres"}), 400

    existing_users = User.query.count()
    if existing_users > 0:
        return jsonify({"msg": "El registro inicial ya se realizó. Usa /login"}), 400
    

    print("STATUS cargado:", STATUS)
    print("Status recibido del cliente:", data.get("status"))
    
    if "status" not in data:
        return jsonify({"msg": "El campo 'status' es obligatorio"}), 400
    
    status_input = str(data["status"])

    if status_input not in STATUS:
        return jsonify({"msg": f"Estado inválido. Opciones: {', '.join(STATUS.keys())}"}), 400
    
    status_id = STATUS[status_input]

    birth_date = datetime.fromisoformat(data["birth_date"])
   

    new_user = User(
        email=data["email"],
        address=data.get("address"),
        birth_date=birth_date,
        iban=data.get("iban"),
        first_name=data["first_name"],
        surname=data["surname"],
        last_name=data["last_name"],
        DNI=data["DNI"],
        rol=data["rol"],
        is_admin=True,
        status_id=status_id
)
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User boss created successfully"}), 200


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data["email"] or not data["password"]:
        return jsonify({"msg": "Email and password are required"}), 400
    
    user = db.session.execute(db.select(User).where(
        User.email == data["email"]
    )).scalar_one_or_none()

    if user is None:
        return jsonify({"msg": "Invalid email or password"}), 401
    
    if user.check_password(data["password"]):
        access_token = create_access_token(identity=str(user.id))
        return jsonify ({"msg": "Login succesful", "token": access_token}), 200
    else:
        return jsonify({"msg": "Invalid email or password"}), 401

#Usuarios
@api.route("/users", methods=["GET"])
def get_users():
    users = User.query.all() 
    return jsonify([user.serialize() for user in users]), 200


@api.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 400
    return jsonify(user.serialize()), 200


@api.route("/users", methods=["POST"])
def create_user():
    identity = get_jwt_identity()
    if not identity.get("is_admin"):
        return jsonify({"msg": "Solo el admin puede crear usuarios"}), 400
    
    data = request.json
    required_fields = ["email", "password", "first_name", "surname", "last_name", "DNI", "rol", "is_admin", "status_id, iban, address, birth_date"]
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"msg": f"Missing fields: {', '.join(missing)}"}), 400
    
    existing_user = db.session.execute(
        db.select(User).where(User.email == data["email"])
    ).scalar_one_or_none()
    if existing_user:
        return jsonify({"msg": "User with this email already exists"}), 400


    user = User(
        last_name=data["last_name"],
        address=data["address"],
        birth_date=data["birth_date"],
        iban=data["iban"],
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
        total_days= data.get("total_days"),
        used_days= data.get("used_days"),
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
    return jsonify(schedule.serialize()), 200


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

    req_status = StatusRequest(
        request_id=req.id,
        accepted=data.get("accepted"),
        cancelled=data.get("cancelled"),
        pending=data.get("pending")
    )
    db.session.add(req_status)
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


#Cambio de estado

@api.route('/user/<int:user_id>/status', methods=['PUT'])
def toggle_status(user_id):
    data = request.get_json(silent=True) or {}
    action = data.get("action")


    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    current = user.status.name


    transitions = {
        "toggle_work": {
            "Inactivo": "Activo",
            "Activo": "Inactivo"
        },
        "toggle_break": {
            "Activo": "En descanso",
            "En descanso": "Activo",
        },
    }

    if action not in transitions:
        return jsonify({"msg": "Invalid action (use 'toggle_work' or 'toggle_break')"}), 400

    new_status_name = transitions[action].get(current)
    if not new_status_name:
        return jsonify({"msg": f"No puedes usar '{action}' desde '{current}'"}), 400


    new_status_id = STATUS[new_status_name]
    user.status_id = new_status_id
    db.session.add(user)


    history_entry = StatusHistory(user_id=user.id, status_id=new_status_id)
    db.session.add(history_entry)

    db.session.commit()

    return jsonify({
        "msg": f"Status updated to {new_status_name}",
        "user_id": user.id,
        "status": new_status_name,
        "history_entry": history_entry.serialize()
    }), 200

#Consultar estados

@api.route('/user/<int:user_id>/status/history', methods=['GET'])
def get_status_history(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    history = (
        db.session.query(StatusHistory)
        .filter_by(user_id=user.id)
        .order_by(StatusHistory.timestamp.asc())
        .all()
    )

    return jsonify([h.serialize() for h in history]), 200

@api.route ('/status', methods= ['POST'])
def log_status():
    data = request.get_json()

    if "name" not in data or not data["name"].strip():
        return jsonify({"msg": "El campo name es obligatorio"}), 400
    
    existing = Status.query.filter_by(name=data["name"].strip()).first()
    if existing:
        return jsonify({"msg": f"El estado '{data['name']}' ya existe"}), 400
    
    new_status = Status(name=data["name"])
    db.session.add(new_status)
    db.session.commit()


    return jsonify({
        "msg": f"Estado '{new_status.name}' fue creado correctamente",
        "status": new_status.serialize()
    }), 200


@api.route('/status', methods=['GET'])
def get_status():
    status = Status.query.all()
    return jsonify([s.serialize() for s in status]), 200