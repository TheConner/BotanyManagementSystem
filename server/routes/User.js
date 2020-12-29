'use strict'
const util = require('../util');
const UserRepository = new (require('../repository/User'))();

const API_BASE = '/api/';
const ALLOWED_FIELDS = [ 'first_name', 'last_name' ]

module.exports = async function (fastify, opts) {
    // Get user by 
    fastify.get(API_BASE + 'users/session', async function (request, reply) {
        // Get the session, we 
        let user = await UserRepository.Read({
            curr_token: request.headers["token"]
        }, ['first_name', 'last_name', 'email', 'last_login', 'username']);
        return user[0];
        });

    /*
    {
  "first_name": "Conner",
  "last_name": "Bradley",
  "email": "bradley@advtech.ca",
  "username": "netwinder"
}
    */
    fastify.patch(API_BASE + 'users', async function (request, reply) {
        if (request.body['username'] == null) {
            reply.code(400).send("Missing username");
            return;
        } 
        let user = (await UserRepository.Read({
            curr_token: request.headers["token"]
        }, ['id', 'username']))[0];
        
        if (user.username != request.body['username']) {
            reply.code(400).send("User can only modify their own account");
            return;
        }

        // Request body should have a user object. Extract updateable fields:
        let candidate = {};
                
        // For each key in request, copy over any of the allowed fields to the candidate object
        for (const [key,value] of Object.entries(request.body)) {
            if (ALLOWED_FIELDS.includes(key)) {
                candidate[key] = value;
            }
        }

        // We have built a candidate object, send it to the DB!
        await UserRepository.Update({
            username: request.body['username']
        }, candidate);
        
        return candidate;
    })
}