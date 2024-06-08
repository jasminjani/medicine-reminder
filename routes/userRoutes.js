const passport = require("passport");
const { getDashboard, emailMarkAsDone, getOneTimePage, addMedicines, recurringPage } = require("../controllers/userController");
const router = require('express').Router();

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
);

// ===== USER CONTROLLER =====

router.route('/dashboard').get(getDashboard);

router.route('/one-time').get(getOneTimePage);
router.route('/recurring').get(recurringPage);
router.route('/add-medicine').post(addMedicines);


router.route('/mark-done/:id').get(emailMarkAsDone);


module.exports = router;