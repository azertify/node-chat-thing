'use strict'

const hostname = process.env.NODE_IP || 'localhost'
const port = process.env.NODE_PORT || 8080

const webserver = require('http').createServer()
const nodeStatic = require('node-static')
const fileserver = new nodeStatic.Server('./public')
const WebSocketServer = require('ws').Server
const server = new WebSocketServer({server: webserver})
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

webserver.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200)
    res.end()
  } else {
    fileserver.serve(req, res)
  }
})
webserver.listen(port, hostname)
