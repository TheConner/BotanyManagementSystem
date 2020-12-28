'use strict'
const util = require('../util');
const XLSX = require('xlsx');

const API_BASE = '/api/';
const ReadingRepository = new (require('../repository/Reading'))();
const SensorRepository = new (require('../repository/Sensor'))();

function TableFormatter(rows, sensordata) {
    let output = []
    let largestID = undefined;
    let smallestID = undefined;
    for (let row of rows) {
        // Extract min / max
        if (row['id_min'] < smallestID || smallestID == null) smallestID = row['id_min'];
        if (row['id_max'] > largestID || largestID == null) largestID = row['id_max'];
        
        let column = {}
        column['taken_on'] = row['taken_on']

        Object.keys(row['reading_cols']).forEach(e => {
            // key: the name of the object key
            // index: the ordinal position of the key within the object 
            column[e] = row['reading_cols'][e]
        });

        output.push(column);
    }
    return {
        data: output,
        pagination_prev_id: smallestID,
        pagination_next_id: largestID
    };
}

function ExcelFormatter(rows, sensordata) {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Analytics Export",
        Author: "BMS by Conner Bradley",
        CreatedDate: new Date()
    }

    let data = TableFormatter(rows, sensordata);
    let ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sensordata.name);
    
    return XLSX.write(wb, {
        type: 'buffer',
        bookType: 'xlsx',
        compression: true
    });
}

module.exports = async function (fastify, opts) {
    /// Readings entity
    // TODO: Make function less hairy
    fastify.get(API_BASE + 'Readings', async function(request, reply) {
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
            let page = parseInt(request.query['Page'])||0;

            let criteria = {
                sensors: sensor_ids,
                page: page,
                limit: limit
            }
            
            // If we want tabulated or a sheet of data, we have to massage it a bit
            if (request.query['AsTable'] == 1 || request.query['AsExcel'] == 1) {
                let promises = []
                // TODO: make a stored procedure
                promises.push(fastify.pg.query(
                    `
                    WITH sensor_readings AS (
                        SELECT id,taken_on,sensor,value FROM get_reading_paginated(array[${sensor_ids_str}], $1, $2)
                    )
                    SELECT
                    taken_on,
                    jsonb_object_agg(sensor,value) AS reading_cols,
                    max(id) AS id_max,
                    min(id) AS id_min
                    FROM sensor_readings
                    GROUP BY taken_on
                    ORDER BY taken_on`,[page, limit]));

                promises.push(fastify.pg.query(`SELECT id,name FROM sensors WHERE id IN (${sensor_ids_str})`))
                
                Promise.all(promises)
                .then((data) => {
                    if (request.query['AsExcel'] == 1) {
                        return ExcelFormatter(data[0].rows, data[1].rows);
                    } else if (request.query['AsTable'] == 1) {
                        return TableFormatter(data[0].rows, data[1].rows);
                    }
                    
                })
                .then((formattedData) => {
                    if (request.query['AsExcel'] == 1) {
                        reply.header('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(formattedData)
                    } else {
                        reply.send(formattedData)
                    }
                })
            } else {
                let res = await ReadingRepository.Read(criteria, []);
                return fastify.ReadingFormatter(res.rows);
            }

        } else {
            // Something's fucked
            throw "Bad Request"
        }
    })
}