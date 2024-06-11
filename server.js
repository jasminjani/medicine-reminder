const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const port = process.env.port || 3000;
require('./utils/node-crone');
require('./utils/report');
// require('./utils/cloudinary')
// require('./utils/bullmq');


// passport configuration
const passport = require("passport");
const { passportConfig } = require("./middlewares/authMiddleware");
passportConfig(passport);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));

app.use(router);


app.listen(port, (err) => {
  if (!err) {
    console.log(`server is running on http://localhost:${port}`);
  }
  else {
    console.log(`server connection failed`);
  }
});