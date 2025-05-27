-- Create database if not exists
SELECT 'CREATE DATABASE sheetcode_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sheetcode_db')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sheetcode_db TO sheetcode_user;