const fs = require('fs');
const pathDb = './db/recipes.json';

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
        const rs = await db.one('INSERT INTO "FavoriteRecipes"("id", "userID", "recipeName") VALUES($1, $2, $3) RETURNING *',
            [f.id, f.userID, f.tenmon]);
        return rs;
    },
    deleteFavoriteRecipe: async(f) => {
        const rs = await db.none('DELETE FROM "FavoriteRecipes" WHERE "userID"=$1 AND "recipeName"=$2', [f.userID, f.recipeName]);
        return rs;
    },
    
    getNewRecipes: async() => {
        const rs = await db.any('SELECT * FROM "NewRecipes"');
        return rs;
    },
    getNewRecipesByUserID: async(id) => {
        const rs = await db.any('SELECT * FROM "NewRecipes" WHERE "userID"=$1', [id]);
        return rs;
    },
    addNewRecipe: async(r) => {
        const rs = await db.one('INSERT INTO "NewRecipes"("id", "userID", "recipeName") VALUES($1, $2, $3) RETURNING *',
            [r.id, r.userID, r.recipeName]);
        return rs;
    },
    editRecipe: async(recipeName, id) => {
        const rs = await db.none('UPDATE "NewRecipes" SET "recipeName"=$1 WHERE "userID"=$2',
                [recipeName, id]);
        return rs;
    },
    deleteRecipe: async(recipeName, id) => {
        const rs = await db.none('DELETE FROM "NewRecipes" WHERE "recipeName"=$1 AND "userID"=$2',
                [recipeName, id]);
        return rs;
    },


};