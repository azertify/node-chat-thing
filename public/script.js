'use strict'

const connectionString = (window.location.host)
  ? 'ws://ws.' + window.location.host
  : 'ws://localhost:8080'

const state = {
  ws: new window.WebSocket(connectionString),
  name: '',
  room: ''
}

state.ws.onmessage = (json) => {
  const message = JSON.parse(json.data)
  message.name.length > 0
    ? console.log(message.name + ': ' + message.content)
    : console.log('Anonymous: ' + message.content)
}

const sendJson = (json) => state.ws.send(JSON.stringify(json))

const chat = {
  changeRoom: (room) => {
    state.room = room
    sendJson({room})
  },
  changeName: (name) => {
    state.name = name
    sendJson({name})
  },
  send: (content) => sendJson({content})
}

chat.changeRoom('default')
