require('dotenv').config()
const { merge, map, prop } = require('ramda')
const pkGen = require('./lib/pkGen')
const PouchDB = require('pouchdb-core')

PouchDB.plugin(require('pouchdb-adapter-http'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const addBoard = (board, callback) => {
  const modifiedBoard = merge(board, {
    type: 'board',
    _id: pkGen('board_', '-', prop('sku', board))
  })
  db.put(modifiedBoard, callback)
}
const updateBoard = (board, callback) => db.put(board, callback)
const deleteBoard = (id, callback) => {
  db.get(id, function(err, board) {
    db.remove(board, callback)
  })
}
//this function is getting the required rev and id by providing only the sku
const getBoard = (id, callback) => db.get(id, callback)
const getAllBoards = callback =>
  listAllDocs(
    { include_docs: true, startkey: 'board_', endkey: 'board_\ufff0' },
    callback
  )

const listAllDocs = (id, callback) =>
  db.allDocs(id, function(err, boards) {
    if (err) callback(err)
    callback(null, map(row => row.doc, boards.rows))
  })

module.exports = { addBoard, updateBoard, deleteBoard, getBoard, getAllBoards }
