const { addUser, getRegistrationPage, getLoginPage, getPasswordPage, addPassword, newActivationMail, login, logout, getCurrentUser } = require('../controllers/authController');
const passport = require("passport");
const { getDashboard, addOneMedicine, cronjobOneMedicine } = require('../controllers/userController');
const router = require('express').Router();

// router.use(
//   passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
// );

// registration page add user
router.route('/registration').get(getRegistrationPage);
router.route('/add-user').post(addUser);

// login page render and check password
router.route('/login').get(getLoginPage);
router.route('/login').post(login);

router.route('/password/:activation').get(getPasswordPage);
router.route('/add-password/:activation').post(addPassword);

// for get new activation mail after old one expires
router.route('/newActivationMail/:activation').post(newActivationMail);


// router.route("/current-user").get(getCurrentUser);

router.route("/logout").post(logout);




// ===== USER CONTROLLER =====

router.route('/dashboard').get(getDashboard);
router.route('/add-one-medicine').post(addOneMedicine);


router.route('/cronjob').get(cronjobOneMedicine);



router.use("*", (req, res) => {
  return res.send('page not found')
});


module.exports = router;