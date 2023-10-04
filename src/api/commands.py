import click
from api.models import db, Roomie

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
    @app.cli.command("insert-test-roomies") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_roomies(count):
        print("Creating test roomies")
        for x in range(1, int(count) + 1):
            roomie = Roomie()
            roomie.email = "test_roomie" + str(x) + "@test.com"
            roomie.password = "123456"
            roomie.first_name = "Juan"
            roomie.last_name = "Plaza"
            roomie.phone_number = "666777888"
            roomie.avatar = ""
            roomie.is_admin = True
            db.session.add(roomie)
            db.session.commit()
            print("Roomie: ", roomie.email, " created.")

        print("All test roomies created")

"""
    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
"""