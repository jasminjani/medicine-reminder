const passport = require("passport");
const { getDashboard, emailMarkAsDone, getOneTimePage, addMedicines, recurringPage, dashboardData, getHistoryPage, getHistoryData, getParticularMedicineHistoryData, deleteMedicine } = require("../controllers/userController");
const router = require('express').Router();

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
);

// ===== USER CONTROLLER =====

router.route('/dashboard').get(getDashboard);
router.route('/dashboard-data').get(dashboardData);

router.route('/one-time').get(getOneTimePage);
router.route('/recurring').get(recurringPage);
router.route('/add-medicine').post(addMedicines);


router.route('/mark-done/:id').get(emailMarkAsDone);


router.route('/history').get(getHistoryPage);
router.route('/get-history-data').get(getHistoryData);
router.route('/particular-history').post(getParticularMedicineHistoryData);
router.route('/delete-medicine').post(deleteMedicine);


module.exports = router;