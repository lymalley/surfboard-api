require('dotenv').config()
const { merge, map } = require('ramda')
const pkGen = require('./lib/pkGen')
const PouchDB = require('pouchdb-core')

PouchDB.plugin(require('pouchdb-adapter-http'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const addBoard = (board, callback) => {
  const modifiedBoard = merge(board, {
    type: 'board',
    _id: pkGen('board_', '-', prop('sku', 'board'))
  })
  db.put(modifiedBoard, callback)
}
const updateBoard = (board, callback) => db.put(board, callback)

module.exports = { addBoard, updateBoard }
