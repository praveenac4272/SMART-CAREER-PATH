import sqlite3

DB_PATH = r'C:\Users\prave\OneDrive\Desktop\smart-career-frontend-\backend\career_backend.db'
TARGET_EMAIL = 'praveenac4272.sse@saveetha.com'

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute('SELECT id, full_name, email FROM users WHERE email = ?', (TARGET_EMAIL,))
row = cur.fetchone()
if row is None:
    print(f'User not found: {TARGET_EMAIL}')
    conn.close()
    raise SystemExit(0)

print('Deleting user:', dict(row))
cur.execute('DELETE FROM users WHERE email = ?', (TARGET_EMAIL,))
conn.commit()

remaining = cur.execute('SELECT id, full_name, email FROM users ORDER BY id').fetchall()
print('Remaining users:')
for user in remaining:
    print(dict(user))

conn.close()
