from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, DateTime, Float, Time, text, Date, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import time, datetime, timezone, date

db = SQLAlchemy()



class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    surname: Mapped[str] = mapped_column(String(120), nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    DNI: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    rol: Mapped[str] = mapped_column(String(20), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    status_id: Mapped[int] = mapped_column(ForeignKey("status.id"), nullable=False)
    birth_date: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    iban: Mapped[str] = mapped_column(String(34), nullable=False)

    documents: Mapped[list["Document"]] = relationship(back_populates="user")
    holidays: Mapped[list["Holidays"]] = relationship(back_populates="user")
    schedules: Mapped[list["Schedule"]] = relationship(back_populates="user")
    signings: Mapped[list["Signing"]] = relationship(back_populates="user")
    requests: Mapped[list["Request"]] = relationship(back_populates="employee", foreign_keys=lambda: Request.user_id)
    admin_request: Mapped[list["Request"]] = relationship(back_populates="admin", foreign_keys=lambda: Request.admin_id)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "last_name": self.last_name,
            "surname": self.surname,
            "first_name": self.first_name,
            "email": self.email,
            "birth_date": self.birth_date.strftime("%d/%m/%Y") if self.birth_date else None,
            "address": self.address,
            "iban": self.iban,
            "DNI": self.DNI,
            "rol": self.rol,
            "is_admin": self.is_admin,
            "status_id": self.status_id
        }


class Status(db.Model):
    __tablename__ = "status"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    users: Mapped[list["User"]] = relationship(backref="status")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

class StatusHistory(db.Model):
    __tablename__ = "status_history"

    id : Mapped[int]= mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    status_id: Mapped[int] = mapped_column(Integer, ForeignKey("status.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


    user = db.relationship("User", backref="status_history")
    status = db.relationship("Status", backref="status_history")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "status": self.status.name if self.status else None,
            "timestamp": self.timestamp.isoformat()
        }


class Document(db.Model):
    __tablename__ = "document"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    file: Mapped[str] = mapped_column(String(255))

    user: Mapped["User"] = relationship(back_populates="documents")
    types: Mapped[list["DocumentType"]] = relationship(back_populates="document")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "file": self.file
        }



class DocumentType(db.Model):
    __tablename__ = "document_type"

    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("document.id"))
    payroll: Mapped[str] = mapped_column(String(100))
    contract: Mapped[str] = mapped_column(String(100))
    supporting_documents: Mapped[str] = mapped_column(String(100))

    document: Mapped["Document"] = relationship(back_populates="types")

    def serialize(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "payroll": self.payroll,
            "contract": self.contract,
            "supporting_documents": self.supporting_documents
        }


class Request(db.Model):
    __tablename__ = "request"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    admin_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    start_date: Mapped[DateTime] = mapped_column(DateTime)
    end_date: Mapped[DateTime] = mapped_column(DateTime)
    comment: Mapped[str] = mapped_column(String(255))

    employee: Mapped["User"] = relationship(back_populates="requests", foreign_keys=[user_id])
    admin: Mapped["User"] = relationship(back_populates="admin_request", foreign_keys=[admin_id])
    request_types: Mapped[list["RequestType"]] = relationship(back_populates="request")
    request_status: Mapped[list["StatusRequest"]] = relationship(back_populates="request")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "admin_id": self.admin_id,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "comment": self.comment
        }


class RequestType(db.Model):
    __tablename__ = "request_type"

    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("request.id"))
    holidays: Mapped[str] = mapped_column(String(100))
    shift_change: Mapped[str] = mapped_column(String(100))
    schedule_change: Mapped[str] = mapped_column(String(100))
    salary_advance: Mapped[str] = mapped_column(String(100))
    others: Mapped[str] = mapped_column(String(100))

    request: Mapped["Request"] = relationship(back_populates="request_types")

    def serialize(self):
        return {
            "id": self.id,
            "request_id": self.request_id,
            "holidays": self.holidays,
            "shift_change": self.shift_change,
            "schedule_change": self.schedule_change,
            "salary_advance": self.salary_advance,
            "others": self.others
        }

class StatusRequest(db.Model):
    __tablename__ = "request_status"

    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("request.id"))
    accepted: Mapped[str] = mapped_column(String(250))
    cancelled : Mapped[str] = mapped_column(String(250))
    pending : Mapped[bool] = mapped_column(Boolean, default=True)

    request: Mapped["Request"] = relationship(back_populates="request_status")



class Holidays(db.Model):
    __tablename__ = "holidays"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    horas: Mapped[str | None] = mapped_column(String(10))
    tipo: Mapped[str] = mapped_column(String(50), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(String(500))

    user: Mapped["User"] = relationship(back_populates="holidays")

    def serialize(self):
        return {
            "id": self.id,
            "fechaInicio": str(self.fecha_inicio),
            "fechaFin": str(self.fecha_fin),
            "horas": self.horas,
            "tipo": self.tipo,
            "descripcion": self.descripcion,
        }

class Schedule(db.Model):
    __tablename__ = "schedule"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    start_time: Mapped[datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime] = mapped_column(DateTime)

    user: Mapped["User"] = relationship(back_populates="schedules")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "start_time": str(self.start_time) if self.start_time else None,
            "end_time": str(self.end_time) if self.end_time else None,
        }



class Signing(db.Model):
    __tablename__ = "signing"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    sign_type_id: Mapped[int] = mapped_column(ForeignKey("signtype.id"))
    datetime: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc)) # type: ignore
    lat: Mapped[float] = mapped_column(Float)
    long: Mapped[float] = mapped_column(Float)

    user: Mapped["User"] = relationship(back_populates="signings")
    sign_type: Mapped["SignType"] = relationship(back_populates="signings")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "sign_type_id": self.sign_type_id,
            "datetime": self.datetime.isoformat() if self.datetime else None,
            "lat": self.lat,
            "long": self.long,
        }


class SignType(db.Model):
    __tablename__ = "signtype"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    signings: Mapped[list["Signing"]] = relationship(back_populates="sign_type")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }