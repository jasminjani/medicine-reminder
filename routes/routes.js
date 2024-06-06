const router = require('express').Router();
const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')

router.use('/', authRoutes);
router.use('/', userRoutes);

router.use("*", (req, res) => {
  return res.send('page not found')
});

module.exports = router;