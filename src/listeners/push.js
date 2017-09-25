const spawnCommand = require('../spawnCommand')

module.exports = function push(payload, res) {
  const branch = payload.ref.replace('refs/heads/', '')

  const result = spawnCommand({
    event: 'push',
    options: { branch },
  })

  if (!result.success) {
    return res.status(201).json(result)
  }

  res.status(200).json(result)
}
