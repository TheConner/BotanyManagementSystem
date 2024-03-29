const knex = require('./knex');


/**
 * Our generic repository superclass, just a knex wrapper for CRUD
 */
class RepositoryBase {
    /**
     * Creates a new repository base
     * @param {string} entity Table name of the entity
     */
    constructor(entity) {
        this.entity = entity;
    }

    Create(obj) {
        return knex(this.entity).insert(obj);
    }

    Read(criteria, columns) {
        return knex(this.entity).where(criteria).select(...columns);
    }

    Update(criteria, obj) {
        return knex(this.entity).where(criteria).update(obj);
    }

    Delete(criteria) {
        return knex(this.entity).any.del();
    }
}

module.exports = RepositoryBase;