from .models import db, Status

STATUS = {}

def load_statuses():
    #Carga todos los estados desde la DB en el diccionario global STATUS
    global STATUS
    STATUS = {s.name: s.id for s in db.session.execute(db.select(Status)).scalars().all()}
    print("STATUS historial cargado:", STATUS)