const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipes.c');
const userC = require('../controllers/users.c');

// --------------sign in/ sign up---------------
router.get('/signin', userC.getSignin);
router.post('/signin', userC.postSignin);

router.get('/signup', userC.getSignup);
router.post('/signup', userC.postSignup);

router.get('/', controller.getHome);

router.get('/recipes', controller.getRecipes);

router.get('/:tenmon', controller.getDetailRecipe);

router.post('/', controller.postSearch);

router.get('/ingredients/:tenmon', controller.getIngredientsRecipe);

module.exports = router;