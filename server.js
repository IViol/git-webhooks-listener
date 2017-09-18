const express = require('express')
const bodyParser = require('body-parser')
const { spawn } = require('child_process')

const app = express()

app.use(bodyParser.json())

app.use(function(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`)

  next()
})

app.post('/*', function(req, res, next) {
  const event = req.get('X-GitHub-Event')
  const secret = req.get('X-Hub-Signature')// secret = sha1=956d8cac8effbcf8ca4fb9e1ef6f6b823a348774
  const deliveryId = req.get('X-GitHub-Delivery')

  const payload = req.body

  console.log(`Event ${event} was fired`)
  console.log(secret)
  console.log(deliveryId)

  if (event === 'ping') {
    return ping(res)
  } else if (event === 'push') {
    return push(payload, res)
  }

  next()
})

function ping(res) {
  res.status(200)
}

function push(payload, res) {
  const command = 'make'
  const args = ['push']

  console.log('payload is', payload)

  console.log(`Child process ${command} ${args.join(' ')} is about to spawn`)

  const spawned = spawn(command, args)

  spawned.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  spawned.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })

  spawned.on('close', (code) => {
    console.log(`child process exited with code ${code}`)

    res.status(200).json({ success: true })
  })
}

app.use(function(req, res, next) {
  res.status(404).json({ success: false, message: 'Listener for the hook not found' })
})

app.use(function(err, req, res, next) {
  console.error(err.stack)

  res.status(500).json({ success: false })
})

app.listen(3000)

console.log('Server listen on :3000')
