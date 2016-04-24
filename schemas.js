'use strict'

let Ajv = require('ajv')
let ajv = new Ajv()

module.exports = {
  isMessage: ajv.compile({
    properties: {
      content: {
        type: 'string',
        minLength: 1,
        maxLength: 500
      }
    },
    required: ['content']
  }),

  isName: ajv.compile({
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 30
      }
    },
    required: ['name']
  }),

  isRoom: ajv.compile({
    properties: {
      room: {
        type: 'string',
        minLength: 2,
        maxLength: 30
      }
    },
    required: ['room']
  })
}
