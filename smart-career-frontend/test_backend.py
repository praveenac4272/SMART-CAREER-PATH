import sys
sys.path.insert(0, 'backend')
from app import app
import json

client = app.test_client()
response = client.post('/api/auth/register', 
    data=json.dumps({
        'full_name': 'Test User',
        'email': 'test@example.com',
        'password': 'Test@123',
        'confirm_password': 'Test@123',
        'gender': 'male'
    }),
    content_type='application/json'
)
print(f"Status: {response.status_code}")
print(f"Response: {response.get_json()}")
