
import click
from api.models import db, User, DocumentType

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-document-types")
    def insert_document_types():
        document_types = ["contract", "payroll", "justificante"]
        created_count = 0

        for name in document_types:
            if not DocumentType.query.filter_by(name=name).first():
                doc_type = DocumentType(name=name)
                db.session.add(doc_type)
                created_count += 1

        db.session.commit()
        print(f"{created_count} document types inserted successfully.")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    