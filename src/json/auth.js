let obj = {
    token: process.env.token,
    db: {
        host: process.env.dbhost,
        user: process.env.dbuser,
        pass: process.env.dbpass
    }
}
module.exports = obj