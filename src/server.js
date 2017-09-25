const express = require('express')
const bodyParser = require('body-parser')

const listeners = require('./listeners')

const app = express()

app.use(bodyParser.json())

app.use(function(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`)

  next()
})

app.post('/*', function(req, res, next) {
  const event = req.get('X-GitHub-Event')
  const secret = req.get('X-Hub-Signature')
  // const deliveryId = req.get('X-GitHub-Delivery')

  const payload = req.body

  console.log(`Event ${event} was fired`)
  console.log(payload)

  console.log(secret)
  // console.log(deliveryId)

  if (event === 'ping') {
    return listeners.ping(res)
  } else if (event === 'push') {
    return listeners.push(payload, res)
  } else if (event === 'pull_request') {
    return listeners.pullRequest(payload, res)
  }

  next()
})

app.use(function(req, res, next) {
  res.status(404).json({ success: false, message: 'Listener for the hook not found' })
})

app.use(function(err, req, res, next) {
  console.error(err.stack)

  res.status(500).json({ success: false })
})

const port = process.env.PORT || 3000

app.listen(port)

console.log(`Server listen on ${port}`)
