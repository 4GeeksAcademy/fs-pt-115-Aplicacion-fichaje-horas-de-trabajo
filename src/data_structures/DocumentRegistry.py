from flask import Flask
from datetime import datetime

app = Flask(__name__)

class DocumentRegistry:
    def __init__(self):
        self._next_id = 1
        self._documents = []

    def _generate_id(self):
        eid = self._next_id
        self._next_id += 1
        return eid

    def add_document(self, document):
        if "id" not in document:
            document["id"] = self._generate_id()

        self._documents.append(document)
        return document

    def get_document(self, id):
        for e in self._documents:
            if e["id"] == id:
                return e
        return None

    def get_all_documents(self):
        return self._documents

    def delete_document(self, id):
        for e in self._documents:
            if e["id"] == id:
                self._documents.remove(e)
                return True
        return False
