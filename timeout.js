'use strict'

const maxMessages = 3
const expiry = 5 * 1000
const timeoutLength = 15 * 1000

module.exports = function Timeout () {
  this.queue = []
  this.timeout = 0
  this.add = () => {
    let currentTime = (new Date()).getTime()
    this.queue = this.queue.filter((e) => e < expiry + currentTime)
    if (this.queue.length >= maxMessages) {
      this.timeout = currentTime + timeoutLength
      return false
    } else if (this.timeout > currentTime) {
      return false
    } else {
      this.queue[this.queue.length] = currentTime
      return true
    }
  }
}
