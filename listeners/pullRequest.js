const { spawn } = require('child_process')

module.exports = function pullRequest(payload, res) {
  const command = 'make'
  const args = ['pull_request']

  console.log('payload is', payload)
  const action = payload.action
  const branch = payload.pull_request.base.ref

  console.log(`Action is ${action}`)
  console.log(`Branch is ${branch}`)

  if (branch !== 'master') {
    return res.status(201).json({ message: 'Payload was not for master. Aborting.' })
  }

  if (action !== 'closed') {
    return res.status(201).json({ message: 'Payload was not for merged PR. Aborting.' })
  }

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
