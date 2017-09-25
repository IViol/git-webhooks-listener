const spawnCommand = require('../spawnCommand')

module.exports = function pullRequest(payload, res) {
  const action = payload.action
  const branch = payload.pull_request.base.ref

  const result = spawnCommand({
    event: 'pull',
    options: { branch, action },
  })

  if (!result.success) {
    return res.status(201).json(result)
  }

  res.status(200).json(result)
}
