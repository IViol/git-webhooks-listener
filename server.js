import express from 'express'
import { spawn } from 'child_process'

const app = express()

app.use(function(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`)

  next()
})

app.post('/push', function(req, res, next) {
  const command = 'make'
  const args = ['push']

  console.log('Request body is', req.body)

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
  })

  res.status(200).json({ success: true })
})

app.use(function(req, res, next) {
  res.status(404).json({ success: false, message: 'Listener for the hook not found' })
})

app.use(function(err, req, res, next) {
  console.error(err.stack)

  res.status(500).json({ success: false })
})

app.listen(3000)

console.log('Server listen on :3000')
