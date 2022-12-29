const model = require('../models/recipes.m');
const helpers = require('../helpers/helpers');

exports.getHome = async (req, res, next) => {

    const recipes = await model.getAll();
    const list_name = Object.keys(recipes);
    const detail_recipe = [];

    for (var i = 0; i < list_name.length; i++) {
        let name = list_name[i].replaceAll("-", " ");
        name = name.toLowerCase();
        
        detail_recipe.push({
            tenmon: name,
            chitiet: recipes[list_name[i]]
        });
    }
    res.render('home', {
        detail_recipe
    });
};

exports.getDetailRecipe = async (req, res, next) => {
    try {
        const { tenmon } = req.params;

        const recipes = await model.getAll();
        const list_name = Object.keys(recipes);
        const detail_recipe = [];

        for (var i = 0; i < list_name.length; i++) {
            let name = list_name[i].replaceAll("-", " ");
            name = name.toLowerCase();
            if (name === tenmon) {
                detail_recipe.push({
                    tenmon: name,
                    chitiet: recipes[list_name[i]]
                });

                res.render('detail_recipe', {
                    detail_recipe
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

exports.postSearch = async (req, res, next) => {
    try {
        let { search } = req.body;
        search = search.toLowerCase();

        let recipes = await model.getAll();

        const list_name = Object.keys(recipes);                                         //mảng lưu tên món ăn
        let recipesSearch = [];                                                       //mảng lưu những công thức mà người dùng nhập từ khóa tìm kiếm

        for (var i = 0; i < list_name.length; i++) {
            let name = list_name[i].replaceAll("-", " ");                               //bỏ ký tự '-' và viết thường tên món ăn thứ i
            name = name.toLowerCase();

            let list_ingredient = Object.values(recipes[list_name[i]].nguyenlieu);      //mảng lưu các nguyên liệu của món ăn thứ i
            for (var j = 0; j < list_ingredient.length; j++) {
                list_ingredient[j] = list_ingredient[j].toLowerCase();
                list_ingredient[j] = list_ingredient[j].trim();

                if (name.includes(search) || list_ingredient[j].includes(search)) {            //tìm kiếm theo tên món hoặc nguyên liệu
                    recipesSearch.push({
                        tenmon: name,
                        chitiet: recipes[list_name[i]]
                    });
                    break;
                }
            }
        }
        res.render('search', {
            recipesSearch,
            search: search.toUpperCase(),
            total: recipesSearch.length
        });
    } catch (error) {
        next(error);
    }

    // const list = search.split(" ");
    // var regex = new RegExp(list.join("|"),"gi");
    // console.log(regex);

    // for (const [key, value] of Object.entries(recipes[list_name[0]])) {
    //     console.log(`${key}: ${value}`);
    // }

    // Lấy theo nguyên liệu:
    // let s = (Object.values(recipes[list_name[0]].nguyenlieu)).includes(search);

    // Lấy giá trị tất cả các trường:
    // console.log(Object.values(recipes[list_name[0]]));
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