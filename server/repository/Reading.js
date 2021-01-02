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
        super('reading')
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

    ReadCount(criteria) {
        return knex(this.entity).count('id').whereRaw('sensor = ANY(?)', [criteria.sensors])
    }

    /**
     * Creates many readings
     * @param {*} readings 
     */
    Create(readings) {
        return knex.transaction((trx) => {
            let readings_clean = [];
            for (let reading of readings) {
                readings_clean.push({
                    sensor: reading.sensor,
                    value: reading.value
                });
            }
            // Sanitize input
            return trx(this.entity).insert(readings_clean);
        });
    }

}

module.exports = ReadingRepository;