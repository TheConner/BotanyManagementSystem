'use strict'
const util = require('../util');
const UserRepository = new (require('../repository/User'))();

const API_BASE = '/api/';

module.exports = async function (fastify, opts) {
    // Get user by 
    fastify.get(API_BASE + 'users/session', async function (request, reply) {
        // Get the session, we 
        let user = await UserRepository.Read({
            curr_token: request.headers["token"]
        }, ['first_name', 'last_name', 'email', 'last_login', 'username']);
        return user[0];
    });
}