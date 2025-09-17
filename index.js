import {
  Worker,
  isMainThread
} from 'node:worker_threads'
import {
  once
} from 'node:events'
import Database from 'better-sqlite3'

if(!isMainThread) throw new Error('Must be main thread')

const temp = new Database('./db.sqlite')
temp.pragma('journal_mode = WAL')
temp.close()

const db = new Database('./db.sqlite', { readonly: true })
db.pragma('journal_mode = WAL')

console.log('start worker')
const worker = new Worker(new URL('./worker.js', import.meta.url))

await once(worker, 'message')

// Read all rows from the users table
const rows = db.prepare('SELECT * FROM users').all()
console.log(rows)
