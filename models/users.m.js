const initOptions = {};
const pgp = require('pg-promise')(initOptions);

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'YummyWebsite',
    user: 'postgres',
    password: '20120275',
    max: 30
};

const db = pgp(cn);

module.exports = {
    getAll: async () => {
        const rs = await db.any('SELECt * FROM users');
        return rs;
    },
    add: async acc => {
        const rs = await db.one('INSERT INTO users(fullname, username, phone, email, address, password) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [acc.fullname, acc.username, acc.phone, acc.email, acc.address, acc.password]);
        return rs;
    },
    // lấy database dựa vào tham số username nhập từ login
    byName: async username => {
        console.log(username);
        const rs = await db.one('SELECT * FROM users WHERE username=$1', [username]);
        return rs;
    }
};