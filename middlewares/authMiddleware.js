const db = require("../models");
const jwtStrategy = require("passport-jwt").Strategy;
require("dotenv").config();

// getToken function for passport
const getToken = (req) => {
  return (
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    null
  );
};

// opts for passport-jwt
let opts = {
  jwtFromRequest: getToken,
  secretOrKey: process.env.JWT_SECRET,
};

// passport-jwt configuration logic
exports.passportConfig = (passport) => {
  passport.use(
    new jwtStrategy(opts, async (payload, next) => {
      let result;
      let id = payload.id;
      try {
        [result] = await db.users.findAll({ where: { id: id } });
      } catch (error) {
        // if any error during query execution
        logger.error(error)
        return next(error, false);
      }

      // if user present then call next with payload
      if (result.length > 0) {
        return next(null, result[0]);
      } else {
        // if user not present then call next with empty data
        return next(null, false);
      }
    })
  );
};
