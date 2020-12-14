'use strict'
const util = require('../util')

const API_BASE = '/api/'

module.exports = async function (fastify, opts) {
    /// Sensors entity stuff
    fastify.get(API_BASE + 'sensors', function (request, reply) {
        fastify.pg.query(
            'SELECT id,environment,name,description FROM sensors',
            function onResult(err, result) {
                reply.send(err||result.rows)
            }
        )
    })


    fastify.post(API_BASE + 'sensors', function(request, reply) {
        let env = request.body['env'];
        let name = request.body['name'];
        let desc = request.body['desc'];
        if (env == null  || name == null || desc == null)
            throw 'Bad input!'

        fastify.pg.query(`
        INSERT INTO sensors(environment,name,description) 
        VALUES ($1,$2,$3)`,[env,name,desc])
        .then((data) => reply.send());
    });

    fastify.delete(API_BASE + 'sensors/:id', function(request, reply) {
        const id = parseInt(request.params['id'])
        if (isNaN(id)) { throw 'Bad paramater' }
        fastify.pg.query('DELETE FROM sensors WHERE id=$1',[id])
        .then((data) => reply.send(data));
    })

    
}