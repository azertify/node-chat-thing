'use strict'

const maxMessages = 5
const expiry = 5 * 1000
const timeoutLength = 15 * 1000

module.exports = function Timeout () {
  this.queue = []
  this.timeout = 0
  this.add = () => {
    const currentTime = (new Date()).getTime()
    this.queue = this.queue.filter((e) => e + expiry > currentTime)
    console.log(this.queue)
    if (this.timeout > currentTime) {
      return false
    } else if (this.queue.length >= maxMessages) {
      this.timeout = currentTime + timeoutLength
      return false
    } else {
      this.queue[this.queue.length] = currentTime
      return true
    }
  }
}
