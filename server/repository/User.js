const crypto = require('crypto');
const knex = require('./knex');
const RepositoryBase = require('./RepositoryBase');


/// Creates a user
function Create(pg, username, email, first_name, last_name, password) {
    
    

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
    return knex('users').where(criteria).update(update);
}

class UserRepository extends RepositoryBase {
    constructor() {
        super('users')
    }

    Create(user) {
        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64, `sha512`).toString(`hex`); 
        user.salt = salt;
        user.password = hash;
        return knex(this.entity).insert(user)
    }
}



module.exports = UserRepository;