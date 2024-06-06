const passport = require("passport");
const { getDashboard, addOneMedicine, recurringDailyPage, addRecurringDaily, cronejob, recurringWeeklyPage, addRecurringWeekly, emailMarkAsDone, getOneTimePage } = require("../controllers/userController");
const router = require('express').Router();

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
);

// ===== USER CONTROLLER =====

router.route('/dashboard').get(getDashboard);

router.route('/one-time').get(getOneTimePage);
router.route('/add-one-medicine').post(addOneMedicine);

router.route('/recurring-daily').get(recurringDailyPage);
router.route('/add-recurring-daily').post(addRecurringDaily);

router.route('/recurring-weekly').get(recurringWeeklyPage);
router.route('/add-recurring-weekly').post(addRecurringWeekly);


router.route('/mark-done/:id').get(emailMarkAsDone);

router.route('/cronjob').get(cronejob)

module.exports = router;