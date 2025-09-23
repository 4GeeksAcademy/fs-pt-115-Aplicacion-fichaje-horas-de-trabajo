"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Status, Holidays, Schedule, Signing, Request, RequestType, StatusHistory, StatusRequest, Document, DocumentType
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import time, datetime, timezone
from api.historial_status import STATUS
from flask_jwt_extended import create_access_token 
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from .historial_status import STATUS

api = Blueprint("api", __name__)

CORS(api, resources={r"/api/*": {"origins": "*"}})




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

    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({"msg": "User boss created successfully", "token": access_token, "user": new_user.serialize()}), 200


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
        expires = current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]
        expire_time = datetime.now(timezone.utc) + expires

        return jsonify({
            "msg": "Login successful",
            "token": access_token,
            "expires_at": expire_time.isoformat(), 
            "user": user.serialize()
        }), 200
    else:
        return jsonify({"msg": "Invalid email or password"}), 401

#Usuarios
@api.route("/users", methods=["GET"])
# @jwt_required()
def get_users():

    users = User.query.all() 
    return jsonify([user.serialize() for user in users]), 200


@api.route("/users/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 400
    return jsonify(user.serialize()), 200

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 400

    return jsonify({"user": user.serialize()}), 200

@api.route("/users", methods=["POST"])
@jwt_required()
def create_user():
    identity = get_jwt_identity()
    if not identity.get("is_admin"):
        return jsonify({"msg": "Solo el admin puede crear usuarios"}), 400
    
    data = request.get_json()

    required_fields = ["email", "password", "first_name", "surname", "last_name", "DNI", "rol", "address", "iban", "birth_date", "is_admin"]
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
        is_admin=["is_admin"],
        status_id=status_id
)
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({"msg": "User boss created successfully", "token": access_token, "user": new_user.serialize()}), 200

@api.route("/users/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    if not user: 
        return jsonify({"error": "Usuario no encontrado"}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado"}), 200


#Vacaciones

@api.route("/holidays", methods=["GET"])
@jwt_required()
def get_holidays():
    user_id = get_jwt_identity()
    holidays = Holidays.query.filter_by(user_id=user_id).all()
    return jsonify([h.serialize() for h in holidays]), 200

@api.route("/holidays", methods=["POST"])
@jwt_required()
def create_holiday():
    user_id = get_jwt_identity()
    data = request.get_json()

    fecha_inicio = datetime.strptime(data.get("fechaInicio"), "%Y-%m-%d").date()
    fecha_fin = datetime.strptime(data.get("fechaFin"), "%Y-%m-%d").date()

    holiday = Holidays(
        user_id=user_id,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        horas=data.get("horas"),
        tipo=data.get("tipo"),
        descripcion=data.get("descripcion"),
    )

    db.session.add(holiday)
    db.session.commit()

    return jsonify(holiday.serialize()), 201


@api.route("/holidays/<int:holiday_id>", methods=["PUT"])
@jwt_required()
def update_holiday(holiday_id):
    user_id = get_jwt_identity()
    holiday = Holidays.query.filter_by(id=holiday_id, user_id=user_id).first()
    if not holiday:
        return jsonify({"message": "Holiday not found"}), 404

    data = request.get_json()

    
    if "fechaInicio" in data:
        holiday.fecha_inicio = datetime.strptime(data["fechaInicio"], "%Y-%m-%d").date()
    if "fechaFin" in data:
        holiday.fecha_fin = datetime.strptime(data["fechaFin"], "%Y-%m-%d").date()
    if "horas" in data:
        holiday.horas = data["horas"]
    if "tipo" in data:
        holiday.tipo = data["tipo"]
    if "descripcion" in data:
        holiday.descripcion = data["descripcion"]

    db.session.commit()
    return jsonify(holiday.serialize()), 200


@api.route("/holidays/<int:holiday_id>", methods=["DELETE"])
@jwt_required()
def delete_holiday(holiday_id):
    user_id = get_jwt_identity()
    holiday = Holidays.query.filter_by(id=holiday_id, user_id=user_id).first()
    if not holiday:
        return jsonify({"message": "Holiday not found"}), 404

    db.session.delete(holiday)
    db.session.commit()
    return jsonify({"message": "Holiday deleted successfully"}), 200


#Horarios

@api.route("/users/<int:user_id>/schedules", methods=["GET"])
@jwt_required()
def get_schedules(user_id):
    schedules = Schedule.query.filter_by(user_id=user_id).all()
    return jsonify([s.serialize() for s in schedules])

@api.route("/users/<int:user_id>/schedules", methods=["POST"])
@jwt_required()
def add_schedule(user_id):
    data = request.json
    schedule = Schedule(
        user_id=user_id,
        start_time=datetime.fromisoformat(data["start_datetime"]),
        end_time=datetime.fromisoformat(data["end_datetime"]),
    )
    db.session.add(schedule)
    db.session.commit()
    return jsonify(schedule.serialize()), 200


@api.route("/users/<int:user_id>/schedules/<int:schedule_id>", methods=["PUT"])
@jwt_required()
def update_schedule(user_id, schedule_id):
    schedule = Schedule.query.filter_by(user_id=user_id, id=schedule_id).first()
    if not schedule:
        return jsonify({"message": "Schedule not found"}), 404

    data = request.json
    if "shift" in data:
        schedule.shift = data["shift"]
    if "start_time" in data:
        schedule.start_time = time.fromisoformat(data["start_time"])
    if "end_time" in data:
        schedule.end_time = time.fromisoformat(data["end_time"])
    if "day" in data:
        schedule.day = data["day"]

    db.session.commit()
    return jsonify(schedule.serialize()), 200


@api.route("/users/<int:user_id>/schedules/<int:schedule_id>", methods=["DELETE"])
@jwt_required()
def delete_schedule(user_id, schedule_id):
    schedule = Schedule.query.filter_by(user_id=user_id, id=schedule_id).first()
    if not schedule:
        return jsonify({"message": "Schedule not found"}), 404

    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted successfully"}), 200


#Fichajes

@api.route("/users/<int:user_id>/signings", methods=["GET"])
@jwt_required()
def get_signings(user_id):
    signings = Signing.query.filter_by(user_id=user_id).all()
    return jsonify([s.serialize() for s in signings])

@api.route("/users/<int:user_id>/signings", methods=["POST"])
@jwt_required()
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
@jwt_required()
def get_requests(user_id):
    requests = Request.query.filter_by(user_id=user_id).all()
    return jsonify([r.serialize() for r in requests])

@api.route("/users/<int:user_id>/requests", methods=["POST"])
@jwt_required()
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

@api.route("/requests/<int:request_id>", methods=["PUT"])
@jwt_required()
def update_request(request_id):
    req = Request.query.get(request_id)
    if not req:
        return jsonify({"error": "Solicitud no encontrada"}), 404

    data = request.json

    if "admin_id" in data:
        req.admin_id = data["admin_id"]
    if "start_date" in data:
        req.start_date = datetime.fromisoformat(data["start_date"])
    if "end_date" in data:
        req.end_date = datetime.fromisoformat(data["end_date"])
    if "comment" in data:
        req.comment = data["comment"]


    req_type = RequestType.query.filter_by(request_id=request_id).first()
    if req_type:
        for field in ["holidays", "shift_change", "schedule_change", "salary_advance", "others"]:
            if field in data:
                setattr(req_type, field, data[field])

    req_status = StatusRequest.query.filter_by(request_id=request_id).first()
    if req_status:
        state_fields = {field: data[field] for field in ["accepted", "cancelled", "pending"] if field in data}

        if len([v for v in state_fields.values() if v]) > 1:
            return jsonify({"error": "Solo puede haber un estado activo a la vez"}), 400

        if state_fields:
            for field in ["accepted", "cancelled", "pending"]:
                setattr(req_status, field, state_fields.get(field, False))

    db.session.commit()
    return jsonify(req.serialize()), 200


@api.route("/requests/<int:request_id>", methods=["DELETE"])
@jwt_required()
def delete_request(request_id):
    req = Request.query.get(request_id)
    if not req:
        return jsonify({"error": "Solicitud no encontrada"}), 404
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Solicitud eliminada"}), 200


#Documentos

@api.route("/users/<int:user_id>/documents", methods=["GET"])
@jwt_required()
def get_documents(user_id):
    documents = Document.query.filter_by(user_id=user_id).all()
    return jsonify([doc.serialize() for doc in documents]), 200


@api.route("/users/<int:user_id>/documents", methods=["POST"])
@jwt_required()
def add_document(user_id):
    data = request.json
    doc = Document(
        user_id=user_id,
        file_url=data.get("file_url"),
        approved=data.get("approved", False)
    )
    db.session.add(doc)
    db.session.commit()

    if "type" in data:
        doc_type = DocumentType(
            document_id=doc.id,
            payroll=data["type"].get("payroll"),
            contract=data["type"].get("contract"),
            supporting_documents=data["type"].get("supporting_documents")
        )
        db.session.add(doc_type)
        db.session.commit()

    return jsonify(doc.serialize()), 201


@api.route("/users/<int:user_id>/documents/<int:doc_id>", methods=["PUT"])
@jwt_required()
def update_document(user_id, doc_id):
    doc = Document.query.filter_by(user_id=user_id, id=doc_id).first()
    if not doc:
        return jsonify({"msg": "Document not found"}), 404

    data = request.json
    if "file_url" in data:
        doc.file_url = data["file_url"]
    if "approved" in data:
        doc.approved = data["approved"]


    if "type" in data:
        doc_type = doc.types
        if doc_type:
            doc_type.payroll = data["type"].get("payroll", doc_type.payroll)
            doc_type.contract = data["type"].get("contract", doc_type.contract)
            doc_type.supporting_documents = data["type"].get("supporting_documents", doc_type.supporting_documents)
        else:
            doc_type = DocumentType(
                document_id=doc.id,
                payroll=data["type"].get("payroll"),
                contract=data["type"].get("contract"),
                supporting_documents=data["type"].get("supporting_documents")
            )
            db.session.add(doc_type)

    db.session.commit()
    return jsonify(doc.serialize()), 200


@api.route("/users/<int:user_id>/documents/<int:doc_id>", methods=["DELETE"])
@jwt_required()
def delete_document(user_id, doc_id):
    doc = Document.query.filter_by(user_id=user_id, id=doc_id).first()
    if not doc:
        return jsonify({"msg": "Document not found"}), 404

    if doc.types:
        db.session.delete(doc.types)

    db.session.delete(doc)
    db.session.commit()
    return jsonify({"msg": "Document deleted"}), 200

#Cambio de estado

@api.route('/user/<int:user_id>/status', methods=['PUT'])
@jwt_required()
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
@jwt_required()
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


@api.route('/users/exists', methods=['GET'])
def check_users():
    if User.query.first() is None:
        userCreated = False
    else:
        userCreated = True

    return jsonify({"user_created": userCreated})

@api.route ('/status', methods= ['POST'])
def create_status():
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
