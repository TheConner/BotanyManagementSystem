const knex = require("./knex");
const RepositoryBase = require("./RepositoryBase");
const util = require('../util');

/**
 * Reading repository, highly custom compared to the other repositories.
 * Knex may not cut the cheese for this one.
 */
class ReadingRepository extends RepositoryBase {
    /**
     * Creates a new reading repository
     */
    constructor() {
        super('readings')
    }

    /**
     * Get readings based on criteria. Wrapper to get_reading_paginated
     * @param {*} criteria
     * @param {*} columns 
     */
    Read(criteria, columns) {
        let sensor_ids_str = util.ToCommaSeperatedString(criteria.sensors);
        let page = criteria.page;
        let limit = criteria.limit;

        return knex.raw(`SELECT id,taken_on,sensor,value FROM get_reading_paginated(array[${sensor_ids_str}], ?, ?)`, [page, limit]);
    }


}

module.exports = ReadingRepository;