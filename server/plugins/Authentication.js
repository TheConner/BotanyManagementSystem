'use strict'

const fp = require('fastify-plugin');

// 
const WHITELIST = [
    "/api/Login",
    "/api/"
];
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

function IsExpired(date) {
    let d = Date.parse(date);
    let today = new Date();
    console.log(d>today);
    return d > today;
}

module.exports = fp(async function (fastify, opts) {
    fastify.addHook('onRequest', (request, reply, done) => {
        if (WHITELIST.includes(request.routerPath)) {
            console.log("WHITELIST PATH - skip auth check")
            done();
        } else {
            // Otherwise we will verify the token
            let token = request.headers["token"]||request.query["token"];
            if (token == null) reply.status(401).send()
            else {
                // A token exists, we can validate it
                fastify.pg.query(
                    'SELECT token_expiry FROM users WHERE curr_token=$1',[token]
                ).then((data) => {
                    if (data.rows != null && data.rows[0] != null && IsExpired(data.rows[0]['token_expiry'])) {
                        done()
                    } else {
                        reply.status(401).send();
                    }
                })
            }
        }
      })
})
