'use strict'
const util = require('../util');
const SensorRepository = new (require('../repository/Sensor'))();

const API_BASE = '/api/';

module.exports = async function (fastify, opts) {
    /// Sensors entity stuff
    fastify.get(API_BASE + 'sensors', async function (request, reply) {
        return SensorRepository.Read({}, ['id', 'environment', 'name', 'description'])
    })


    fastify.post(API_BASE + 'sensors', async function(request, reply) {
        let env = request.body['env'];
        let name = request.body['name'];
        let desc = request.body['desc'];
        if (env == null  || name == null || desc == null)
            throw 'Bad input!'
        try {
            await SensorRepository.Create({
                environment: env,
                name: name,
                description: desc
            });
            reply.send();
        } catch (e) {
            reply.code(500).send("Server error while adding sensor");
        }
    });

    fastify.delete(API_BASE + 'sensors/:id', async function(request, reply) {
        const id = parseInt(request.params['id'])
        if (isNaN(id)) { throw 'Bad paramater' }
        try {
            await SensorRepository.Delete({
                id: id
            })
            reply.send()
        } catch (e) {
            reply.code(500).send("Server error while deleting sensor");
        }
    })   
}