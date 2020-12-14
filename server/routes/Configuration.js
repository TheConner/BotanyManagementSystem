const format = require('pg-format');

const API_BASE = '/api/'

module.exports = async function (fastify, opts) {
    fastify.get(API_BASE + 'Configuration', function (request, reply) {
        let promises = [];
        // Pull all environment data
        promises.push(
            fastify.pg.query('SELECT * FROM environments')
        );
        promises.push(
            fastify.pg.query('SELECT * FROM sensors')
        );
        Promise.all(promises)
        .then((data) => {
            resp = [];
            for (let d of data){
                resp.push(d.rows)
            }
            reply.send(resp)
        })
    })

    fastify.patch(API_BASE + 'Configuration', function(request,reply) {
        let allowedTables = [
            'environments',
            'sensors'
        ];
        
        let table = request.body['table'];
        let data = request.body['data'];

        if (table == null || data == null || data.length == 0) {
            throw 'Bad input';
        }

        let promises = [];
        if (allowedTables.indexOf(request.body['table']) > -1) {
            // OK
            let promises = [];
            // For each element, update the table:
            for (let row of request.body['data']) {
                let keyValues = [];
                
                for (let key of Object.keys(row)) {
                    if (key != 'id') { // we can't update the id
                        keyValues.push(
                            format('%s',format('%I',key) + '=' + format('%L',row[key]))
                        );
                    }
                }
                let sql = format.withArray('UPDATE %I SET %s WHERE id=%L',[request.body['table'], keyValues, row.id])
                console.log("SECONDARY SQL")
                console.log(sql)

                // --- Query Complete ---
                promises.push(fastify.pg.query(sql))
            }

            Promise.all(promises)
            .then((data) => {
                query = 'SELECT * FROM ' + table
                fastify.pg.query(query)
                .then((data) => {
                    reply.send(data.rows)
                })
            })
            .catch((e) => {throw e});
        } else {
            throw "Bad table";
        }
    })
}