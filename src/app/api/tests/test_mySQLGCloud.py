import unittest
from unittest.mock import patch
from database.mySQLGCloud import MySQLGCloud

class TestMySQLGCloud(unittest.TestCase):

    def __init__(self, host_name, user_name, user_password, database_name):
        #Class Variables
        self.db = None
        self.setUp(host_name, user_name, user_password, database_name)

    def testAll(self):
        # Run all tests
        print("RUNNING ALL TESTS...")

        self.test_initialize_tables()
        self.test_index_tables()

        print("ALL TESTS PASSED")

    def setUp(self, host_name, user_name, user_password, database_name):
        self.db = MySQLGCloud(host_name, user_name, user_password, database_name)

    def tearDown(self):
        del self.db

    def test_initialize_tables(self):
        # Mock the execute_query method to avoid actual database operations
        with patch.object(MySQLGCloud, '_execute_query') as mock_execute_query:
            self.db.initialize_tables()
            mock_execute_query.assert_called()

    def test_index_tables(self):
        # Mock the execute_query method to avoid actual database operations
        with patch.object(MySQLGCloud, '_execute_query') as mock_execute_query:
            self.db.index_tables()
            mock_execute_query.assert_called()

if __name__ == '__main__':
    unittest.main()

