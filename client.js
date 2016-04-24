'use strict'

let Timeout = require('./timeout')

module.exports = function Client(ws) {
  this.room =  ''
  this.name = ''
  this.send = (message) => ws.send(message)
  this.timeout = new Timeout()
}