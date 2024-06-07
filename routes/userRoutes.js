const passport = require("passport");
const { getDashboard, addOneMedicine, recurringDailyPage, addRecurringDaily, recurringWeeklyPage, addRecurringWeekly, emailMarkAsDone, getOneTimePage, addMedicines } = require("../controllers/userController");
const router = require('express').Router();

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
);

// ===== USER CONTROLLER =====

router.route('/dashboard').get(getDashboard);

router.route('/one-time').get(getOneTimePage);
router.route('/recurring-weekly').get(recurringWeeklyPage);
router.route('/recurring-daily').get(recurringDailyPage);
router.route('/add-medicine').post(addMedicines);




router.route('/mark-done/:id').get(emailMarkAsDone);


module.exports = router;