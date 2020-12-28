const RepositoryBase = require("./RepositoryBase");

class SensorRepository extends RepositoryBase {
    /**
     * Creates a new sensor repository
     */
    constructor() {
        super('sensors')
    }
}

module.exports = SensorRepository;