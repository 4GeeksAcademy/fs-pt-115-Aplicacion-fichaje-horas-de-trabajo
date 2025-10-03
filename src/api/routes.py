"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import  request, jsonify,  Blueprint, current_app
from api.models import db, User, Status, Holidays,HolidayStatus, Schedule, Signing, Request, RequestType, StatusHistory, StatusRequest, Document, DocumentType, SignType
from api.utils import generate_sitemap, APIException, UPLOAD_FOLDER, allowed_file, secure_filename, os
from flask_cors import CORS
from datetime import time, datetime, timezone, date
from api.historial_status import STATUS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from .historial_status import STATUS
import base64
from flask import send_from_directory
from flask_bcrypt import generate_password_hash


api = Blueprint("api", __name__)

CORS(api, resources={r"/api/*": {"origins": "*"}})


@api.route('/signup', methods=['POST'])
def signup():

    data = request.get_json()

    required_fields = ["email", "password", "first_name", "surname",
                       "last_name", "DNI", "rol", "address", "iban", "birth_date"]
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

    birth_date = datetime.fromisoformat(data["birth_date"].replace("Z", "+00:00"))

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

# Usuarios


@api.route("/users", methods=["GET"])
@jwt_required()
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
    print("Hola")
    identity = get_jwt_identity()
    user = User.query.get(identity)
    print(type(identity))
    if not user.is_admin:
        return jsonify({"msg": "Solo el admin puede crear usuarios"}), 400
    data = request.json
    print(data)
    required_fields = ["email", "password", "first_name", "surname", "last_name", "DNI", "rol", "is_admin", "status", "iban", "address", "birth_date"]

    missing = [f for f in required_fields if f not in data or data[f] is None]

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
        is_admin=data["is_admin"],
        status_id=status_id
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({"msg": "User created successfully", "token": access_token, "user": new_user.serialize()}), 200


@api.route("/users/<int:id>", methods=["PUT"])
@jwt_required()
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    if "password" in data and data["password"]:
        user.password_hash = generate_password_hash(data["password"])


    if "last_name" in data: user.last_name = data["last_name"]
    if "surname" in data: user.surname = data["surname"]
    if "first_name" in data: user.first_name = data["first_name"]
    if "email" in data: user.email = data["email"]
    if "DNI" in data: user.DNI = data["DNI"]
    if "rol" in data: user.rol = data["rol"]
    if "is_admin" in data: user.is_admin = data["is_admin"]
    if "birth_date" in data: user.birth_date = datetime.strptime(data["birth_date"], "%Y-%m-%d")
    if "address" in data: user.address = data["address"]
    if "iban" in data: user.iban = data["iban"]
    if "profile_image" in data: user.profile_image = data["profile_image"]

    db.session.commit()

    return jsonify(user.serialize()), 200


@api.route("/users/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado"}), 200


# Vacaciones

@api.route("/holidays", methods=["GET"])
@jwt_required()
def get_holidays():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.is_admin:
        holidays = Holidays.query.all()
    else:
        holidays = Holidays.query.filter_by(user_id=user_id).all()

    return jsonify([h.serialize() for h in holidays]), 200


@api.route("/holidays", methods=["POST"])
@jwt_required()
def create_holiday():
    user_id = get_jwt_identity()
    data = request.get_json()

    fecha_inicio = datetime.strptime(
        data.get("fechaInicio"), "%Y-%m-%d").date()
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
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    holiday = Holidays.query.get(holiday_id)
    if not holiday:
        return jsonify({"message": "Holiday not found"}), 404

    data = request.get_json()

    if not user.is_admin:
        if holiday.user_id != user_id:
            return jsonify({"message": "No autorizado"}), 403
        if "status" in data or "adminMessage" in data:
            return jsonify({"message": "No autorizado"}), 403
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
    else:
        if "status" in data:
            holiday.status = HolidayStatus(data["status"])
        if "adminMessage" in data:
            holiday.admin_message = data["adminMessage"]

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

# Horarios


@api.route("/users/<int:user_id>/schedules", methods=["GET"])
@jwt_required()
def get_schedules(user_id):
    schedules = Schedule.query.filter_by(user_id=user_id).all()
    print(schedules)
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
    schedule = Schedule.query.filter_by(
        user_id=user_id, id=schedule_id
    ).first()
    if not schedule:
        return jsonify({"message": "Schedule not found"}), 404

    data = request.json

    if "shift" in data:
        schedule.shift = data["shift"]

    if "start_time" in data:
        raw = data["start_time"]
        try:
            # Caso 1: frontend manda "HH:MM:SS"
            t = time.fromisoformat(raw)
            schedule.start_time = datetime.combine(date.today(), t)
        except ValueError:
            # Caso 2: frontend manda "2025-10-01T07:57:00.000Z"
            schedule.start_time = datetime.fromisoformat(raw.replace("Z", "+00:00"))

    if "end_time" in data:
        raw = data["end_time"]
        try:
            t = time.fromisoformat(raw)
            schedule.end_time = datetime.combine(date.today(), t)
        except ValueError:
            schedule.end_time = datetime.fromisoformat(raw.replace("Z", "+00:00"))

    if "day" in data:
        schedule.day = data["day"]

    db.session.commit()
    return jsonify(schedule.serialize()), 200


@api.route("/users/<int:user_id>/schedules/<int:schedule_id>", methods=["DELETE"])
@jwt_required()
def delete_schedule(user_id, schedule_id):
    schedule = Schedule.query.filter_by(
        user_id=user_id, id=schedule_id).first()
    if not schedule:
        return jsonify({"message": "Schedule not found"}), 404

    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted successfully"}), 200


# Fichajes

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
        sign_type_id=data.get("sign_type_id"),
        datetime=datetime.fromisoformat(
            data["datetime"].replace("Z", "+00:00")),
        lat=data.get("lat"),
        long=data.get("long")
    )

    db.session.add(signing)
    db.session.commit()

    return jsonify(signing.serialize()), 201

# Requests

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
        state_fields = {field: data[field] for field in [
            "accepted", "cancelled", "pending"] if field in data}

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


# Documentos

@api.route("/users/<int:user_id>/documents", methods=["GET"])
@jwt_required()
def get_documents(user_id):
    documents = Document.query.filter_by(user_id=user_id).all()
    return jsonify([doc.serialize() for doc in documents]), 200


@api.route("/users/<int:user_id>/documents", methods=["POST"])
@jwt_required()
def add_document_file(user_id):
    print("Hola")
    if "file" not in request.files:
        return jsonify({"msg": "Archivo es requerido"}), 400

    file = request.files["file"]
    type_id = request.form.get("type_id")

    if not type_id:
        return jsonify({"msg": "type_id es requerido"}), 400

    if file.filename == "":
        return jsonify({"msg": "Archivo no seleccionado"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "Tipo de archivo no permitido"}), 400

    file_data = base64.b64encode(file.read()).decode('utf-8')

    doc = Document(
        user_id=user_id,
        type_id=int(type_id),
        file_url=file_data,
    )
    db.session.add(doc)
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
    if "type_id" in data:
        doc.type_id = data["type_id"]

    db.session.commit()
    return jsonify(doc.serialize()), 200


@api.route("/users/<int:user_id>/documents/<int:doc_id>", methods=["DELETE"])
@jwt_required()
def delete_document(user_id, doc_id):
    doc = Document.query.filter_by(user_id=user_id, id=doc_id).first()
    if not doc:
        return jsonify({"msg": "Document not found"}), 404

    db.session.delete(doc)
    db.session.commit()
    return jsonify({"msg": "Document deleted"}), 200

# Contracts


@api.route("/users/<int:user_id>/documents/contracts", methods=["GET"])
@jwt_required()
def get_contracts(user_id):
    contracts = Document.query.filter_by(user_id=user_id, type_id=1).all()
    return jsonify([doc.serialize() for doc in contracts]), 200


@api.route("/users/<int:user_id>/documents/contracts", methods=["POST"])
@jwt_required()
def add_contract(user_id):
    if "file" not in request.files:
        return jsonify({"msg": "Archivo es requerido"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"msg": "Archivo no seleccionado"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "Tipo de archivo no permitido"}), 400

    user_folder = os.path.join(UPLOAD_FOLDER, str(user_id))
    os.makedirs(user_folder, exist_ok=True)

    filename = secure_filename(file.filename)
    file_path = os.path.join(user_folder, filename)
    counter = 1
    base, ext = os.path.splitext(filename)
    while os.path.exists(file_path):
        filename = f"{base}_{counter}{ext}"
        file_path = os.path.join(user_folder, filename)
        counter += 1

    file.save(file_path)

    doc = Document(
        user_id=user_id,
        type_id=1,
        file_url=file_path,
        approved=False
    )
    db.session.add(doc)
    db.session.commit()

    return jsonify(doc.serialize()), 201

# Payrolls


@api.route("/users/<int:user_id>/documents/payrolls", methods=["GET"])
@jwt_required()
def get_payrolls(user_id):
    payrolls = Document.query.filter_by(user_id=user_id, type_id=2).all()
    return jsonify([doc.serialize() for doc in payrolls]), 200


@api.route("/users/<int:user_id>/documents/payrolls", methods=["POST"])
@jwt_required()
def add_payroll(user_id):
    if "file" not in request.files:
        return jsonify({"msg": "Archivo es requerido"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"msg": "Archivo no seleccionado"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "Tipo de archivo no permitido"}), 400

    user_folder = os.path.join(UPLOAD_FOLDER, str(user_id))
    os.makedirs(user_folder, exist_ok=True)

    filename = secure_filename(file.filename)
    file_path = os.path.join(user_folder, filename)
    counter = 1
    base, ext = os.path.splitext(filename)
    while os.path.exists(file_path):
        filename = f"{base}_{counter}{ext}"
        file_path = os.path.join(user_folder, filename)
        counter += 1

    file.save(file_path)

    doc = Document(
        user_id=user_id,
        type_id=2,
        file_url=file_path,
        approved=False
    )
    db.session.add(doc)
    db.session.commit()

    return jsonify(doc.serialize()), 201

# Tipos de documentos


@api.route("/document_types", methods=["POST"])
@jwt_required()
def create_document_type():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"msg": "El nombre es requerido"}), 400

    if DocumentType.query.filter_by(name=name).first():
        return jsonify({"msg": "Ese tipo ya existe"}), 400

    doc_type = DocumentType(name=name)
    db.session.add(doc_type)
    db.session.commit()

    return jsonify(doc_type.serialize()), 201


@api.route("/document_types", methods=["GET"])
@jwt_required()
def get_document_types():
    types = DocumentType.query.all()
    return jsonify([t.serialize() for t in types]), 200


@api.route("/document-types/<int:type_id>", methods=["GET"])
@jwt_required()
def get_document_type(type_id):
    doc_type = DocumentType.query.get(type_id)
    if not doc_type:
        return jsonify({"msg": "Tipo no encontrado"}), 404
    return jsonify(doc_type.serialize()), 200


@api.route("/document_types/<int:type_id>", methods=["DELETE"])
@jwt_required()
def delete_document_type(type_id):
    doc_type = DocumentType.query.get(type_id)
    if not doc_type:
        return jsonify({"msg": "Tipo no encontrado"}), 404

    db.session.delete(doc_type)
    db.session.commit()
    return jsonify({"msg": "Tipo eliminado"}), 200

# Cambio de estado


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

# Consultar estados


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


@api.route('/status', methods=['POST'])
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


@api.route('/users/<int:user_id>/signtypes', methods=['GET'])
@jwt_required()
def get_sign_types(user_id):

    # Devuelve el tipo de fichaje que debería usar el usuario según su último fichaje.

    last_signing = Signing.query.filter_by(user_id=user_id)\
        .order_by(Signing.datetime.desc())\
        .first()

    if not last_signing:
        first_sign_type = SignType.query.filter_by(name="In").first()
        return jsonify(first_sign_type.serialize()), 200

    current_type = last_signing.sign_type

    if current_type.name.lower() == "in":
        next_sign_type = SignType.query.filter_by(name="Out").first()
    else:
        next_sign_type = SignType.query.filter_by(name="In").first()

    if not next_sign_type:
        return jsonify({"message": "No se encontró el siguiente tipo de fichaje"}), 404

    return jsonify(next_sign_type.serialize()), 200


@api.route('/signtypes', methods=['GET'])
@jwt_required()
def get_all_sign_types():

    # Devuelve todos los tipos de fichajes

    signs_all = SignType.query.all()

    return jsonify([signtype.serialize() for signtype in signs_all]), 200


@api.route("/users/<int:user_id>/signings/<int:sign_id>", methods=["DELETE"])
@jwt_required()
def delete_sign(user_id, sign_id):
    sign = Signing.query.get(sign_id)

    if not sign or sign.user_id != user_id:
        return jsonify({"error": "Fichaje no encontrado"}), 404


    sign.is_historic = True
    db.session.commit()
    return jsonify({"message": "Fichaje convertido a historico"}), 200


@api.route("/users/<int:user_id>/signings/<int:sign_id>", methods=["PUT"])
@jwt_required()
def update_signing(user_id, sign_id):
    data = request.get_json()

    sign = Signing.query.filter_by(user_id=user_id, id=sign_id).first()
    if not sign:
        return jsonify({"msg": "Signing not found"}), 404

    if "lat" in data:
        sign.lat = data["lat"]
    if "long" in data:
        sign.long = data["long"]
    if "datetime" in data:
        try:
            sign.datetime = datetime.fromisoformat(
                data["datetime"].replace("Z", "+00:00"))
        except Exception:
            return jsonify({"msg": "Invalid datetime format"}), 400
    if "sign_type_id" in data:
        if isinstance(data["sign_type_id"], str):
            sign_type = SignType.query.filter_by(name=data["sign_type_id"]).first()
            if not sign_type:
                return jsonify({"msg": "Invalid sign_type"}), 400
            sign.sign_type_id = sign_type.id
        else:
            sign.sign_type_id = data["sign_type_id"]

    db.session.commit()
    return jsonify(sign.serialize()), 200


@api.route("/users/<int:user_id>/profile_image", methods=["POST"])
@jwt_required()
def upload_profile_image(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if "image" not in request.files:
        return jsonify({"msg": "No se subió ninguna imagen"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"msg": "Archivo vacío"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "Tipo de archivo no permitido"}), 400

    filename = secure_filename(file.filename)
    upload_folder = os.path.join(os.getcwd(), "uploads")
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.profile_image = f"/uploads/{filename}"
    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route('/uploads/<path:filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(os.path.join(os.getcwd(), "uploads"), filename)

@api.route('/users/<int:user_id>/profile_image', methods=['GET'])
@jwt_required()
def get_profile_image(user_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 400

    return jsonify({"profile_image": user.profile_image}), 200