const crypto = require('crypto');
const knex = require('./knex');
const RepositoryBase = require('./RepositoryBase');

class UserRepository extends RepositoryBase {
    /**
     * Creates a new user repository
     */
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