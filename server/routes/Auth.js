'use strict'
const util = require('../util')

const API_BASE = '/api/'
const crypto = require('crypto')

function auth_genToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(256, function(err, buffer) {
            if (err) reject(err);
            var token = buffer.toString('hex');
            resolve(token);
        });
    })
}

module.exports = async function (fastify, opts) {
    fastify.post(API_BASE + 'Login', function (request, reply) {
        console.log("Auth check")
        // Request body has to have username and password
        let username = request.body['username'];
        let password = request.body['password'];
        fastify.pg.query(
            'SELECT id,password,salt FROM users WHERE username=$1',
            [username]
        )
        .then((data) => {
            if (data.rows[0] != null && data.rows[0]['id'] != null) {
                // Validate 
                let hash = data.rows[0]['password'];
                let salt = data.rows[0]['salt'];
                let validate_hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
                if (validate_hash === hash) {
                    return auth_genToken();
                } else {
                    reply.code(401).send("Authentication Failed: Bad Username or Password");
                }
            } else {
                reply.code(401).send("Authentication Failed: Bad Username or Password");
            }
        })
        .then((token) => {
            let expiry = new Date();
            expiry.setMonth(expiry.getDate()+14);
            fastify.pg.query('UPDATE users SET curr_token=$1, token_expiry=$2',[token,expiry]);
            return token;
        })
        .then((token) => {
            reply.send(token)
        })
    })

    fastify.post(API_BASE + 'User', function (request, reply) {
        // Request body has to have username and password
        let username = request.body['username'];
        let email = request.body['email'];
        let password = request.body['password'];
        let first_name = request.body['first_name'];
        let last_name = request.body['last_name'];

        // TODO check if all of the above crap is in the request

        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`); 


        try {
            fastify.pg.query(
                `INSERT INTO users(username,email,first_name,last_name,password,salt)
                VALUES ($1,$2,$3,$4,$5,$6)`,
                [username, email, first_name, last_name, hash, salt],
                function onResult(err,result) {
                    reply.send(err||result)
                }
            )
        } catch {
            reply.code(200).send("Server error")
        }
    })

}