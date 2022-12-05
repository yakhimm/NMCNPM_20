const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.c');

router.get('/', controller.getHome);

router.get('/:tenmon', controller.getDetailRecipe);

router.post('/', controller.postSearch);

// router.get('/', controller.getSearch);

module.exports = router;