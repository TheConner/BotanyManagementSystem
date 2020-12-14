'use strict'
const util = require('../util')

const API_BASE = '/api/'

function TableFormatter(rows, sensordata) {
    let output = []
    for (let row of rows) {
        let column = {}
        column['taken_on'] = row['taken_on']

        Object.keys(row['reading_cols']).forEach(e => {
            // key: the name of the object key
            // index: the ordinal position of the key within the object 
            column[e] = row['reading_cols'][e]
        });

        output.push(column);
    }
    return output;
}

module.exports = async function (fastify, opts) {
    /// Readings entity
    fastify.get(API_BASE + 'Readings', function(request, reply) {
        // Get sensor query param - see if this is for one or many sensors
        if(request.query['sensors'] != null) {
            // Multiple sensors, schema is as follows:
            // ?sensors=1,2,3,4
            let sensor_ids = []
            for (let raw_id of request.query['sensors'].split(',')) {
                if (isNaN(raw_id)) { throw 'Bad paramater' }
                // If we got here it's an int
                sensor_ids.push(raw_id)
            }

            let sensor_ids_str =  util.ToCommaSeperatedString(sensor_ids)
            if (sensor_ids_str.length==0) throw "No sensors to query";
            let limit = parseInt(request.query['Count'])||100
            
            // Handle request
            if (request.query['AsTable'] == 1) {
                let promises = []
                promises.push(fastify.pg.query(
                    `WITH sensor_readings AS (
                        SELECT taken_on,sensor,value
                          FROM reading
                          WHERE SENSOR IN (${sensor_ids_str})
                          ORDER BY taken_on
                      )
                      SELECT
                        taken_on,
                        jsonb_object_agg(sensor,value) AS reading_cols
                      FROM sensor_readings
                      GROUP BY taken_on
                      ORDER BY taken_on
                      LIMIT $1`,[limit]))
                promises.push(fastify.pg.query(`SELECT id,name FROM sensors WHERE id IN (${sensor_ids_str})`))
                
                Promise.all(promises)
                .then((data) => {
                    reply.send(TableFormatter(data[0].rows, data[1].rows))
                })
            } else {
                // Return default format
                fastify.pg.query(
                    `SELECT id,sensor,taken_on,value
                    FROM reading
                    WHERE sensor IN (${sensor_ids_str})
                    ORDER BY ID
                    LIMIT $1`, [limit],
                    function onResult(err, result) {
                        reply.send(err||fastify.ReadingFormatter(result.rows))
                    }
                )
            }

        } else {
            // Something's fucked
            throw "Bad Request"
        }
    })
}