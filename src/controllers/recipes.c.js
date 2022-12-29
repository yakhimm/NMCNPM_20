const recipesM = require('../models/recipes.m');
// const cartsM = require('../models/carts.m');
const helpers = require('../helpers/helpers');

exports.getHome = async (req, res, next) => {
    const recipes = await recipesM.getAll();
    const list_name = Object.keys(recipes);
    let detail_recipe = [];

    for (var i = 0; i < list_name.length; i++) {
        let name = list_name[i].replaceAll("-", " ");

        detail_recipe.push({
            name,
            detail: recipes[list_name[i]]
        });
    }

    let { page } = req.query;
    let total = detail_recipe.length;

    if (page) {
        detail_recipe = detail_recipe.slice((page - 1) * 10, (page - 1) * 10 + 10);
    } else {
        page = 1;
        detail_recipe = detail_recipe.slice(0, 10);
    }

    res.render('home', {
        detail_recipe,
        total,
        page,
        helpers,
    });
};

let recipeName = '';
exports.getDetailRecipe = async (req, res, next) => {
    try {
        let { name } = req.params;
        recipeName = name;
        name = name.toLowerCase();

        const recipes = await recipesM.getAll();
        const list_name = Object.keys(recipes);
        const detail_recipe = [];

        for (var i = 0; i < list_name.length; i++) {
            let temp = list_name[i].replaceAll("-", " ");
            temp = temp.toLowerCase();

            if (temp === name) {
                detail_recipe.push({
                    name: list_name[i].replaceAll("-", " "),
                    detail: recipes[list_name[i]]
                });

                return res.render('detail_recipe', {
                    detail_recipe
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
    for (var i = 0; i < type.length; i++) {
        for (var j = 0; j < listIngredient.length; j++) {
            listIngredient[j] = listIngredient[j].toLowerCase();
            listIngredient[j] = listIngredient[j].trim();
            
            if (listIngredient[j].includes(type[i])) {
                n++;
                break;
            }
        }
    }

    if(n === type.length){
        return true;
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

        let recipes = await recipesM.getAll();
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
            let { vungmien, loaimon, cachnau, thit, haisan, raucu, tinhbot, khac } = req.body;
            
            for (var i = 0; i < list.length; i++) {
                if ((list[i].detail.tags.includes(vungmien) || vungmien === 'null') &&
                    (list[i].detail.tags.includes(loaimon) || loaimon === 'null') &&
                    (list[i].detail.tags.includes(cachnau) || cachnau === 'null') &&
                    ((thit === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(thit)) === true)) &&
                    ((haisan === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(haisan)) === true)) &&
                    ((raucu === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(raucu)) === true)) &&
                    ((tinhbot === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(tinhbot)) === true)) &&
                    ((khac === undefined) || (checkIngredient(list[i].detail.nguyenlieu, checkObject(khac)) === true))) {
                        recipesSearch.push(list[i]);
                }
            }
        }

        res.render('search', {
            recipesSearch,
            search: keyword.toUpperCase(),
            keyword,
            total: recipesSearch.length
        });
    } catch (error) {
        next(error);
    }
};

exports.getRecipes = async (req, res, next) => {
    try {
        let data = await recipesM.getAll();
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
            total,
            page,
            helpers,
        });
    } catch (error) {
        next(error);
    }
};

exports.getIngredientsRecipe = async (req, res, next) => {
    try {
        const carts = await cartsM.getAll();
        const recipes = await recipesM.getAll();
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
            layout: 'ingredients_layout'
        });
    }
    catch (error) {
        next(error);
    }
}