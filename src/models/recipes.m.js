const fs = require('fs');
const pathDb = './db/recipes.json';

const initOptions = {};
const pgp = require('pg-promise')(initOptions);

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'YummyWebsite',
    user: 'postgres',
    password: '123',
    max: 30
};

const db = pgp(cn);

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

    getAllFavoriteRecipes: async() => {
        const rs = await db.any('SELECT * FROM "FavoriteRecipes" ORDER BY "id" ASC');
        return rs;
    },
    getAllFavoriteRecipesByUserID: async(id) => {
        const rs = await db.any('SELECT * FROM "FavoriteRecipes" WHERE "userID"=$1', [id]);
        return rs;
    },
    addFavoriteRecipe: async(f) => {
        const rs = await db.none('INSERT INTO "FavoriteRecipes"("id", "userID", "recipeName") VALUES($1, $2, $3) RETURNING *',
            [f.id, f.userID, f.name]);
        return rs;
    },
    deleteFavoriteRecipe: async(f) => {
        const rs = await db.none('DELETE FROM "FavoriteRecipes" WHERE "userID"=$1 AND "recipeName"=$2', [f.userID, f.recipeName]);
        return rs;
    },
};