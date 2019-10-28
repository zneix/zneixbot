module.exports = () => {
    var obj = {
        token: process.env.token,
        db: {
            host: process.env.dbhost,
            user: process.env.dbuser,
            pass: process.env.dbpass
        }
    }
    return obj;
}