import importlib.util
import json
import os
import sqlite3

app_path = os.path.join(os.getcwd(), 'backend', 'app.py')
if not os.path.exists(app_path):
    app_path = r'C:\Users\prave\OneDrive\Desktop\smart-career-frontend-\backend\app.py'

spec = importlib.util.spec_from_file_location('backend_app', app_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

db_path = os.path.join(os.path.dirname(app_path), 'career_backend.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()
print('before', cur.execute("PRAGMA foreign_key_list('personal_details')").fetchall())
mod.repair_renamed_user_foreign_keys(conn)
conn.commit()
print('after', cur.execute("PRAGMA foreign_key_list('personal_details')").fetchall())
print('saved_fk', cur.execute("PRAGMA foreign_key_list('saved_careers')").fetchall())
print('assess_fk', cur.execute("PRAGMA foreign_key_list('career_assessments')").fetchall())
conn.close()

client = mod.app.test_client()
payload = {
    'email': 'demo@smartcareer.com',
    'q1': 'Strongly Disagree',
    'q2': 'Strongly Disagree',
    'q3': 'Strongly Disagree',
    'q4': 'Strongly Disagree',
    'q5': 'Strongly Disagree',
    'q6': 'Strongly Disagree',
    'q7': 'Strongly Disagree',
    'q8': 'Strongly Disagree',
    'q9': 'Strongly Disagree',
    'q10': 'Strongly Disagree',
}
response = client.post('/api/career-assessment', json=payload)
print('status', response.status_code)
print('body', response.get_data(as_text=True)[:1000])
