const express = require('express');
const router = express.Router();
const userC = require('../controllers/users.c');

// router.get('/', (req, res, next) => {
//     res.render('home');
// });

// router.get('/add', userC.add);
// router.get('/admin', userC.admin);

router.get('/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/signin', userC.postSignin);

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', userC.postSignup);

module.exports = router;