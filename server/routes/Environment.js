'use strict'
const util = require('../util')

const API_BASE = '/api/'

module.exports = async function (fastify, opts) {
    /// Environment entity stuff
    fastify.get(API_BASE + 'environments', function (request, reply) {
        fastify.pg.query(
            'SELECT id,name,description FROM environments',
            function onResult(err, result) {
                reply.send(err||result.rows)
            }
        )
    })

    fastify.get(API_BASE + 'environments/:id', (request, reply) => {
        // Verify the environment id
        const id = parseInt(request.params['id'])
        if (isNaN(id)) { throw 'Bad paramater' }
        let envPromise = fastify.pg.query('SELECT id,name,description FROM environments WHERE id=$1', [id])
        let senPromise = fastify.pg.query('SELECT id,environment,name,description FROM sensors WHERE environment=$1', [id])
        Promise.all([envPromise, senPromise])
        .then((data) => {
            // Build our environment object
            let envData = data[0].rows[0]
            envData['sensors'] = data[1].rows
            reply.send(envData)
        })
    })

    fastify.post(API_BASE + 'environments', function(request, reply) {
        // TODO Use request values
        fastify.pg.query(`INSERT INTO environments(name,description) VALUES ('new environment','')`)
        .then((data) => reply.send(data));
    });

    fastify.delete(API_BASE + 'environments/:id', function(request, reply) {
        const id = parseInt(request.params['id'])
        if (isNaN(id)) { throw 'Bad paramater' }
        fastify.pg.query('DELETE FROM environments WHERE id=$1',[id])
        .then((data) => reply.send(data));
    })
}