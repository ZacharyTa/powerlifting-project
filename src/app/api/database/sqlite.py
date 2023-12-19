import requests
import sqlite3
import os
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime


class SQLiteDatabase:

    def __init__(self, db_path=r"src/app/api/database/usapl.db"):
        
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
                    url TEXT,
                    processed INTEGER
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
                    drug_tested INTEGER,
                    processed INTEGER,
                    FOREIGN KEY(competition_id) REFERENCES {self.__competitions_table}(competition_id),
                    FOREIGN KEY(lifter_id) REFERENCES {self.__lifters_table}(lifter_id)
                )""",
                f"""CREATE TABLE IF NOT EXISTS {self.__lifters_table} (
                    lifter_id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    YOB INTEGER,
                    processed INTEGER
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

    def update_comp_db(self):

        print("Updating Competition table...Waiting")

        #Get USPAL competition lifting database
        comp_listing_ur = "https://usapl.liftingdatabase.com/competitions"
        home_page = requests.get(comp_listing_ur)
        soup = BeautifulSoup(home_page.content, "html.parser")

        #Get list of competitions into pd

        comp_df = pd.DataFrame({
        'competition_id': [],
        'date': [],
        'name': [],
        'sanction' : [],
        'state': [],
        'url': [],
        'processed' : []
        })

        db_df = pd.read_sql_query(f'SELECT competition_id from {self.__competitions_table}', self.conn)
        db_comp_ids = set(db_df['competition_id'])

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


                # Only insert data into dataframe for new competitions
                if int(href_full_link[href_full_link.find("id=") + 3:]) not in db_comp_ids:
                    data = [href_full_link[href_full_link.find("id=") + 3:]] # CompID
                    data += [date] # Date
                    data += [cells[1].text.strip()] # CompName
                    data += [cells[2].text.strip()] # Sanction
                    data += [cells[3].text.strip()] # State
                    data += [href_full_link] # URL
                    data += [0] # Processed (0 = unprocessed, 1 = processed)
                
                    # Insert data into dataframe
                    comp_df.loc[len(comp_df)] = data

        # Batch insert into comp table

        comp_df.to_sql(self.__competitions_table, self.conn, if_exists='append', index=False, chunksize=1000)

        print("Updating Competition table...Success")

    # Insert new lifts data into lifts table from unprocessed competitions
    def process_comp_db(self):

        print("Processing Competition table...Waiting")

        #Get list of unprocessed competition lifts into pd

        lifts_df = pd.DataFrame({
            'competition_id': [],
            'lifter_id': [],
            'name': [],
            'sex' : [],
            'age': [],
            'age_div': [],
            'processed' : [],
            'weight_div': [],
            'placing': [],
            'YOB': [],
            'team': [],
            'state': [],
            'lot': [],
            'weight': [],
            'squat1': [],
            'squat2': [],
            'squat3': [],
            'bench1': [],
            'bench2': [],
            'bench3': [],
            'deadlift1': [],
            'deadlift2': [],
            'deadlift3': [],
            'total': [],
            'points': [],
            'bp_points': [],
            'processed': []    
            })
        db_df = pd.read_sql_query(f'SELECT competition_id, url from {self.__competitions_table} WHERE processed = 0', self.conn)

        total_unprocessed_comps = len(db_df)

        # Current year
        current_year = datetime.now().year

        # (insert great brief explanation)
        for i in range(0, total_unprocessed_comps):
            print(f"Processing... {i}/{total_unprocessed_comps}")

            #Get USPAL competition lifts
            comp_listing_ur = str(db_df.at[i, 'url']) #ERROR: requests.exceptions.MissingSchema: Invalid URL '<pandas.core.indexing._iLocIndexer object at 0x11b3b8ef0>': No scheme supplied. Perhaps you meant https://<pandas.core.indexing._iLocIndexer object at 0x11b3b8ef0>?
            lifts_page = requests.get(comp_listing_ur)
            soup = BeautifulSoup(lifts_page.content, "html.parser")

            comp_list_tbody = soup.find("table", id="competition_view_results")
            rows = comp_list_tbody.find_all('tr')
            isMale = False
            for row in rows:
                headers = row.find_all("th")
                if len(headers) > 0 and headers[0].text.strip() == 'Male':
                    isMale = True
                cells = row.find_all("td")
                if len(cells) > 1:  # Ensure there are enough cells in the row
                    print(str(db_df.at[i, 'competition_id'])) # compID

                    # Get Lifter_ID
                    lifter_id = -1
                    href_element = cells[2].find('a')  # Find the 'a' tag in the second cell
                    if href_element and 'href' in href_element.attrs:
                        href_link = href_element.attrs['href']
                        lifter_id = int(href_link[href_link.find("id=") + 3:]) # LifterID
                    else:
                        print("Link not available")
                    print(lifter_id)

                    print(cells[2].text.strip()) # Name
                    print("Female" if isMale == False else "Male") # Sex
                    print(current_year - int(float(cells[3].text.strip())))#age
                    #age_div
                    #weight_div
                    print(cells[1].text.strip()) # Placing
                    print(cells[3].text.strip()) # YOB
                    print(cells[4].text.strip()) # team
                    print(cells[5].text.strip()) # State
                    print(cells[6].text.strip()) # Lot
                    print(cells[7].text.strip()) # Weight
                    print(cells[8].text.strip()) # Squat 1
                    print(cells[9].text.strip()) # Squat 2
                    print(cells[10].text.strip()) # Squat 3
                    print(cells[11].text.strip()) # Squat 1
                    print(cells[12].text.strip()) # Squat 2
                    print(cells[13].text.strip()) # Squat 3
                    print(cells[14].text.strip()) # Squat 1
                    print(cells[15].text.strip()) # Squat 2
                    print(cells[16].text.strip()) # Squat 3
                    print(cells[17].text.strip()) # Total
                    print(cells[18].text.strip()) # Points
                    print(cells[19].text.strip()) # BP Points
                    print(cells[20].text.strip()) # Drug tested
                    
                    #     # Insert data into dataframe
                    #     comp_df.loc[len(comp_df)] = data


    def execute_query(self, query, params = None):
        
        cursor = self.conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        return cursor.fetchall()
    
    def print_table(self):
        print(self.execute_query(f"SELECT * FROM {self.__competitions_table}"))
        
    def __insert_table(self, table_name, params = (None)) -> None:
        cursor = self.conn.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [info[1] for info in cursor.fetchall()]
        columns_str = ', '.join(columns)  # Column names separated by commas
        placeholders = ', '.join(['?'] * len(columns))  # Placeholder '?' for each column
        query = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})"
        print(query)
        print(params)

        self.execute_query(query, params)
        self.__commit()
        
    def __commit(self):
        if self.conn:
            self.conn.commit()
        
    def __del__(self):
        if self.conn:
            self.conn.close()



