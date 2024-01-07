from datetime import datetime
from bs4 import BeautifulSoup

#Returns age of lifter based on YOB
def getAge(yob :str) -> int:
    """
    Takes in string value of year of birth -> Returns age
    Returns -1 for invalid year of birth
    """

    # Current year
    current_year = datetime.now().year

    # Calculate Age
    try:
        return current_year - int(float(yob))
    
    except(ValueError):
        return -1
    
def getSex(sex: str, row: BeautifulSoup) -> str:
    """
    Takes row argument after find_all table rows in competition lifts table
    Returns whether male or female mentioned in html table header
    Passes orginal value of sex when it doesn't
    """

    try:
        headers = row.find_all("th")
        if len(headers) > 0:
            if headers[0].text.strip().find('Male') != -1:
                return 'Male'
            elif headers[0].text.strip().find('Female') != -1:
                return 'Female'
            else:
                return sex
        else:
            return sex
            
    except(IndexError):
        print("Index Error at getSex()")
        return sex
    
def getEvent(event: str, row: BeautifulSoup) -> str:
    """
    Takes row argument after find_all table rows in competition lifts table
    Returns division located in html table header
    """

    try:
        events = {'Bench press', 'Deadlift', 'Powerlifting'}
        headers = row.find_all("th", class_="competition_view_event")
        if len(headers) > 0 and headers[0].text.strip() in events:
            return headers[0].text.strip()
        else:
            return event
    
    except(IndexError):
        print("Index Error at getDiv()")
        raise(ValueError)
    except Exception as e:
        print(f"Error: {e}")
    
def getDiv(div: str, row: BeautifulSoup) -> str:
    """
    Takes row argument after find_all table rows in competition lifts table
    Returns division located in html table header
    """

    try:
        headers = row.find_all("th")
        if len(headers) > 0 and headers[0].text.strip().find('-'):

            #Get Div header located after '-' (Ex. Male - Raw Open)
            div_header = headers[0].text.strip()[headers[0].text.strip().find('-') + 2:]
            return div_header
        else:
            return div
    
    except(IndexError):
        print("Index Error at getDiv()")
        raise(ValueError)
    
#Returns Weight Division of lifter
def getWeightDiv(weightDiv :str) -> str:
    """
    Takes in string value of weight div -> Returns weight div
    Returns 'unspecified' for unspecified weight division
    """

    # Return Weight Division
    try:
        if weightDiv != '':
            return weightDiv
        else:
            return 'unspecified'
    
    except(ValueError):
        print('Value Error at getWeightDiv()')
        pass

# Get Lifter ID
def getLifterID(cells: BeautifulSoup) -> int:
    """
    Takes cells argument after find_all table divisions in competition lifts table rows
    Returns ID of lifter
    Return -1 if error occurs
    """

    lifter_id = -1

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
