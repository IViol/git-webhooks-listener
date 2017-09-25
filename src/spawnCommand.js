const { spawn } = require('child_process')

const webhooks = require('../webhooks')

module.exports = function spawnCommand(payload) {
  const webhook = getWebhook(payload)

  if (!webhook) {
    return { message: 'Command for this payload was not found. Aborting.', success: false }
  }

  const { command, args } = webhook

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

  return { success: true }
}

function getWebhook(payload) {
  let webhook = null

  webhooks.forEach(({ event, options, command, args }) => {
    if (event !== payload.event) {
      return
    }

    const isOptionsEqual = isEqual(options, payload.options)

    if (!isOptionsEqual) {
      return
    }

    webhook = { command, args }
  })

  return webhook
}

function isEqual(obj1, obj2) {
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}
