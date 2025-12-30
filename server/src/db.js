import { MongoClient } from 'mongodb'

let client
let db

export async function connect(uri, dbName){
  if(db) return db
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 })
  await client.connect()
  db = client.db(dbName)
  return db
}

export function getDb(){
  if(!db) throw new Error('DB not initialized. Call connect() first.')
  return db
}

export async function close(){
  if(client) await client.close()
  client = undefined
  db = undefined
}
