require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const { getBeer, getABeer } = require('./dal')
const NodeHTTPError = require('node-http-error')
const {} = require('ramda')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send(`Welcome to the surfboard api!`)
})

app.listen(port, () => console.log('API is up', port))
