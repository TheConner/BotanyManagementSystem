/**
 * This is designed to populate fastify routes for a given entity
 * Given a repository, make it "restful"
 */

const API_BASE = '/api/';


/**
 * 
 * @param {RepositoryBase} repository Any repository that extends repository base
 * @param {string} entity Name of the entity
 * @param {array<string>} columns Array of columns that can be interacted with
 * @returns {async function} Fastify function definition for RESTful endpoint
 */
module.exports = function(repository, entity, columns) {
    
    return async function (fastify, opts) {
        /**
         * GET endpoint for selecting all rows
         */
        fastify.get(API_BASE + entity, async (request, repsonses) => {
            return repository.Read({}, ...columns)
        });

        
    }

}