require('dotenv').config()
const { merge, map } = require('ramda')
const PouchDB = require('pouchdb-core')
const pkGen = require('./lib/pk-gen')

PouchDB.plugin(require('pouchdb-adapter-http'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const dal = {}

module.exports = dal
