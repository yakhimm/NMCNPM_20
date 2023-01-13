const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipes.c');
const userC = require('../controllers/users.c');

// --------------sign in/ sign up---------------
router.get('/signin', userC.getSignin);
router.post('/signin', userC.postSignin);

router.get('/signup', userC.getSignup);
router.post('/signup', userC.postSignup);

router.get('/logout', userC.getLogout);

router.get('/account/:id', userC.getAccount);
router.post('/account/:id', userC.postAccount);

router.get('/setting/:id', userC.getSetting);
router.post('/setting/:id', userC.postSetting);

// ---------------------------------------------
router.get('/',  controller.getHome);

router.get('/home', controller.getHome);

router.get('/recipes', controller.getRecipes);

router.get('/favorite', controller.getFavorite);
router.post('/favorite', controller.postFavorite);

// router.get('/cart', controller.getCart);
// router.post('/cart', controller.postCart);

router.get('/postRecipe', controller.getPostRecipe);
router.post('/postRecipe', controller.postPostRecipe);

router.get('/editRecipe/:tenmon', controller.getEditRecipe);
router.post('/deleteRecipe/:tenmon', controller.postDeleteRecipe);

router.get('/:tenmon', controller.getDetailRecipe);

router.post('/', controller.postSearch);

router.get('/ingredients/:tenmon', controller.getIngredientsRecipe);

module.exports = router;