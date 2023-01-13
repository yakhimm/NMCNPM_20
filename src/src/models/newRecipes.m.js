const fs = require('fs');
const pathDb = './db/newRecipes.json';

const utils = require("util");
const writeFileAsync = utils.promisify(fs.writeFile);


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
    
    write: async(data) => {
        return await writeFileAsync(pathDb, data, 'utf8');
    }
};