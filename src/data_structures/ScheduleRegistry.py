from flask import Flask
from datetime import datetime

app = Flask(__name__)

class ScheduleRegistry:
    def __init__(self):
        self._next_id = 1
        self._schedules = []

    def _generate_id(self):
        eid = self._next_id
        self._next_id += 1
        return eid

    def add_schedule(self, schedule):
        if "id" not in schedule:
            schedule["id"] = self._generate_id()
            
        self._schedules.append(schedule)
        return schedule

    def get_schedule(self, id):
        for e in self._schedules:
            if e["id"] == id:
                return e
        return None

    def get_all_schedules(self):
        return self._schedules

    def delete_schedule(self, id):
        for e in self._schedules:
            if e["id"] == id:
                self._schedules.remove(e)
                return True
        return False