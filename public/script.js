'use strict'

let state = {
  ws: new WebSocket('ws://localhost:8080'),
  name: '',
  room: ''
}

state.ws.onmessage = (json) => {
  let message = JSON.parse(json.data)
  message.name.length > 0
    ? console.log(message.name + ": " + message.content)
    : console.log("Anonymous: " + message.content)
}

let sendJson = (json) => state.ws.send(JSON.stringify(json))

let chat = {
  changeRoom(room) {
    state.room = room
    sendJson({room})
  },
  changeName(name) {
    state.name = name
    sendJson({name})
  },
  send: (content) => sendJson({content})
}