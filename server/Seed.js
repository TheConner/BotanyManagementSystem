// Just used for seeding
// Currently only for dev use
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const User = require('./repository/User');
const DevConfig = require('./config.dev.json');

function AddDummyUsers(Users) {
    for (let u of Users) {
        const client = new Client({connectionString,});
        client.connect()
        User.Create(client, 
            u["username"], 
            u["email"], 
            u["first_name"], 
            u["last_name"], 
            u["password"])
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

    AddDummyUsers(DevConfig["DevUsers"])
}