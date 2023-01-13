const allRecipesM = require('../models/recipes.m');
const carousRecipesM = require('../models/carouselRecipes.m');
const dailyRecipesM = require('../models/dailyRecipes.m');
const rcmRecipesM = require('../models/rcmRecipes.m');
const newRecipesM = require('../models/newRecipes.m');
const favorRecipesM = require('../models/favoriteRecipes.m');
const cartsM = require('../models/carts.m');

const helpers = require('../helpers/helpers');
const fs = require('fs');

exports.getAllRecipes = async (req, res, next, model) => {
    const allRecipes = await model.getAll();
    const list_name = Object.keys(allRecipes);
    let detail_recipe = [];

    for (var i = 0; i < list_name.length; i++) {
        let name = list_name[i].replaceAll("-", " ");

        detail_recipe.push({
            name,
            detail: allRecipes[list_name[i]]
        });
    }

    return detail_recipe;
}

exports.getCarouselRecipes = async (req, res, next) => {
    const { carouselRecipes } = await carousRecipesM.getAll();

    let detail_recipe = [];
    let carousel_Recipes = [];

    for (var i = 0, j = 0; i < carouselRecipes.length; i++) {
        detail_recipe.push(carouselRecipes[i]);

        j++;
        if (j === 3) {
            carousel_Recipes.push({
                slide: detail_recipe
            });
            detail_recipe = [];
            j = 0;
        }
    }
    return carousel_Recipes;
};

exports.getDailyRecipes = async (req, res, next) => {
    const { dailyRecipes } = await dailyRecipesM.getAll();

    let detail_recipe = [];
    let carouselRecipes = [];

    for (var i = 0, j = 0; i < dailyRecipes.length; i++) {
        detail_recipe.push(dailyRecipes[i]);

        j++;
        if (j === 3) {
            carouselRecipes.push({
                slide: detail_recipe
            });
            detail_recipe = [];
            j = 0;
        }
    }
    return carouselRecipes;
};

exports.getRcmRecipes = async (req, res, next) => {
    const { rcmRecipes } = await rcmRecipesM.getAll();

    let detail_recipe = [];
    let carouselRecipes = [];

    for (var i = 0, j = 0; i < rcmRecipes.length; i++) {
        detail_recipe.push(rcmRecipes[i]);

        j++;
        if (j === 3) {
            carouselRecipes.push({
                slide: detail_recipe
            });
            detail_recipe = [];
            j = 0;
        }
    }
    return carouselRecipes;
};

exports.getHome = async (req, res, next) => {

    let { newRecipes } = await newRecipesM.getAll()
    let { favorRecipes } = await favorRecipesM.getAll();

    // get data for carousels
    const dailyRecipes = await this.getDailyRecipes(req, res, next);
    const rcmRecipes = await this.getRcmRecipes(req, res, next);
    const carousRecipes = await this.getCarouselRecipes(req, res, next);

    let { page } = req.query;
    let total = newRecipes.length;

    if (page) {
        newRecipes = newRecipes.slice((page - 1) * 10, (page - 1) * 10 + 10);
    } else {
        page = 1;
        newRecipes = newRecipes.slice(0, 10);
    }

    let favorite_counts = 0;
    if (req.session.authenticated) {
        const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);
        favorite_counts = favoriteRecipesDb.length;
    }
    else {
        favorite_counts = 0;
    }

    res.render('home', {
        authenticated: req.session.authenticated,
        user: req.session.user,
        newRecipes: newRecipes.reverse(),
        showFavoriteSide: true,
        dailyRecipes,
        rcmRecipes,
        favorRecipes,
        carousRecipes,
        total,
        page,
        helpers,
        favorite_counts
    });
};


let recipeName = '';
exports.getDetailRecipe = async (req, res, next) => {
    try {
        let { tenmon } = req.params;

        const { favorRecipes } = await favorRecipesM.getAll();

        const { recipes } = await allRecipesM.getAll();
        const detail_recipe = [];

        let favorite_counts = 0;
        if (req.session.authenticated) {
            const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);
            favorite_counts = favoriteRecipesDb.length;
        }

        for (var i = 0; i < recipes.length; i++) {
            if (recipes[i].tenmon === tenmon) {
                recipeName = recipes[i].tenmon;

                detail_recipe.push(recipes[i]);

                return res.render('detail_recipe', {
                    authenticated: req.session.authenticated,
                    user: req.session.user,
                    showFavoriteSide: true,
                    detail_recipe,
                    favorRecipes,
                    favorite_counts,
                    layout: 'option02_layouts'
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

let keyword = '';
let list = [];
function checkIngredient(listIngredient, type) {
    let n = 0;
    for (var j = 0; j < type.length; j++) {

        for (var i = 0; i < listIngredient.length; i++) {
            listIngredient[i] = listIngredient[i].toLowerCase();
            listIngredient[i] = listIngredient[i].trim();

            if (listIngredient[i].includes(type[j])) {
                n++;
                break;
            }
        }
    }

    if (n === type.length) {
        return true;
    }

    return false;
};

function checkObject(type) {
    if (typeof (type) === "string") {
        return [type];
    };
    return type;
};

exports.postSearch = async (req, res, next) => {
    try {
        let { search } = req.body;

        const { favorRecipes } = await favorRecipesM.getAll();

        let { recipes } = await allRecipesM.getAll();
        let recipesSearch = [];                                                       //mảng lưu những công thức mà người dùng nhập từ khóa tìm kiếm

        let favorite_counts = 0;
        if (req.session.authenticated) {
            const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);
            favorite_counts = favoriteRecipesDb.length;
        }

        if (search) {
            keyword = search;
            search = search.toLowerCase();

            for (var i = 0; i < recipes.length; i++) {
                let temp = recipes[i].tenmon;
                temp = temp.toLowerCase();

                let [list_ingredient] = Object.values(recipes[i].nguyenlieu);      //mảng lưu các nguyên liệu của món ăn thứ i
                for (var j = 0; j < list_ingredient.length; j++) {
                    list_ingredient[j] = list_ingredient[j].toLowerCase();
                    list_ingredient[j] = list_ingredient[j].trim();

                    if (temp.includes(search) || list_ingredient[j].includes(search)) {            //tìm kiếm theo tên món hoặc nguyên liệu
                        recipesSearch.push(recipes[i]);
                        break;
                    }
                }
            }

            list = recipesSearch;
        }
        else {
            const { vungmien, loaimon, cachnau, thit, haisan, raucu, tinhbot, khac } = req.body;

            for (var i = 0; i < list.length; i++) {
                if ((list[i].tags.includes(vungmien) || vungmien === 'null') &&
                    (list[i].tags.includes(loaimon) || loaimon === 'null') &&
                    (list[i].tags.includes(cachnau) || cachnau === 'null') &&
                    ((thit === undefined) || (checkIngredient(list[i].nguyenlieu, checkObject(thit)))) &&
                    ((haisan === undefined) || (checkIngredient(list[i].nguyenlieu, checkObject(haisan)))) &&
                    ((raucu === undefined) || (checkIngredient(list[i].nguyenlieu, checkObject(raucu)))) &&
                    ((tinhbot === undefined) || (checkIngredient(list[i].nguyenlieu, checkObject(tinhbot)))) &&
                    ((khac === undefined) || (checkIngredient(list[i].nguyenlieu, checkObject(khac))))) {
                    recipesSearch.push(list[i]);
                }
            }
        }
        res.render('search', {
            authenticated: req.session.authenticated,
            user: req.session.user,
            favorRecipes,
            recipesSearch,
            search: keyword.toUpperCase(),
            keyword,
            total: recipesSearch.length,
            layout: 'option02_layouts',
            favorite_counts
        });
    } catch (error) {
        next(error);
    }
};

exports.getRecipes = async (req, res, next) => {
    try {

        const { favorRecipes } = await favorRecipesM.getAll();

        let { recipes } = await allRecipesM.getAll();
        let subRecipes = [];                                                       //mảng lưu những công thức mà người dùng nhập từ khóa tìm kiếm

        for (var i = 0; i < recipes.length; i++) {
            subRecipes.push(recipes[i]);
        }

        let { page } = req.query;
        let total = subRecipes.length;

        if (page) {
            subRecipes = subRecipes.slice((page - 1) * 10, (page - 1) * 10 + 10);
        } else {
            page = 1;
            subRecipes = subRecipes.slice(0, 10);
        }

        let favorite_counts = 0;
        if (req.session.authenticated) {
            const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);
            favorite_counts = favoriteRecipesDb.length;
        }

        res.render('recipes', {
            authenticated: req.session.authenticated,
            user: req.session.user,
            subRecipes,
            favorRecipes,
            total,
            page,
            helpers,
            favorite_counts,
            layout: 'option02_layouts'
        });
    } catch (error) {
        next(error);
    }
};

exports.getIngredientsRecipe = async (req, res, next) => {
    try {
        const carts = await cartsM.getAll();
        const list_name_carts = Object.keys(carts);

        const { favorRecipes } = await favorRecipesM.getAll();
        const { recipes } = await allRecipesM.getAll()

        let list_ingredient = [];
        for (var i = 0; i < recipes.length; i++) {
            if (recipes[i].tenmon === recipeName) {
                list_ingredient = recipes[i].nguyenlieu;
                break;
            }
        }

        for (var i = 0; i < list_ingredient.length; i++) {
            const temp = list_ingredient[i].split(":");
            list_ingredient[i] = temp[0];
        }

        const ingredients = [];
        for (var i = 0; i < list_ingredient.length; i++) {
            for (var j = 0; j < list_name_carts.length; j++) {
                if (list_ingredient[i] === list_name_carts[j]) {
                    ingredients.push({
                        name: list_name_carts[j].trim(),
                        detail: carts[list_name_carts[j]]
                    });
                    break;
                }
            }
        }

        let favorite_counts = 0;
        if (req.session.authenticated) {
            const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);
            favorite_counts = favoriteRecipesDb.length;
        }

        res.render('ingredients', {
            authenticated: req.session.authenticated,
            user: req.session.user,
            recipeName,
            ingredients,
            favorRecipes,
            favorite_counts,
            layout: 'option02_layouts'
        });
    }
    catch (error) {
        next(error);
    }
};

exports.getFavorite = async (req, res, next) => {
    try {
        if (req.session.authenticated) {
            const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);

            let favoriteRecipes = [];

            const { recipes } = await allRecipesM.getAll();

            for (var i = 0; i < favoriteRecipesDb.length; i++) {
                for (var j = 0; j < recipes.length; j++) {
                    if (favoriteRecipesDb[i].recipeName === recipes[j].tenmon) {
                        favoriteRecipes.push(recipes[j]);
                        break;
                    }
                }
            }
            res.render('favorite', {
                authenticated: req.session.authenticated,
                user: req.session.user,
                favoriteRecipes: favoriteRecipes.reverse(),
                favorite_counts: favoriteRecipesDb.length,
                showFavoriteSide: false,
                layout: 'option02_layouts'
            });
        }
    } catch (error) {
        next(error);
    }
}

exports.postFavorite = async (req, res, next) => {
    try {
        if (req.session.authenticated) {
            const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);

            const { tenmon } = req.body;

            for (var i = 0; i < favoriteRecipesDb.length; i++) {
                if (tenmon === favoriteRecipesDb[i].recipeName) {
                    const f = {
                        userID: req.session.user.id,
                        recipeName: tenmon
                    };
                    const fDel = await allRecipesM.deleteFavoriteRecipe(f);
                    return;
                }
            };

            const favoriteRecipes = await allRecipesM.getAllFavoriteRecipes();
            let id;
            if (!favoriteRecipes || !favoriteRecipes?.length) {
                id = 0;
            }
            else
                id = favoriteRecipes[favoriteRecipes.length - 1].id + 1;

            const f = {
                id,
                userID: req.session.user.id,
                tenmon
            };
            console.log(f);
            const fNew = await allRecipesM.addFavoriteRecipe(f);
        }

        // else render yêu cầu đăng nhập
    } catch (error) {
        next(error);
    }
}

exports.getPostRecipe = async (req, res, next) => {
    try {

        //kiem tra dang nhap
        if (!req.session.user) {
            return res.render('users/signin', {
                layout: 'option01_layouts'
            });
        }

        const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);

        const newRecipesDb = await allRecipesM.getNewRecipesByUserID(req.session.user.id);
        const { newRecipes } = await newRecipesM.getAll();

        let recipes = [];

        for (var i = 0; i < newRecipesDb.length; i++) {
            for (var j = 0; j < newRecipes.length; j++) {
                if (newRecipesDb[i].recipeName === newRecipes[j].tenmon) {
                    recipes.push(newRecipes[j]);
                    break;
                }
            }
        }

        res.render('post_recipe', {
            authenticated: req.session.authenticated,
            user: req.session.user,
            hideSide: true,
            recipes,
            favorite_counts: favoriteRecipesDb.length,
            layout: 'option02_layouts'
        });
    } catch (error) {
        next(error);
    }
};


exports.postPostRecipe = async (req, res, next) => {
    try {
        const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);

        let { recipes } = await allRecipesM.getAll();
        let { newRecipes } = await newRecipesM.getAll();

        const { ten, image, nguyenlieu, soche, thuchien, cachdung, machnho, tags } = req.body;

        const nguyen_lieu = nguyenlieu.split('. ');
        const so_che = soche.split('. ');
        const thuc_hien = thuchien.split('. ');
        const cach_dung = cachdung.split('. ');
        const mach_nho = machnho.split('. ');
        const Tags = tags.split('. ');

        const newRecipe = {
            tenmon: ten,
            image,
            nguyenlieu: nguyen_lieu,
            soche: so_che,
            thuchien: thuc_hien,
            cachdung: cach_dung,
            machnho: mach_nho,
            tags: Tags
        };

        recipes.push(newRecipe);
        newRecipes.push(newRecipe);

        let a = JSON.stringify({ recipes }, null, 2);
        fs.promises.writeFile("./db/recipes.json", a, "utf-8");

        let b = JSON.stringify({ newRecipes }, null, 2);
        fs.promises.writeFile("./db/newRecipes.json", b, "utf-8");

        const newRecipesDb = await allRecipesM.getNewRecipes();
        let id;
        if (!newRecipesDb || !newRecipesDb?.length) {
            id = 0;
        }
        else
            id = newRecipesDb[newRecipesDb.length - 1].id + 1;

        const r = {
            id,
            userID: req.session.user.id,
            recipeName: ten
        };
        const rNew = await allRecipesM.addNewRecipe(r);

        // this.getHome(req,res,next);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

exports.getEditRecipe = async (req, res, next) => {
    try {
        const favoriteRecipesDb = await allRecipesM.getAllFavoriteRecipesByUserID(req.session.user.id);

        const { newRecipes } = await newRecipesM.getAll();

        const { tenmon } = req.params;
        const recipe = newRecipes.find((r) => r.tenmon === tenmon);

        res.render('edit_recipe', {
            authenticated: req.session.authenticated,
            user: req.session.user,
            recipe,
            favorite_counts: favoriteRecipesDb.length,
            layout: 'option02_layouts'
        });
    } catch (error) {
        next(error);
    }
};

exports.postDeleteRecipe = async (req, res, next) => {
    try {
        const { tenmon } = req.params;

        let { recipes } = await allRecipesM.getAll();
        recipes.splice(recipes.indexOf(tenmon), 1);
        let newdata = JSON.stringify({ recipes }, null, 2);
        await allRecipesM.write(newdata);

        let { newRecipes } = await newRecipesM.getAll();
        newRecipes.splice(newRecipes.indexOf(tenmon), 1);
        newdata = JSON.stringify({ newRecipes }, null, 2);
        await newRecipesM.write(newdata);

        const rDel = await allRecipesM.deleteRecipe(tenmon, req.session.user.id);

        res.redirect('/postRecipe');
    } catch (error) {
        next(error);
    }
};