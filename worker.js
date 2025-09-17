import {
  isMainThread,
  parentPort
} from 'node:worker_threads'
import Database from 'better-sqlite3'

if (isMainThread) throw new Error('Must run as worker')

const db = new Database('./db.sqlite')
db.pragma('journal_mode = WAL')

console.log('create table')
// Create a table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
`)

console.log('Insert rows')
// Insert some rows into the table
db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run('Alice', 'alice@example.com')
db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run('Bob', 'bob@example.com')

console.log('Done!')
parentPort.postMessage('Done!')
