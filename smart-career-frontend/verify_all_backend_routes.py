import os
import sys
import json

backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import app

client = app.test_client()

print("--- Testing Backend Endpoints ---")

# 1. Health check
res = client.get('/health')
print(f"GET /health status: {res.status_code}, data: {res.get_json()}")
assert res.status_code == 200

# 2. Auth Login demo user
res = client.post('/api/auth/login', data=json.dumps({
    'email': 'demo@example.com',
    'password': 'password123'
}), content_type='application/json')
print(f"POST /api/auth/login status: {res.status_code}, data: {res.get_json()}")
assert res.status_code == 200

# 3. Auth Register new user
import uuid
unique_email = f"user_{uuid.uuid4().hex[:6]}@example.com"
res = client.post('/api/auth/register', data=json.dumps({
    'full_name': 'Test Student',
    'email': unique_email,
    'password': 'password123',
    'confirm_password': 'password123',
    'gender': 'female',
    'phone_number': '9876543210'
}), content_type='application/json')
print(f"POST /api/auth/register status: {res.status_code}, data: {res.get_json()}")
assert res.status_code in (200, 201)

# 4. Get Profile
res = client.get(f"/api/profile/{unique_email}")
print(f"GET /api/profile/{unique_email} status: {res.status_code}")
assert res.status_code == 200

# 5. Colleges lookup
res = client.get('/api/career-colleges/Software%20Engineer/states')
print(f"GET /api/career-colleges states status: {res.status_code}")
assert res.status_code == 200

print("SUCCESS: All Backend Routes Verified Cleanly!")
