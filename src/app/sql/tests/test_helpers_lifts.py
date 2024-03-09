import unittest
from unittest.mock import patch, mock_open
from utils.helpers_lifts import *

class TestHelpersLifts(unittest.TestCase):

    def testAll(self):
        self.test_getAgeDivID()
        self.test_getWeightDivID()
        print("All tests passed...")

    def test_getAgeDivID(self):
        
        print("Testing getAgeDivID...")

        # Test casr 1: Age within the age division range

        age = 17
        expected_result = '5'
        result = getAgeDivID(age)
        self.assertEqual(result, expected_result)

        age = 109
        expected_result = '14'
        result = getAgeDivID(age)
        self.assertEqual(result, expected_result)

        # Test case 2: Age below the lowest age division range
        age = 7
        expected_result = '255'
        result = getAgeDivID(age)
        self.assertEqual(result, expected_result)

        # Test case 3: Age above the highest age division range
        age = 111
        expected_result = '255'
        result = getAgeDivID(age)
        self.assertEqual(result, expected_result)


        print("Testing getAgeDivID...Success")

    def test_getWeightDivID(self):
        
        print("Testing getWeightDivID...")

        # Test casr 1: Age within the weight division range

        sex = 1 # Female
        age = 30 # years old
        weight = 80.5 # bodyweight kg
        expected_result = '8' # Female - 82.5kg
        result = getWeightDivID(sex, weight, age)
        self.assertEqual(result, expected_result)

        sex = 0 # Male
        age = 55 # years old
        weight = 100.7 # bodyweight kg
        expected_result = '20' # Male - 110kg
        result = getWeightDivID(sex, weight, age)
        self.assertEqual(result, expected_result)

        # Test case 2: Age below the lowest weight division range
        sex = 0 # Male
        age = 17 # years old
        weight = -1.0 # bodyweight kg
        expected_result = '255' # Division Not found
        result = getWeightDivID(sex, weight, age)
        self.assertEqual(result, expected_result)

        # Test case 3: Age above the highest weight division range
        sex = 0 # Male
        age = 35 # years old
        weight = 1000.0 # bodyweight kg
        expected_result = '255' # Division Not found
        result = getWeightDivID(sex, weight, age)
        self.assertEqual(result, expected_result)

        # Test case 4: Age above the highest weight division range
        sex = 0 # Male
        weight = 1000.0 # bodyweight kg
        age = 120 # years old
        expected_result = '255' # Division Not found
        result = getWeightDivID(sex, weight, age)
        self.assertEqual(result, expected_result)

        # Test case 5: Youth Male 
        sex = 0 # Male
        weight = 42 # bodyweight kg
        age = 12 # years old
        expected_result = '31'
        result = getWeightDivID(sex, weight, age)
        self.assertEqual(result, expected_result)

        # Test case 6: Youth Female 
        sex = 1 # Male
        weight = 33 # bodyweight kg
        age = 9 # years old
        expected_result = '25' # Division Not found
        result = getWeightDivID(sex, weight, age)
        self.assertEqual(result, expected_result)


        print("Testing getWeightDivID...Success")

    def __del__(self):
        print("Destructing Class: TestHelpersLifts")

if __name__ == '__main__':
    unittest.main()