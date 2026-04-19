const Database = require("better-sqlite3");

const db = new Database("./data/app.db");

db.exec(`CREATE TABLE IF NOT EXISTS user_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    phone TEXT,
    website TEXT,
    hours TEXT,
    tags TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id TEXT UNIQUE NOT NULL,
    username TEXT,
    display_name TEXT,
    email TEXT
  )
`);

module.exports = db;