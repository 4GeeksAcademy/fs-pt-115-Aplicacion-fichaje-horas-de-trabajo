from flask import Flask
from datetime import datetime

app = Flask(__name__)

class RequestRegistry:
    def __init__(self):
        self._next_id = 1
        self._requests = []

    def _generate_id(self):
        eid = self._next_id
        self._next_id += 1
        return eid

    def add_request(self, request):
        if "id" not in request:
            request["id"] = self._generate_id()

        self._requests.append(request)
        return request

    def get_request(self, id):
        for e in self._requests:
            if e["id"] == id:
                return e
        return None

    def get_all_requests(self):
        return self._requests

    def delete_request(self, id):
        for e in self._requests:
            if e["id"] == id:
                self._requests.remove(e)
                return True
        return False
    
    def set_request_status(self, request_id, status):
        newStatus = {
            'id': self._generate_id(),
            'request_id': request_id,
            'status': status,
        }
        return newStatus
