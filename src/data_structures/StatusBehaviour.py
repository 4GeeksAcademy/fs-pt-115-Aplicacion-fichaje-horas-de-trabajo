from flask import Flask
from datetime import datetime

app = Flask(__name__)

class StatusBehaviour:
    def __init__(self):
        self._next_id = 1

    def _generate_id(self):
        eid = self._next_id
        self._next_id += 1
        return eid

    def set_status(self, user_id, status):
        newStatus = {
            'id': self._generate_id(),
            'worker_id': user_id,
            'status': status,
            'timestamp': datetime.utcnow()
        }
        return newStatus