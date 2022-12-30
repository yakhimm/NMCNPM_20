const fs = require('fs');
const pathDb = './db/dailyRecipes.json';

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