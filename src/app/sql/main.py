from database.mySQLGCloud import MySQLGCloud
from tests.test_mySQLGCloud import TestMySQLGCloud

def main():
    print("Main")

    host_name = 'host_name'
    user_name = 'user_name'
    user_password = 'user_password'
    database_name = 'database_name'
    db = MySQLGCloud(host_name, user_name, user_password, database_name)
    db.initialize_tables()
    db.index_tables()
    db.update_comp_db()
    db.update_div_tables()
    db.process_comp_db()
    db.processDivsPercentiles()

    # db.drop_all_tables()

    print("exitMain")

if __name__ == "__main__":
    main()