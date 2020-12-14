'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('ReadingFormatter', (data) => {
        // Parse the result into a graphable form
        let retObj = {}

        // Build return object schema
        for (let s of data) {
            retObj[s.sensor] = {
                'value': [],
                'taken_on': []
            }
        }

        // Populate schema
        for (let row of data) {
            retObj[row.sensor]['value'].push(row['value'])
            retObj[row.sensor]['taken_on'].push(row['taken_on'])
        }

        return retObj
    })
})
