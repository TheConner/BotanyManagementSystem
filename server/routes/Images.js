'use strict'
const util = require('../util')
const sharp = require('sharp');

const API_BASE = '/api/'

module.exports = async function (fastify, opts) {
    fastify.post(API_BASE + 'Image', async function (request, reply) {
        const data = await request.file()
        // Loads whole file into memory
        // TODO limit file size
        const buffer = await data.toBuffer()
        let environment = -1;


        // Check if environment is defined
        if (data.fields['environment'] && data.fields['environment'].value) {
            environment = data.fields['environment'].value
            
    
            return fastify.pg.transact(async client => {
                // will resolve to an id, or reject with an error
                const id = await client.query(`
                INSERT INTO images(mimetype,filename,filedata, environment)
                VALUES ($1,$2,$3,$4)
                RETURNING id`,[data.mimetype,data.filename,buffer, environment]);
            
                return id.rows[0]
            })
        } else {
            reply.status(400).send("Environment ID missing")
        }
    });

    fastify.get(API_BASE + 'Images', function(request, reply) {
        fastify.pg.query(`SELECT id,environment,uploaded_on FROM images ORDER BY ID DESC LIMIT 100`)
        .then((data) => {
            for (let i in data.rows) {
                data.rows[i]['link'] = API_BASE + 'Image/' + data.rows[i]['id']
            }
            reply.send(data.rows)
        });
    })

    /// Endpoint gets an image
    fastify.get(API_BASE+ 'Image/:id', function(request, reply) {
        const id = parseInt(request.params['id'])
        const size = request.query['size'];
        if (isNaN(id)) { throw 'Bad paramater' }
        if ((request.query['size']!=null) && isNaN(parseInt(size))) {throw 'Bad paramater'}
        
        // Make le query
        fastify.pg.query(
            `SELECT mimetype,filename,filedata
            FROM images
            WHERE id=$1`, [id])
        .then((data) => {
            let result = data.rows[0]
            if (data.rows[0] == null)
                reply.status(404).send();
            else {
                // If we have to resize, do that now
                let resImage = Buffer.from(result['filedata']);
                if (size != null) {
                    sharp(resImage)
                    .resize(parseInt(size))
                    .toBuffer()
                    .then((resizedImage) => {
                        reply.header('content-type', result['mimetype']).send(resizedImage);
                    });
                } else {
                    reply.header('content-type', result['mimetype']).send(resImage);
                }
            }
                
        })
    })

    // Environment image metadata
    fastify.get(API_BASE + 'Images/Environment/:id', function(request, reply) {
        const id = parseInt(request.params['id'])
        if (isNaN(id)) { throw 'Bad paramater' }
        fastify.pg.query(
            `SELECT id,environment,uploaded_on
            FROM images
            WHERE environment=$1
            ORDER BY id DESC`, [id])
        .then((data) => {
            for (let i in data.rows) {
                data.rows[i]['link'] = API_BASE + 'Image/' + data.rows[i]['id']
            }
            reply.send(data.rows)
        })

    })

}