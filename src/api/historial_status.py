from .models import db, Status

STATUS = {}

def create_status():
    
    statuses = {
        1: "Activo",
        2: "Inactivo",
        3: "En descanso",
        4: "De vacaciones",
    }

    for id_, name in statuses.items():

        status = db.session.get(Status, id_)
        if not status:
            db.session.add(Status(id=id_, name=name))

    db.session.commit()

    all_status = db.session.execute(db.select(Status)).scalars().all()
    print("Status en la DB después de create_status():", [(s.id, s.name) for s in all_status])

def load_statuses():
    global STATUS
    STATUS = {s.name: s.id for s in db.session.execute(db.select(Status)).scalars().all()}
    print("STATUS cargado en memoria:", STATUS)