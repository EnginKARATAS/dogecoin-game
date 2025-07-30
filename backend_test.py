import requests
import sys
from datetime import datetime
import json

class BackendAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"Response Status: {response.status_code}")
            print(f"Response Content: {response.text[:200]}...")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "api/", 200)

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        success, response = self.run_test(
            "Create Status Check", 
            "POST", 
            "api/status", 
            200,  # Based on the code, it should return 200, not 201
            data=test_data
        )
        return success, response

    def test_get_status_checks(self):
        """Test getting all status checks"""
        return self.run_test("Get Status Checks", "GET", "api/status", 200)

def main():
    print("🚀 Starting Backend API Tests...")
    
    # Test with localhost first
    tester = BackendAPITester("http://localhost:8001")
    
    # Test basic connectivity
    print("\n=== Testing Basic API Endpoints ===")
    
    # Test root endpoint
    success, response = tester.test_root_endpoint()
    if not success:
        print("❌ Root endpoint failed, checking if server is running...")
        return 1

    # Test status check creation
    success, response = tester.test_create_status_check()
    if not success:
        print("❌ Status check creation failed")
        return 1

    # Test getting status checks
    success, response = tester.test_get_status_checks()
    if not success:
        print("❌ Getting status checks failed")
        return 1

    # Print final results
    print(f"\n📊 Backend API Test Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("✅ All backend tests passed!")
        return 0
    else:
        print("❌ Some backend tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())