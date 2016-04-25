'use strict'

const Timeout = require('./timeout')

module.exports = function Client (ws) {
  this.room = ''
  this.name = ''
  this.send = (message, callback) => ws.send(message, callback)
  this.timeout = new Timeout()
}
