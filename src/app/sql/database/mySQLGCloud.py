import requests
import os
import pandas as pd
from datetime import datetime
from bs4 import BeautifulSoup

from utils.helpers_lifts import *
from utils.errors import *

from mysql.connector import Error
from sqlalchemy import create_engine
from sqlalchemy.sql import text
from sqlalchemy.engine.cursor import CursorResult

class MySQLGCloud:
    """
    Class to interact with the Google Cloud MySQL database
    Functions:
        - initialize_tables: Create tables and columns if they don't exist
        - index_tables: Index columns in the lifts table for faster querying
        - update_comp_db: Update the competitions table with new competitions from the USAPL lifting database
        - update_div_tables: Update the age_div and weight_div tables from csv files
        - process_comp_db: Insert new lifts data into the lifts table from unprocessed competitions
        - drop_all_tables: Drop all tables in the database
    """

    # Initialize the connection to the mySQL database
    def __init__(self, host_name, user_name, user_password, database_name) -> None:

        # Class Variables
        self.conn = None
        self.engine = None
        self.db_name = database_name

        # Private Class Variables
        self.__competitions_table = 'competitions_table'
        self.__lifts_table = 'lifts_table'
        self.__agediv_table = 'agediv_table'
        self.__weightdiv_table = 'weightdiv_table'
        print("Connecting to MySQL DB...")
        try:
            
            # Get certificate and key path
            cert_path = os.path.join(os.path.dirname(__file__),
                '..', '..',  '..', '..', 'certs')
            
            ssl_ca = os.path.join(cert_path, 'server-ca.pem')
            ssl_cert = os.path.join(cert_path, 'client-cert.pem')
            ssl_key = os.path.join(cert_path, 'client-key.pem')

            # Connect to the database
            self.engine = create_engine(
                f"mysql+mysqlconnector://{user_name}:{user_password}@{host_name}/{database_name}",
                connect_args = {
                'ssl_ca': ssl_ca,
                'ssl_cert': ssl_cert,
                'ssl_key': ssl_key
                },
                echo = False
            )

            # Test the connection
            self.conn = self.engine.connect()
            print("Connection to MySQL DB successful")

        except Error as e:
            print(f"The error '{e}' occurred")
    
    # Create tables and columns if they don't exist
    def initialize_tables(self) -> None:
        """
        Initializes the following tables if they don't exist:
            - competitions_table: stores competition data
            - lifts_table: stores competition lifts data
            - agediv_table: stores id and age division data
            - weightdiv_table: stores id and weight division data
        """

        print("Initializing Tables....")
        
        # Initialize Tables if doesn't exist

        # List of SQL commands to create tables
        table_creation_commands = [
            f"""CREATE TABLE IF NOT EXISTS {self.__competitions_table} (
                competition_id MEDIUMINT UNSIGNED PRIMARY KEY,
                date DATE,
                name TINYTEXT NOT NULL,
                sanction TINYTEXT,
                state TINYTEXT,
                url TINYTEXT NOT NULL,
                processed TINYINT UNSIGNED NOT NULL
            );""",
            f"""CREATE TABLE IF NOT EXISTS {self.__agediv_table} (
                age_div_id TINYINT UNSIGNED PRIMARY KEY,
                age_div TINYTEXT NOT NULL,
                min_age TINYINT UNSIGNED NOT NULL,
                max_age TINYINT UNSIGNED NOT NULL
            );""",
            f"""CREATE TABLE IF NOT EXISTS {self.__weightdiv_table} (
                weight_div_id TINYINT UNSIGNED PRIMARY KEY,
                sex TINYINT UNSIGNED NOT NULL,
                is_youth TINYINT UNSIGNED NOT NULL,
                weight_div TINYTEXT NOT NULL,
                min_weight FLOAT(4,1) NOT NULL,
                max_weight FLOAT(4,1) NOT NULL
            );""",
            f"""CREATE TABLE IF NOT EXISTS {self.__lifts_table} (
                competition_id MEDIUMINT UNSIGNED,
                lifter_id MEDIUMINT UNSIGNED,
                sex TINYINT UNSIGNED,
                age TINYINT UNSIGNED, 
                age_div_id TINYINT UNSIGNED,
                weight_div_id TINYINT UNSIGNED,
                weight FLOAT(5,2),
                squat FLOAT(6,2),
                bench FLOAT(6,2),
                deadlift FLOAT(6,2),
                total FLOAT(6,2),
                processed TINYINT UNSIGNED,
                FOREIGN KEY(competition_id) REFERENCES {self.__competitions_table}(competition_id),
                FOREIGN KEY(age_div_id) REFERENCES {self.__agediv_table}(age_div_id),
                FOREIGN KEY(weight_div_id) REFERENCES {self.__weightdiv_table}(weight_div_id)
            );"""
        ]

        try:
            for command in table_creation_commands:
                self._execute_query(command)
            self.conn.commit()
            print("All tables were created successfully")
        except Error as e:
            print(f"An error occurred: {e}")
        finally:
            self.conn.close()

        self.__commit()
        print('Initializing Tables Success')

    # Index the columns in the lifts table for faster querying
    def index_tables(self) -> None:
        """
        Indexes lifts_table's columns:
            sex, age_div_id, weight_div_id, total, bench, deadlift, squat
        """
        print("Indexing Columns...Waiting")

        index_commands = [
            f"""CREATE INDEX idx_sex ON {self.__lifts_table} (sex);""",
            f"""CREATE INDEX idx_age_div_id ON {self.__lifts_table} (age_div_id);""",
            f"""CREATE INDEX idx_weight_div_id ON {self.__lifts_table} (weight_div_id);""",
            f"""CREATE INDEX idx_total ON {self.__lifts_table} (total);""",
            f"""CREATE INDEX idx_bench ON {self.__lifts_table} (bench);""",
            f"""CREATE INDEX idx_deadlift ON {self.__lifts_table} (deadlift);""",
            f"""CREATE INDEX idx_squat ON {self.__lifts_table} (squat);"""
        ]

        try:
            for command in index_commands:
                self._execute_query(command)
            self.conn.commit()
            print("All columns were indexed successfully")
        except Error as e:
            print(f"An error occurred: {e}")
        finally:
            self.conn.close()

    # Update the competition table with new competitions from the USAPL lifting database
    def update_comp_db(self) -> None:

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

        try:
            # Get set of Competition ID's from current database
            with self.engine.connect() as self.conn:
                db_df = pd.read_sql_query(f'SELECT competition_id from {self.__competitions_table}', self.conn)
                db_comp_ids = set(db_df['competition_id'])

                # Scrape competition table data from USAPL's lifting database site
                comp_list_tbody = soup.find("table", class_="tabledata")
                rows = comp_list_tbody.find_all('tr')
                for row in rows:
                    cells = row.find_all("td")
                    if len(cells) > 1:  # Ensure there are enough cells in the row
                        date_str = cells[0].text.strip()  # Get date from the first cell
                        date_obj = datetime.strptime(date_str, '%m/%d/%Y') # Convert to datetime object
                        formatted_date_str = date_obj.strftime('%Y-%m-%d') # Format the datetime object to YYYY-MM-DD string format

                        href_element = cells[1].find('a')  # Find the 'a' tag in the second cell

                        if href_element and 'href' in href_element.attrs:
                            href_link = href_element.attrs['href']
                            href_full_link = "https://usapl.liftingdatabase.com/" + href_link  # Construct the full URL if needed
                        else:
                            href_full_link = "No link available"


                        # Only insert data into dataframe for new competitions
                        if int(href_full_link[href_full_link.find("id=") + 3:]) not in db_comp_ids:
                            data = [href_full_link[href_full_link.find("id=") + 3:]] # CompID
                            data += [formatted_date_str] # Date
                            data += [cells[1].text.strip()] # CompName
                            data += [cells[2].text.strip()] # Sanction
                            data += [cells[3].text.strip()] # State
                            data += [href_full_link] # URL
                            data += [0] # Processed (0 = unprocessed, 1 = processed)
                        
                            # Insert data into dataframe
                            comp_df.loc[len(comp_df)] = data

                # Batch insert into comp table
                comp_df.to_sql(name=self.__competitions_table, con=self.engine, if_exists='append', index=False, method='multi', chunksize=1000)
                self.conn.commit()
                print("Updating Competition table...Success")
        
        except Error as e:
            print(f"The error '{e}' occurred")
        finally:
            self.conn.close()

    # Batch inserts data into the age_div and weight_div tables from csv files (age_div.csv, weight_div.csv)
    def update_div_tables(self) -> None:
        """
        Note: This function is only called once to populate the division tables
        To change the division tables:
            1. The csv files must be updated and the tables must be dropped and re-created
            2. Add a new function to update a given table
        """
        print("Updating Division tables...Waiting")

        try:

            with self.engine.connect() as self.conn:

                # Read CSV files into pandas dataframes
                current_path = os.path.dirname(__file__)
                age_div_df = pd.read_csv(os.path.join(current_path, 'age_div.csv'))
                weight_div_df = pd.read_csv(os.path.join(current_path, 'weight_div.csv'))

                # Batch insert into age_div table
                age_div_df.to_sql(name=self.__agediv_table, con=self.engine, if_exists='append', index=False, method='multi', chunksize=1000)

                # Batch insert into weight_div table
                weight_div_df.to_sql(name=self.__weightdiv_table, con=self.engine, if_exists='append', index=False, method='multi', chunksize=1000)

                self.conn.commit()

            print("Updating Division tables...Success")
        
        except Error as e:
            print(f"The error '{e}' occurred")
        finally:
            self.conn.close()

    # Insert new lifts data into lifts table from unprocessed competitions
    def process_comp_db(self) -> None:

        try:
            print("Processing Competition table...Waiting")

            # Get list of unprocessed competition lifts into dataframe

            lifts_df = pd.DataFrame({
                'competition_id': [],
                'lifter_id': [],
                'sex' : [],
                'age': [],
                'age_div_id': [],
                'weight_div_id': [],
                'weight': [],
                'squat': [],
                'bench': [],
                'deadlift': [],
                'total': []
                })
            db_df = pd.read_sql_query(f'SELECT competition_id, url from {self.__competitions_table} WHERE processed = 0', self.conn)

            total_unprocessed_comps = len(db_df)

            # Insert lift data from every unprocessed competition into SQL lifts table
            for i in range(0, total_unprocessed_comps):

                try:
                    print(f"Processing... {i + 1}/{total_unprocessed_comps}")

                    # Clear the DataFrame before insertion
                    lifts_df = lifts_df.iloc[0:0]

                    # Get USPAL competition lifts
                    comp_listing_url = str(db_df.at[i, 'url'])
                    competition_id = str(db_df.at[i,"competition_id"])
                    lifts_page = requests.get(comp_listing_url)
                    soup = BeautifulSoup(lifts_page.content, "html.parser")

                    comp_list_tbody = soup.find("table", id="competition_view_results")

                    # Raise error if table is empty
                    if not comp_list_tbody:
                        raise EmptyCompTableError(competition_id, "Empty Competition Lifts Table")

                    rows = comp_list_tbody.find_all('tr')
                    sex = 99 # Unspecified

                    for row in rows:
                        sex = getSex(sex, row)
                        cells = row.find_all("td")
                        weight = getWeight(cells)

                        if len(cells) > 1:  # Ensure there are enough cells in the row

                            # Build data list for insertion into dataframe
                            data = [str(db_df.at[i, 'competition_id'])] # compID
                            data += [getLifterID(cells)] # LifterID
                            data += [str(sex)] # Sex
                            data += [str(getAge((cells[3].text.strip())))] # age
                            data += [getAgeDivID(int(getAge(cells[3].text.strip())))] # age_div_id
                            data += [getWeightDivID(sex, float(weight), int(getAge(cells[3].text.strip())))] # weight_div_id
                            data += [weight] # Weight
                            data += [str(max(strToFloat(cells[8].text.strip()), strToFloat(cells[9].text.strip()), strToFloat(cells[10].text.strip())))] # Max Squat
                            data += [str(max(strToFloat(cells[11].text.strip()), strToFloat(cells[12].text.strip()), strToFloat(cells[13].text.strip())))] # Max Bench
                            data += [str(max(strToFloat(cells[14].text.strip()), strToFloat(cells[15].text.strip()), strToFloat(cells[16].text.strip())))] # Max Deadlift
                            data += [cells[17].text.strip()] # Total
                            
                            # Insert data into dataframe
                            lifts_df.loc[len(lifts_df)] = data

                    with self.engine.connect() as self.conn:

                        # Batch insert dataframe into lifts table
                        lifts_df.to_sql(self.__lifts_table, con=self.engine, if_exists='append', index=False, chunksize=1000)
                        
                    with self.engine.connect() as conn:

                        # Set processed status to processed
                        conn.execute(text(f'UPDATE {self.__competitions_table} SET processed = 1 WHERE competition_id = {competition_id};'))
                        conn.commit()
                        print(f"Competition ID: {competition_id} processed successfully")
                        
                    print("Processing Competition table...Success")
                
                except EmptyCompTableError as ve:
                    # Print Error Message
                    print(ve)

                    # Set processed status to processed
                    print(f"Ignoring Compeition ID: {ve.competition_id}")
                    with self.engine.connect() as conn:
                        # Set processed status to processed
                        conn.execute(text(f'UPDATE {self.__competitions_table} SET processed = 1 WHERE competition_id = {ve.competition_id};'))
                        conn.commit()
                        print(f"Competition ID: {ve.competition_id} ignored successfully")

                except Exception as e:

                    # Handle exceptions
                    print("An error occurred during row:", e, str(db_df.at[i, 'url']))

        except Exception as e:

            # Handle exceptions
            print("An error occurred:", e)

        finally:
            self.__commit()

    # Drops all tables in the database (Used for testing purposes only)
    def drop_all_tables(self) -> None:
        try:
            with self.engine.connect() as self.conn:
                self._execute_query(f"DROP TABLE {self.__lifts_table}")
                self._execute_query(f"DROP TABLE {self.__competitions_table}")
                self._execute_query(f"DROP TABLE {self.__agediv_table}")
                self._execute_query(f"DROP TABLE {self.__weightdiv_table}")
                self.conn.commit()
                print("All tables were dropped successfully")
        except Error as e:
            print(f"An error occurred: {e}")
        finally:
            self.conn.close()

    # Helper function that executes a query on the mySQL database and returns the result if any
    def _execute_query(self, query, params = None) -> None | CursorResult[any]: 
        """
        Paramaters: query: str, params(optional): int | float | str
        Returns: None | CursorResult[any]
        """
        
        with self.engine.connect() as self.conn:
            result = None
            if params:
                result = self.conn.execute(text(query), params)
            else:
                result = self.conn.execute(text(query))
            if result:
                return result
    
    # Commit changes to the database (Usually after a series of queries)
    def __commit(self) -> None:
        if self.conn:
            print("__commit")
            self.conn.commit()
        
    # Properly close the connection to the database when the object is deleted
    def __del__(self) -> None:
        if self.conn:
            print("__close")
            self.conn.close()

            # Close the engine
            self.engine.dispose()



