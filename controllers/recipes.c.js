const recipesM = require('../models/recipes.m');
const newRecipesM = require('../models/new_recipes.m');
const favRecipesM = require('../models/favorite_recipes.m');
const dailyRecipesM = require('../models/daily_recipes.m');
const rcmRecipesM = require('../models/recommended_recipes.m');
const mCarRecipesM = require('../models/main_carousel_recipes.m');
const helpers = require('../helpers/helpers');

exports.getAllRecipes = async (req, res, next, model) => {
    const new_recipes = await model.getAll();
    const list_name = Object.keys(new_recipes);
    const detail_recipe = [];

    for (var i = 0; i < list_name.length; i++) {
        let name = list_name[i].replaceAll("-", " ");
        name = name.toLowerCase();

        detail_recipe.push({
            tenmon: name,
            chitiet: new_recipes[list_name[i]]
        });
    }

    return detail_recipe;
}

exports.getCarouselData = async (req, res, next, model) => {
    
    const carousel_data = [];
    var detail_recipe = [];

    const all_recipes = await model.getAll();
    const list_name = Object.keys(all_recipes);

    var j = 0;
    for (var i = 0; i < list_name.length; i++) {
        let name = list_name[i].replaceAll("-", " ");
        name = name.toLowerCase();
        
        detail_recipe.push({
            tenmon: name,
            chitiet: all_recipes[list_name[i]]
        });

        j++;
        if (j == 3) {
            j = 0;
            carousel_data.push({
                slide: detail_recipe
            });
            detail_recipe = [];
    }
    }
    return carousel_data;
}


// ------------exports----------------------
exports.getHome = async (req, res, next) => {

    // get recipes for new recipes
    const new_recipes = await this.getAllRecipes(req, res, next, newRecipesM);
    const favorite_recipes = await this.getAllRecipes(req, res, next, favRecipesM);
    
    // get recipes for carousel 
    const daily_recipes = await this.getCarouselData(req, res, next, dailyRecipesM);
    const rcm_recipes = await this.getCarouselData(req, res, next, rcmRecipesM );
    const main_carousel_recipes = await this.getCarouselData(req, res, next, mCarRecipesM);

    res.render('home', {
        new_recipes, 
        favorite_recipes,
        daily_recipes,
        rcm_recipes,
        main_carousel_recipes,
    });
};

exports.getDetailRecipe = async (req, res, next) => {
    try {
          // get recipes for new recipes
        const favorite_recipes = await this.getAllRecipes(req, res, next, favRecipesM);
    

        const { tenmon } = req.params;

        const recipes = await recipesM.getAll();
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
                    favorite_recipes,
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

        // get recipes for new recipes
        const favorite_recipes = await this.getAllRecipes(req, res, next, favRecipesM);

        // get recipes for carousel 
        // const daily_recipes = await this.getCarouselData(req, res, next, dailyRecipesM);
        // const rcm_recipes = await this.getCarouselData(req, res, next, rcmRecipesM );
        // const main_carousel_recipes = await this.getCarouselData(req, res, next, mCarRecipesM);


        let { search } = req.body;
        search = search.toLowerCase();

        let recipes = await recipesM.getAll();

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
            favorite_recipes,
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