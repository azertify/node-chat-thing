'use strict'

let WebSocketServer = require('ws').Server
let wss = new WebSocketServer({port: 8080})
let schemas = require('./schemas')
let Client = require('./client')

let clients = []

let send = (room, message) => clients
  .filter((c) => room === c.room)
  .forEach((c) => c.send(JSON.stringify({
    name: c.name,
    content: message
  })))

let processMsg = (client, message) => {
  if (schemas.isMessage(message) && client.timeout.add())
    send(client.room, message.content)
  else if (schemas.isName(message))
    client.name = message.name
  else if (schemas.isRoom(message))
    client.room = message.room
}

wss.on('connection', (ws) => {
  let client = new Client(ws)
  clients.push(client)
  ws.on('message', (data) => processMsg(client, JSON.parse(data)))
  ws.on('close', () => clients.splice(clients.indexOf(client)))
  ws.on('error', (e) => console.error(e))
})