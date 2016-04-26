'use strict'

const connectionString = (window.location.hostname === 'localhost')
  ? 'ws://localhost:8080'
  : 'ws://' + window.location.host + ':8000'

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

state.ws.onconnect = () => {
  chat.changeRoom('default')
}

const sendJson = (json) => state.ws.send(JSON.stringify(json))
