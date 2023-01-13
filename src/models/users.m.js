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
        const rs = await db.any('SELECT * FROM "Users" ORDER BY "id" ASC');
        return rs;
    },
    add: async acc => {
        const rs = await db.one('INSERT INTO "Users"(id, fullname, username, phone, email, address, password) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [acc.id, acc.fullname, acc.username, acc.phone, acc.email, acc.address, acc.password]);
        return rs;
    },
    // lấy database dựa vào tham số username nhập từ login
    byName: async username => {
        const rs = await db.one('SELECT * FROM "Users" WHERE username=$1', [username]);
        return rs;
    },
    editAccount: async(u, id) => {
        const rs = await db.none('UPDATE "Users" SET "fullname"=$1, "phone"=$2, "email"=$3, "address"=$4 WHERE "id"=$5', 
            [u.fullname, u.phone, u.email, u.address, id]);
        return rs;
    },
    editPassword: async(pw, id) => {
        const rs = await db.none('UPDATE "Users" SET "password"=$1 WHERE "id"=$2', 
            [pw, id]);
        return rs;
    },
};