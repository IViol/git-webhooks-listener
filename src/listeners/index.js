const ping = require('./ping')
const push = require('./push')
const pullRequest = require('./pullRequest')

module.exports = {
  ping: ping,
  push: push,
  pullRequest: pullRequest,
}
