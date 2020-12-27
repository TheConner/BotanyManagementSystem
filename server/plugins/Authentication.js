'use strict'

const fp = require('fastify-plugin');
const UserRepository = new (require('../repository/User'))();

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
            // Otherwise we will verify the token, which will be in the header or query string
            let token = request.headers["token"]||request.query["token"];
            if (token == null) reply.status(401).send();
            else {
                // A token exists, we can validate it
                UserRepository.Read({curr_token: token}, ['token_expiry'])
                .then((data) => {
                    data = data[0];
                    if (data != null && IsExpired(data['token_expiry'])) {
                        done()
                    } else {
                        reply.status(401).send();
                    }
                })
            }
        }
      })
})
