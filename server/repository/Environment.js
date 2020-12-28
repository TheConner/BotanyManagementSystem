const RepositoryBase = require("./RepositoryBase");

class EnvironmentRepository extends RepositoryBase {
    /**
     * Creates a new environment repository
     */
    constructor() {
        super('environments')
    }
}
module.exports = EnvironmentRepository;