'use strict'

const port = process.env.OPENSHIFT_NODEJS_PORT || 8080

const WebSocketServer = require('ws').Server
const server = new WebSocketServer({port})
const schemas = require('./schemas')
const Client = require('./client')

const clients = []

const removeClient = (client) => clients.splice(clients.indexOf(client))

const send = (room, message) => clients
  .filter((c) => room === c.room)
  .forEach((c) => c.send(JSON.stringify({
    name: c.name,
    content: message
  }), (error) => {
    if (error) removeClient(c)
  }))

const processMsg = (client, message) => {
  if (schemas.isMessage(message) && client.timeout.add()) {
    send(client.room, message.content)
  } else if (schemas.isName(message)) {
    client.name = message.name
  } else if (schemas.isRoom(message)) {
    client.room = message.room
  }
}

server.on('connection', (ws) => {
  const client = new Client(ws)
  clients.push(client)
  ws.on('message', (data) => processMsg(client, JSON.parse(data)))
  ws.on('close', () => removeClient(client))
  ws.on('error', (e) => console.error(e))
})
