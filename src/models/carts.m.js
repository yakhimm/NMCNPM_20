const fs = require('fs');
const pathDb = './db/cart.json';

//WriteFile:
// const utils = require("util");
// const writeFileAsync = utils.promisify(fs.writeFile);

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(pathDb, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    },
};