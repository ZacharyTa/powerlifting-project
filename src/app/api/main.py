import sys
from database.sqlite import SQLiteDatabase
import requests
from bs4 import BeautifulSoup

def main():
    print("Main")
    db = SQLiteDatabase()
    db.update_comp_db()
    db.process_comp_db()

    #db.print_table()
    print("exitMain")

if __name__ == "__main__":
    main()