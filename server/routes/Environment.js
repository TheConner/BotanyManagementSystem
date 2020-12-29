'use strict'

const API_BASE = '/api/'
const EnvironmentRepository = new (require('../repository/Environment'))();
const SensorRepository = new (require('../repository/Sensor'))();

module.exports = async function (fastify, opts) {
    /// Environment entity stuff
    fastify.get(API_BASE + 'environments', async function (request, reply) {
        return EnvironmentRepository.Read({}, ['id', 'name', 'description']);
    })

    fastify.get(API_BASE + 'environments/:id', (request, reply) => {
        // Verify the environment id
        const id = parseInt(request.params['id'])
        if (isNaN(id)) { throw 'Bad paramater' }
        // Everything is okay, continue 
        let envPromise = EnvironmentRepository.Read({id: id}, ['id', 'name', 'description']);
        let senPromise = SensorRepository.Read({environment: id}, ['id', 'environment', 'name', 'description', 'ui_color'])
        Promise.all([envPromise, senPromise])
        .then((data) => {
            // Build our environment object
            let envData = data[0][0]
            envData['sensors'] = data[1]
            reply.send(envData)
        })
    })

    fastify.post(API_BASE + 'environments', async function(request, reply) {
        // TODO Use request values, return something meaningful
        await EnvironmentRepository.Create({
            name: '',
            description: ''
        });
        return true;
    });

    fastify.delete(API_BASE + 'environments/:id', async function(request, reply) {
        const id = parseInt(request.params['id'])
        if (isNaN(id)) { throw 'Bad paramater' }
        return EnvironmentRepository.Delete({id: id});
    })
}