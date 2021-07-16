// Just used for seeding
// Currently only for dev use
const UserRepository = require('./repository/User');
const DevConfig = require('./config.dev.json');

function AddDummyUsers(ur, Users) {
    for (let u of Users) {
        ur.Create(u)
        .then((res) => {
            console.log("User Created", res);
            client.end();
        })
        .catch((e) => console.log("Cannot create user"));
    }
}


// DB SEEDER
module.exports = function() {
    console.log("--- Seeding DB ---");
    let urepo = new UserRepository();

    AddDummyUsers(urepo, DevConfig["DevUsers"])
}