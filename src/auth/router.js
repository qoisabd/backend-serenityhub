const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const controller = require('./controller');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, controller.localStrategy),
);

router.post('/register', multer().none(), controller.register);
router.post('/login', multer().none(), controller.login);
router.get('/me', controller.me);
router.post('/logout', controller.logout);
router.put('/changepassword', multer().none(), controller.changeUserPassword);

// admin
router.post('/officer/register', multer().none(), controller.officerRegister);

router.post('/admin/register', multer().none(), controller.adminRegister);

module.exports = router;
