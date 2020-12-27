const crypto = require('crypto');
const knex = require('./knex');

/// Creates a user
function Create(pg, username, email, first_name, last_name, password) {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`); 

    return pg.query(
        `INSERT INTO users(username,email,first_name,last_name,password,salt)
        VALUES ($1,$2,$3,$4,$5,$6)`, [username, email, first_name, last_name, hash, salt])
}

/// Reads a user
// Criteria is an object that contains the filtering criteria for the user we want to get
function Read(criteria, columns) {
    return knex('users').where(criteria).select(...columns);
}

function Update(criteria, update) {
    //console.log(knex('users').where(criteria).update(update).toSQL().toNative())
    return knex('users').where(criteria).update(update);
}



module.exports = {
    Create: Create,
    Read: Read,
    Update: Update
}