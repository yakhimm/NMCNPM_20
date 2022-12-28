const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.c');

router.get('/', controller.getHome);

router.get('/recipes', controller.getRecipes);

router.get('/about_us', controller.getAboutUs);

router.post('/search', controller.postSearch_Options);

router.get('/:tenmon', controller.getDetailRecipe);

router.post('/', controller.postSearch);

module.exports = router;