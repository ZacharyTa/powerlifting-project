import requests
import sqlite3
import os
import pandas as pd
from bs4 import BeautifulSoup

class SQLiteDatabase:

    def __init__(self, db_path="src/app/api/database/usapl.db"):
        
        self.db_path = db_path
        self.conn = None

        # Private Class Variables
        self.__competitions_table = 'competitions_table'
        self.__lifts_table = 'lifts_table'
        self.__lifters_table = 'lifters_table'

        self.initialize_db(self.db_path)
    
    def initialize_db(self, db_path):
        print("initdb")
        
        # Initialize the database - create it and its tables if they don't exist.
        if not os.path.exists(self.db_path):
            self.connect()

            # List of SQL commands to create tables
            table_creation_commands = [
                f"""CREATE TABLE IF NOT EXISTS {self.__competitions_table} (
                    competition_id INTEGER PRIMARY KEY,
                    date DATE NOT NULL,
                    name TEXT NOT NULL,
                    sanction TEXT,
                    state TEXT,
                    results INTEGER
                )""",
                f"""CREATE TABLE IF NOT EXISTS {self.__lifts_table} (
                    competition_id INTEGER,
                    lifter_id INTEGER,
                    name TEXT,
                    sex TEXT,
                    age INTEGER,
                    age_div TEXT,
                    weight_div TEXT,
                    placing INTEGER,
                    YOB INTEGER,
                    team TEXT,
                    state TEXT,
                    lot INTEGER
                    weight INTEGER,
                    squat1 INTEGER,
                    squat2 INTEGER,
                    squat3 INTEGER,
                    bench1 INTEGER,
                    bench2 INTEGER,
                    bench3 INTEGER,
                    deadlift1 INTEGER,
                    deadlift2 INTEGER,
                    deadlift3 INTEGER,
                    total INTEGER,
                    points INTEGER,
                    bp_points INTEGER,
                    FOREIGN KEY(competition_id) REFERENCES {self.__competitions_table}(competition_id),
                    FOREIGN KEY(lifter_id) REFERENCES {self.__lifters_table}(lifter_id)
                )""",
                f"""CREATE TABLE IF NOT EXISTS {self.__lifters_table} (
                    lifter_id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    YOB INTEGER
                )""",
            ]

            for command in table_creation_commands:
                self.conn.execute(command)

            self.__commit()
        else:
            # Database already exists, just establish a connection
            self.connect()

    def connect(self):
        self.conn = sqlite3.connect(self.db_path)

    def update_db(self):

        #Get USPAL competition lifting database
        comp_listing_ur = "https://usapl.liftingdatabase.com/competitions"
        home_page = requests.get(comp_listing_ur)
        soup = BeautifulSoup(home_page.content, "html.parser")

        #Get list of competitions into pd
        #pd = (Date, CompID, CompName, Compurl)
        comp_list_tbody = soup.find("table", class_="tabledata")
        rows = comp_list_tbody.find_all('tr')
        for row in rows:
            cells = row.find_all("td")
            if len(cells) > 1:  # Ensure there are enough cells in the row
                date = cells[0].text.strip()  # Get date from the first cell
                href_element = cells[1].find('a')  # Find the 'a' tag in the second cell

                if href_element and 'href' in href_element.attrs:
                    href_link = href_element.attrs['href']
                    href_full_link = "https://usapl.liftingdatabase.com/" + href_link  # Construct the full URL if needed
                else:
                    href_full_link = "No link available"

                extracted_data = [date, href_full_link]
                if extracted_data[0][8] == "2":
                    print(extracted_data)
            # data = [cell.text.strip() for cell in cells]
            # print(data)

        #See which competitions are not in sqlite database 
            #pd = Select competition names in database
            #pd = do a noninterction right side thingy

            #Loop #While pd not empty
                #1- Insert into competitions table
                #2- Go into competition result page
                #3- Insert into Lifts Table

    def execute_query(self, query, params = None):
        cursor = self.conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        return cursor.fetchall()
        
    def __insert_table(self, query, params):
        cursor = self.conn.cursor()
        self.execute_query(query)
        self.__commit()
        
    def __commit(self):
        if self.conn:
            self.conn.commit()
        
    def __del__(self):
        if self.conn:
            self.conn.close()



