const crypto = require('crypto')

function Create(pg, username, email, first_name, last_name, password) {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`); 

    return pg.query(
        `INSERT INTO users(username,email,first_name,last_name,password,salt)
        VALUES ($1,$2,$3,$4,$5,$6)`, [username, email, first_name, last_name, hash, salt])
}



module.exports = {
    Create: Create
}