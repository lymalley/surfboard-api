require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const requiredFieldChecker = require('./lib/required-field-checker')
const { addBoard } = require('./dal')
const NodeHTTPError = require('node-http-error')
const { propOr, isEmpty, not, compose } = require('ramda')

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
  const sendMissingFieldError = compose(
    not,
    isEmpty
  )(missingFields)
  if (sendMissingFieldError) {
    addBoard(newBoard, function(err, result) {
      if (err) next(new NodeHTTPError(err.status, err.message, { ...err }))
      return
    })
    res.status(201).send(results)
  }
})

/*


  console.log('not isEmpty missingFeilds', not(isEmpty(missingFields)))
  if (not(isEmpty(missingFields))) {
    next(new NodeHTTPError(400, `missing field(s) in body`))
    return
  }


  addInstrument(newInstrument, function(err, data) {
    if (err) {
      next(
        new NodeHTTPError(err.status, err.message)
      )
    }
    res.status(201).send(boards)
  })
})
*/
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
