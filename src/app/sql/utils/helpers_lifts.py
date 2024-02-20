from datetime import datetime
from bs4 import BeautifulSoup
import os
import csv

# Turn String to Float (Usually used during data scraping process)

def strToFloat(value: str) -> float:
    """
    Takes in string value -> Returns float value
    Returns 0.0 if value is empty string ''
    Returns -1.0 if invalid value
    """

    try:
        return 0.0 if value == '' else float(value)
    except(ValueError):
        return -1.0

# get Age division based on age_div.csv file
def getAgeDivID(age: int) -> str:
    """
    Takes in age of lifter -> Returns age division ID
    Filters based on age_div.csv file in database directory
    """

    # Get the directory of the current file (helper.py)
    current_dir = os.path.dirname(__file__)

    # Construct the path to the age_div.csv file
    age_div_path = os.path.join(current_dir, '..', 'database', 'age_div.csv')
    age_div_path = os.path.normpath(age_div_path)
    
    # Get Age Division from csv file
    with open(age_div_path, 'r') as csvfile:
        csvfile.seek(0)  # Reset file pointer to the beginning of the file
        rows = csv.reader(csvfile, delimiter=',')

        min_age_idx = 2 # Min age index
        max_age_idx = 3 # Max age index
        age_div_id_idx = 0 # Age Division index

        # Skip first row bc its a header row
        next(rows)
        for row in rows:
            if age >= int(row[min_age_idx]) and age < int(row[max_age_idx]):
                return row[age_div_id_idx]
    
    # Return 255 if age division not found
    return '255'

# get Age division based on age_div.csv file
def getWeightDivID(sex: int, weight: float, age: int) -> int:
    """
    Takes in sex, weight of lifter -> Returns weight division ID
    Filters based on weight_div.csv file in database directory
    Sex: {Male: 0, Female: 1}
    """
    # Get the directory of the current file (helper.py)
    current_dir = os.path.dirname(__file__)

    # Construct the path to the age_div.csv file
    age_div_path = os.path.join(current_dir, '..', 'database', 'weight_div.csv')
    age_div_path = os.path.normpath(age_div_path)
    
    # Get Age Division from csv file
    with open(age_div_path, 'r') as csvfile:
        csvfile.seek(0)  # Reset file pointer to the beginning of the file
        rows = csv.reader(csvfile, delimiter=',')

        sex_idx = 1 # sex index
        is_youth_idx = 2 # is youth index
        min_weight_idx = 4 # Min weight index
        max_weight_idx = 5 # Max weight index
        weight_div_id_idx = 0 # Weight Division index

        isYouth = 0
        if age < 14: isYouth = 1

        # Skip first row bc its a header row
        next(rows)
        for row in rows:
            if weight >= float(row[min_weight_idx]) and weight < float(row[max_weight_idx]) and sex == int(row[sex_idx]) and isYouth == int(row[is_youth_idx]):
                return row[weight_div_id_idx]
    
    # Return 255 if weight division not found
    return '255'



# Returns age of lifter based on YOB
def getAge(yob :str) -> int:
    """
    Takes in string value of year of birth -> Returns age
    Returns -1 for invalid year of birth
    """

    # Current year
    current_year = datetime.now().year

    # Calculate Age
    try:
        if (current_year - int(yob) < 0) or (current_year - int(yob) > 255): return 0
        return current_year - int(float(yob))
    
    except(ValueError):
        return 0
    
# Returns weight of lifter
def getWeight(cells: BeautifulSoup) -> str:
    """
    Takes cells argument after find_all table divisions in competition lifts table rows
    Returns weight of lifter
    Return 0.0 if error occurs
    """

    try:
        weight = cells[7].text.strip()

        if (weight == '') or (float(weight) > 999.99) or (float(weight) < 0):
            return '0.00'

        return weight
    
    except(IndexError):
        return '0.00'
    
    except(ValueError):
        return '0.00'
    
def getSex(sex: str, row: BeautifulSoup) -> int:
    """
    Takes row argument after find_all table rows in competition lifts table
    Returns whether male or female mentioned in html table header
    Passes orginal value of sex when it doesn't
    Sex: {Male: 0, Female: 1}
    """

    try:
        headers = row.find_all("th")
        if len(headers) > 0:
            if headers[0].text.strip().find('Male') != -1:
                return 1
            elif headers[0].text.strip().find('Female') != -1:
                return 0
            else:
                return sex
        else:
            return sex
            
    except(IndexError):
        print("Index Error at getSex()")
        return sex

# Get Lifter ID
def getLifterID(cells: BeautifulSoup) -> int:
    """
    Takes cells argument after find_all table divisions in competition lifts table rows
    Returns ID of lifter
    Return -1 if error occurs
    """

    lifter_id = 0

    try:

        href_element = cells[2].find('a')  # Find the 'a' tag in the second cell
        if href_element and 'href' in href_element.attrs:
            href_link = href_element.attrs['href']
            lifter_id = int(href_link[href_link.find("id=") + 3:]) # LifterID
        else:
            print("Link not available")
        
        return lifter_id
    
    except(ValueError):
        print("Value Error at getLifterID()")
        return lifter_id
