import sys
from database.sqlite import SQLiteDatabase

def main():
    print("Main")
    db = SQLiteDatabase()
    db.update_comp_db()
    db.process_comp_db()

    #db.print_table()
    print("exitMain")

if __name__ == "__main__":
    main()