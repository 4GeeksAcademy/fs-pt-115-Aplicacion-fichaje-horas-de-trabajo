from flask import Flask
from datetime import datetime

app = Flask(__name__)

class EmployeeRegistry:
    def __init__(self):
        self._next_id = 1
        self._employees = []

    def _generate_id(self):
        eid = self._next_id
        self._next_id += 1
        return eid

    def add_employee(self, employee):
        if "id" not in employee:
            employee["id"] = self._generate_id()
        employee["clock_ins"] = []
        employee["clock_outs"] = []
        self._employees.append(employee)
        return employee

    def get_employee(self, id):
        for e in self._employees:
            if e["id"] == id:
                return e
        return None

    def get_all_employees(self):
        return self._employees

    def delete_employee(self, id):
        for e in self._employees:
            if e["id"] == id:
                self._employees.remove(e)
                return True
        return False

#En función al tipo que se le pase, será fichaje de salida o de entrada. Los tipos son "in" o "out".
    def register_clock(self, id, type="in", latitude=None, longitude=None):
        employee = self.get_employee(id)
        if not employee:
            return None
        
        signing = {
            "timestamp": datetime.utcnow().isoformat(),
            "latitude": latitude,
            "longitude": longitude,
            "type": type
        }

        if type is "in":
            employee["clock_ins"].append(signing)
        elif type is "out":
            employee["clock_outs"].append(signing)

        return signing