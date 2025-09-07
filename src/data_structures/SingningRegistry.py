import os
from flask import Flask, jsonify
from datetime import datetime
import requests


app = Flask(__name__)


class singningRegisty:
    def __init__(self):
        self._next_id = 1
        self._singnings = []

    def _generate_id(self):
        eid = self._next_id
        self._next_id += 1
        return eid

    def _generate_singning(self, type): # Falta Probar
        response = requests.get(os.getenv('VITE_BACKEND_URL'), headers={
            "Authorization": os.getenv('API_KEY'),
        })

        if response.status_code == 200:
            data = response.json()


            singning = {
                "type": type,
                "datetime": datetime.timestamp(),
                "lat": data["latitude"],
                "long": data["longitude"]
            }     
        else :
            return jsonify({"msg": "Error"})
        
        self._singnings.append(singning)
        return singning

    def get_singning(self, id):
        for e in self._singnings:
            if e["id"] == id:
                return e
        return None

    def get_all_singnings(self):
        return self._singnings

    def delete_singning(self, id):
        for e in self._singnings:
            if e["id"] == id:
                self._singnings.remove(e)
                return True
        return False
