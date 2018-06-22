require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5555
const bodyParser = require('body-parser')
const requiredFieldChecker = require('./lib/required-field-checker')
const {
  addBoard,
  updateBoard,
  deleteBoard,
  getBoard,
  getAllBoards,
  listBoards
} = require('./dal')
const NodeHTTPError = require('node-http-error')
const { propOr, isEmpty, not, compose, join, propEq, pathOr } = require('ramda')
const createMissingFieldsMsg = require('./lib/create-missing-fields-msg')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send(`Welcome to the surfboard api!`)
})

app.get('/boards/:sku', function(req, res, next) {
  const boardID = `board_${req.params.sku}`
  getBoard(boardID, function(err, board) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(board)
  })
})

app.get('/boards', (req, res, next) => {
  const limit = Number(pathOr(2, ['query', 'limit'], req)) // "2" or 2

  // /boards?limit=2&start_key=board_22221

  // 1) do they want to paginate?
  const paginate = pathOr(null, ['query', 'start_key'], req)

  listBoards(limit, paginate)
    .then(boards => res.status(200).send(boards))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

app.get('/boards', function(req, res, next) {
  getAllBoards(function(err, boards) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(boards)
  })
})

/*
app.get('/boards', function(req, res, next) {
  const limit = Number(pathOr(2, ['query', 'limit'], req))
  limitBoards(limit, function(err, boards) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(boards)
  })
})
*/
/*

app.get('/boards', function(req, res, next) {
  const limit = Number(pathOr(10, ['query', 'limit'], req))
  limitBoards(limit)
    .then(res.status(200).send()
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})



*/

app.delete('/boards/:sku', (req, res, next) =>
  deleteBoard(`board_${req.params.sku}`, function(err, data) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
    }
    res.status(200).send(data)
  })
)
//if delete a document, you need to have an id and rev

app.post('/boards', (req, res, next) => {
  const newBoard = propOr({}, 'body', req)

  if (isEmpty(newBoard)) {
    next(
      new NodeHTTPError(
        400,
        'Brah, add a board to the request body.  Ensure the Content-Type is application/json. Dude!'
      )
    )
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
        `Brah, you didnt pass all the required fields: ${join(
          ', ',
          missingFields
        )}`,
        { josh: 'is Cool and humble', jp: 'is Cool' }
      )
    )
  }

  addBoard(newBoard, function(err, result) {
    if (err)
      next(
        new NodeHTTPError(err.status, err.message, { ...err, max: 'isCool' })
      )
    res.status(201).send(result)
  })
})

app.put('/boards/:sku', function(req, res, next) {
  const updatedBoard = propOr({}, 'body', req)

  if (isEmpty(updatedBoard)) {
    next(
      new NodeHTTPError(
        400,
        'Brah, add a board to the request body.  Ensure the Content-Type is application/json. Dude!'
      )
    )
  }

  const missingFields = requiredFieldChecker(
    ['_id', '_rev', 'name', 'category', 'price', 'sku'],
    updatedBoard
  )

  const sendMissingFieldError = compose(
    not,
    isEmpty
  )(missingFields)

  if (sendMissingFieldError) {
    next(
      new NodeHTTPError(
        400,
        `Brah, you didnt pass all the required fields: ${join(
          ', ',
          missingFields
        )}`
      )
    )
  }

  updateBoard(updatedBoard, function(err, result) {
    if (err) next(new NodeHTTPError(err.status, err.message))
    res.status(200).send(result)
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
  res.status(err.status || 500).send(err.message)
})

app.listen(port, () => console.log('Surfboards, Brah!', port))
