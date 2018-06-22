require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const requiredFieldChecker = require('./lib/required-field-checker')
const { addBoard, updateBoard } = require('./dal')
const NodeHTTPError = require('node-http-error')
const { propOr, isEmpty, not, compose } = require('ramda')
const createMissingFieldsMsg = require('./lib/create-missing-fields-msg')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send(`Welcome to the surfboard api!`)
})

app.get('/boards/:boardID', function(req, res, next) {
  const surfboardID = req.params.boardID
})

app.post('/boards', function(req, res, next) {
  const newBoard = propOr({}, 'body', req)

  if (isEmpty(newBoard)) {
    next(new NodeHTTPError(400, 'missing surfboard body.'))
    return
  }
  const missingFields = requiredFieldChecker(
    ['name', 'category', 'price', 'sku'],
    newBoard
  )
  const sendMissingFieldError = compose(
    not,
    isEmpty
  )(missingFields)
  if (sendMissingFieldError) {
    next(
      new NodeHTTPError(
        400,
        `You're missing required fields: ${join(', ', missingFields)}`,
        { ...err }
      )
    )
    return
  }
  addBoard(newBoard, function(err, result) {
    if (err)
      next(
        new NodeHTTPError(err.status, err.message, { ...err, max: 'isCool' })
      )
    res.status(201).send(result)
  })
})

app.put('./boards/:boardSku', function(res, req, next) {
  const boardSku = req.params.sku
  const board = req.body
  if (isEmpty(instrument)) {
    next(new NodeHTTPError(400, 'board body is missing'))
    return
  }
  const missingFields = requiredFieldChecker(
    ['_id', '_rev', 'type', 'name', 'category', 'price', 'sku'],
    board
  )
  if (not(isEmpty(missingFields))) {
    next(new NodeHTTPError(400, '${createMissingFieldsMsg(missingFields)}'))
  }
  updateBoard(board, function(err, board) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(board)
  })
})

app.use(function(err, req, res, next) {
  console.log(
    `WIPEOUT! \n\nMETHOD ${req.method} \nPATH ${req.path}\n${(JSON.stringify(
      err
    ),
    null,
    2)}`
  )
  res.status(err.status || 5000).send(err.message)
})

app.listen(port, () => console.log('Surfboards, Brah!', port))
