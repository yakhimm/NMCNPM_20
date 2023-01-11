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

// ---------------------------------------------
router.get('/',  controller.getHome);

router.get('/home', controller.getHome);

router.get('/recipes', controller.getRecipes);

router.get('/favorite', controller.getFavorite);
router.post('/favorite', controller.postFavorite);

router.get('/:name', controller.getDetailRecipe);

router.post('/', controller.postSearch);

router.get('/ingredients/:name', controller.getIngredientsRecipe);

module.exports = router;