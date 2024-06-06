const { addUser, getRegistrationPage, getLoginPage, getPasswordPage, addPassword, newActivationMail, login, logout, getCurrentUser, logoutAllDevices, logoutAllOtherDevices } = require('../controllers/authController');
const passport = require("passport");
const router = require('express').Router();


// registration page add user
router.route('/registration').get(getRegistrationPage);
router.route('/add-user').post(addUser);

// login page render and check password
router.route('/login').get(getLoginPage);
router.route('/login').post(login);

router.route('/password/:activation').get(getPasswordPage);
router.route('/add-password/:activation').post(addPassword);

// for get new activation mail after old one expires
router.route('/newActivationMail/:activation').get(newActivationMail);


// router.route("/current-user").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), getCurrentUser);

router.route("/logout").post(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), logout);

router.route('/logout-all').post(passport.authenticate("jwt", { session: false, failureRedirect: '/login' }), logoutAllDevices);

router.route('/logout-all-other').post(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), logoutAllOtherDevices)


module.exports = router;