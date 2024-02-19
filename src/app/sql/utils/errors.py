
class EmptyCompTableError(Exception):
    
    # Constructor
    def __init__(self, competition_id: int, message = 'Empty Competition Table') -> None:
        """
        Takes competition ID from the empty competition table as an argument
        Error Message to print is Optional
        """

        self.competition_id = competition_id
        self.message = message

    # __str__ is to print() the error message 
    def __str__(self) -> str: 
        return(repr(self.message)) 
    
    