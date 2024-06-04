const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const router = require('./routes/authRoutes');
require('dotenv').config();
const port = process.env.port || 3000;


// passport configuration
const passport = require("passport");
const { passportConfig } = require("./middlewares/authMiddleware");
passportConfig(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(router);

app.listen(port, (err) => {
  if (!err) {
    console.log(`server is running on http://localhost:${port}`);
  }
  else {
    console.log(`server connection failed`);
  }
}

)