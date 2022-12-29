const model = require('../models/recipes.m');
const helpers = require('../helpers/helpers');

exports.getHome = async (req, res, next) => {
    const recipes = await model.getAll();
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

exports.getDetailRecipe = async (req, res, next) => {
    try {
        let { name } = req.params;
        name = name.toLowerCase();

        const recipes = await model.getAll();
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
exports.postSearch = async (req, res, next) => {
    try {
        let { search } = req.body;

        let recipes = await model.getAll();
        const list_name = Object.keys(recipes);                                         //mảng lưu tên món ăn
        let recipesSearch = [];                                                       //mảng lưu những công thức mà người dùng nhập từ khóa tìm kiếm

        if (search) {
            keyword = search;
            search = search.toLowerCase();

            for (var i = 0; i < list_name.length; i++) {
                let temp = list_name[i].replaceAll("-", " ");                               //bỏ ký tự '-' và viết thường tên món ăn thứ i
                temp = temp.toLowerCase();

                let list_ingredient = Object.values(recipes[list_name[i]].nguyenlieu);      //mảng lưu các nguyên liệu của món ăn thứ i
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
                    (list[i].detail.tags.includes(cachnau) || cachnau === 'null')) {
                    recipesSearch.push(list[i]);
                }
            }

            // for (var i = 0; i < list.length; i++) {
            //     if ((list[i].detail.tags.includes(vungmien) || vungmien === 'null') &&
            //         (list[i].detail.tags.includes(loaimon) || loaimon === 'null') &&
            //         (list[i].detail.tags.includes(cachnau) || cachnau === 'null') &&
            //         ((thit === undefined) || (checkIngredient(list[i].detail.nguyenlieu, thit))) &&
            //         ((haisan === undefined) || (checkIngredient(list[i].detail.nguyenlieu, haisan))) &&
            //         ((raucu === undefined) || (checkIngredient(list[i].detail.nguyenlieu, raucu))) &&
            //         ((tinhbot === undefined) || (checkIngredient(list[i].detail.nguyenlieu, tinhbot))) &&
            //         ((khac === undefined) || (checkIngredient(list[i].detail.nguyenlieu, khac)))) {
            //             recipesSearch.push(list[i]);
            //     }
            // }
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
        let data = await model.getAll();
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
        res.render('ingredients', {
            layout: 'ingredients_layout'
        });
    }
    catch (error) {
        next(error);
    }
}