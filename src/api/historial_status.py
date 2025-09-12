from .models import db, Status

STATUS = {"Activo": 1,
          "Inactivo": 2,
          "En descanso": 3,
          "De vacaciones": 4}


def create_status():

    statuses = {
        "Activo": 1,
        "Inactivo": 2,
        "En descanso": 3,
        "De vacaciones": 4,
    }

    for id_, name in statuses.items():

        status = db.session.get(Status, id_)
        if not status:
            db.session.add(Status(id=id_, name=name))

    db.session.commit()

    all_status = db.session.execute(db.select(Status)).scalars().all()
    print("Status en la DB después de create_status():",
          [(s.id, s.name) for s in all_status])


def load_statuses():
    global STATUS
    STATUS = {s.name: s.id for s in db.session.execute(
        db.select(Status)).scalars().all()}
    print("STATUS cargado en memoria:", STATUS)
