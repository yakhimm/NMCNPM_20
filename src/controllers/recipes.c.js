const allRecipesM = require('../models/recipes.m');
const carousRecipesM = require('../models/carouselRecipes.m');
const dailyRecipesM = require('../models/dailyRecipes.m');
const rcmRecipesM = require('../models/rcmRecipes.m');
const newRecipesM = require('../models/newRecipes.m');
const favorRecipesM = require('../models/favoriteRecipes.m');
const cartsM = require('../models/carts.m');

const helpers = require('../helpers/helpers');

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

exports.getCarouselRecipes = async (req, res, next, model) => {
    const allRecipes = await model.getAll();
    const list_name = Object.keys(allRecipes);
    let detail_recipe = [];
    let carouselRecipes = [];

    for (var i = 0, j = 0; i < list_name.length; i++) {
        let name = list_name[i].replaceAll("-", " ");

        detail_recipe.push({
            name,
            detail: allRecipes[list_name[i]]
        });

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
}

exports.getHome = async (req, res, next) => {
    let newRecipes = await this.getAllRecipes(req, res, next, newRecipesM)
    let favorRecipes = await this.getAllRecipes(req, res, next, favorRecipesM);

    // get data for carousels
    let dailyRecipes = await this.getCarouselRecipes(req, res, next, dailyRecipesM);
    let rcmRecipes = await this.getCarouselRecipes(req, res, next, rcmRecipesM);
    let carousRecipes = await this.getCarouselRecipes(req, res, next, carousRecipesM);


    let { page } = req.query;
    let total = newRecipes.length;

    if (page) {
        newRecipes = newRecipes.slice((page - 1) * 10, (page - 1) * 10 + 10);
    } else {
        page = 1;
        newRecipes = newRecipes.slice(0, 10);
    }
    
    res.render('home', {
        newRecipes,
        dailyRecipes,
        rcmRecipes,
        favorRecipes,
        carousRecipes,
        total,
        page,
        helpers,
    });
};

let recipeName = '';
exports.getDetailRecipe = async (req, res, next) => {
    try {
        let { name } = req.params;
        console.log(req.params);
        name = name.toLowerCase();

        const favorRecipes = await this.getAllRecipes(req, res, next, favorRecipesM);
        const recipes = await allRecipesM.getAll();
        const list_name = Object.keys(recipes);
        const detail_recipe = [];

        for (var i = 0; i < list_name.length; i++) {
            let temp = list_name[i].replaceAll("-", " ");
            temp = temp.toLowerCase();

            if (temp === name) {

                recipeName = list_name[i].replaceAll("-", " ");   // luu ten mon dung cho trang ingredients
                detail_recipe.push({
                    name: recipeName,
                    detail: recipes[list_name[i]]
                });

                return res.render('detail_recipe', {
                    detail_recipe,
                    favorRecipes,
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
    for (var i = 0; i < listIngredient.length; i++) {
        listIngredient[i] = listIngredient[i].toLowerCase();
        listIngredient[i] = listIngredient[i].trim();

        for (var j = 0; j < type.length; j++) {
            if (listIngredient[i].includes(type[j])) {
                return true;
            }
        }
    }

    return false;
};

function checkObject(type){
    if(typeof(type) === "string"){
        return [type];
    };
    return type;
};

exports.postSearch = async (req, res, next) => {
    try {
        let { search } = req.body;

        const favorRecipes = await this.getAllRecipes(req, res, next, favorRecipesM);
        let recipes = await allRecipesM.getAll();
        const list_name = Object.keys(recipes);                                         //mảng lưu tên món ăn
        let recipesSearch = [];                                                       //mảng lưu những công thức mà người dùng nhập từ khóa tìm kiếm

        if (search) {
            keyword = search;
            search = search.toLowerCase();

            for (var i = 0; i < list_name.length; i++) {
                let temp = list_name[i].replaceAll("-", " ");                               //bỏ ký tự '-' và viết thường tên món ăn thứ i
                temp = temp.toLowerCase();

                let [list_ingredient] = Object.values(recipes[list_name[i]].nguyenlieu);      //mảng lưu các nguyên liệu của món ăn thứ i
                for (var j = 0; j < list_ingredient.length; j++) {
                    list_ingredient[j] = list_ingredient[j].toLowerCase();
                    list_ingredient[j] = list_ingredient[j].trim();

                    if (temp.includes(search) || list_ingredient[j].includes(search)) {            //tìm kiếm theo tên món hoặc nguyên liệu
                        recipesSearch.push({
                            name: list_name[i].replaceAll("-", " "),
                            detail: recipes[list_name[i]]
                        });
                        break;
                    }
                }
            }

            list = recipesSearch;
        }
        else {
            const { vungmien, loaimon, cachnau, thit, haisan, raucu, tinhbot, khac } = req.body;  

            for (var i = 0; i < list.length; i++) {
                if ((list[i].detail.tags.includes(vungmien) || vungmien === 'null') &&
                    (list[i].detail.tags.includes(loaimon) || loaimon === 'null') &&
                    (list[i].detail.tags.includes(cachnau) || cachnau === 'null') &&
                    ((thit === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(thit)))) &&
                    ((haisan === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(haisan)))) &&
                    ((raucu === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(raucu)))) &&
                    ((tinhbot === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(tinhbot)))) &&
                    ((khac === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(khac))))) {
                        recipesSearch.push(list[i]);
                }
            }
        }

        res.render('search', {
            favorRecipes,
            recipesSearch,
            search: keyword.toUpperCase(),
            keyword,
            total: recipesSearch.length,
            layout: 'option02_layouts'
        });
    } catch (error) {
        next(error);
    }
};

exports.getRecipes = async (req, res, next) => {
    try {
        const favorRecipes = await this.getAllRecipes(req, res, next, favorRecipesM);
        let data = await allRecipesM.getAll();
        const list_name = Object.keys(data);                                         //mảng lưu tên món ăn
        let recipes = [];                                                       //mảng lưu những công thức mà người dùng nhập từ khóa tìm kiếm

        for (var i = 0; i < list_name.length; i++) {
            let name = list_name[i].replaceAll("-", " ");                               //bỏ ký tự '-' và viết thường tên món ăn thứ i

            recipes.push({
                name,
                detail: data[list_name[i]]
            });
        }

        let { page } = req.query;
        let total = recipes.length;

        if (page) {
            recipes = recipes.slice((page - 1) * 10, (page - 1) * 10 + 10);
        } else {
            page = 1;
            recipes = recipes.slice(0, 10);
        }

        res.render('recipes', {
            recipes,
            favorRecipes,
            total,
            page,
            helpers,
            layout: 'option02_layouts'
        });
    } catch (error) {
        next(error);
    }
};

exports.getIngredientsRecipe = async (req, res, next) => {
    try {
        const carts = await cartsM.getAll();
        const favorRecipes = await this.getAllRecipes(req, res, next, favorRecipesM);
        const recipes = await allRecipesM.getAll();
        const list_name_recipes = Object.keys(recipes);
        const list_name_carts = Object.keys(carts);

        let list_ingredient = [];
        for(var i = 0; i < list_name_recipes.length; i++){
            if(list_name_recipes[i].replaceAll("-", " ") === recipeName){
                list_ingredient = Object.values(recipes[list_name_recipes[i]].nguyenlieu);
                break;
            }
        }

        for(var i = 0; i < list_ingredient.length; i++){
            const temp = list_ingredient[i].split(":");
            list_ingredient[i] = temp[0];
        }

        const ingredients = [];
        for(var i = 0; i < list_ingredient.length; i++){
            for(var j = 0; j < list_name_carts.length; j++){
                if(list_ingredient[i] === list_name_carts[j]){
                    ingredients.push({
                        name: list_name_carts[j].trim(),
                        detail: carts[list_name_carts[j]]
                    });
                    break;
                }
            }
        }

        res.render('ingredients', {
            recipeName,
            ingredients,
            favorRecipes,
            layout: 'option02_layouts'
        });
    }
    catch (error) {
        next(error);
    }
}