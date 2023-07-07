const express = require('express');
const router = express.Router();
const passport = require('../middleware/passport')
const { register, login, getCredentials} = require('../controllers/auth')


router.post('/register', register);

router.post('/login', login);

router.get('/getUserWithToken', passport.authenticate('jwt', { session: false }), getCredentials);

module.exports = router;

