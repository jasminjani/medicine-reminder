const transporter = require("../utils/nodemailer");
const db = require("../models");
// const randomize = require('randomatic');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.getRegistrationPage = (req, res) => {
  try {

    res.status(200).render('registration');

  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


exports.getLoginPage = (req, res) => {
  try {

    res.status(200).render('login');

  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


exports.getPasswordPage = async (req, res) => {
  try {

    const { activation } = req.params;

    const linkExpire = await db.users.findAll({ where: { activation_code: activation } });

    let diff = new Date(Date.now()) - new Date(linkExpire[0].updatedAt);
    let mins = Math.floor((diff % 86400000) / 60000);

    if (mins > 30) {
      return res.status(200).send(`<h2>Verification link has been expired!</h2><a href="/newActivationMail/${activation}">click here to again get mail</a>`);
    }

    res.status(200).render('password')

  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


exports.newActivationMail = async (req, res) => {
  try {

    // old activation link
    const { activation } = req.params;

    // A string containing a randomly generated, 36 character long v4 UUID.
    const new_activation_code = crypto.randomUUID();

    const userData = await db.users.findAll({ where: { activation_code: activation } });
    const email = userData[0].email;

    const mailOptions = {
      from: process.env.your_email,
      to: email,
      subject: 'sending new link for creating password',
      html: `<h2>New link for account activation.</h2><p> click belowe link for creating password and activate your account</p>. <h3><a href='http://localhost:${process.env.port}/password/${new_activation_code}'>http://localhost:${process.env.port}/password/${new_activation_code}</a></h3> <p>HAVE A GOOD DAY :)</p>`
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("email sent : ", info.response);
      }
    });

    const updateUserActivation = await db.users.update({ activation_code: new_activation_code }, { where: { email: email } });

    res.status(200).send("mail sent successfully");

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
}


exports.addUser = async (req, res) => {
  try {

    const { first_name, last_name, email, blood_group, phone_no, dob } = req.body;

    if (!first_name || !last_name || !email || !phone_no || !dob) {
      res.status(500).json({
        success: false,
        message: "data missing in user creation"
      })
    }

    // check that current user is already exist or not
    const checkSameUser = await db.users.findAll({ where: { email: email } });

    // if user already exists
    if (checkSameUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }


    // if user not alredy exist

    // A string containing a randomly generated, 36 character long v4 UUID.
    const activation_code = crypto.randomUUID();


    const newUser = await db.users.create({ first_name, last_name, email, blood_group, phone_no, dob, activation_code })

    const mailOptions = {
      from: process.env.your_email,
      to: email,
      subject: 'sending link for creating password',
      html: `<h2>congratulations, you have succesefully registered on remindMe platform.</h2><p> click belowe link for creating password and activate your account</p>. <h3><a href='http://localhost:${process.env.port}/password/${activation_code}'>http://localhost:${process.env.port}/password/${activation_code}</a></h3> <p>HAVE A GOOD DAY :)</p>`
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("email sent : ", info.response);
      }
    });

    res.status(200).json({ newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.addPassword = async (req, res) => {
  try {

    const { password } = req.body;
    const { activation } = req.params;

    if (!password) {
      res.status(500).json({
        success: false,
        message: "password not found"
      })
    }

    if (!activation) {
      res.status(500).json({
        success: false,
        message: "activation code not found"
      })
    }

    let hashPassword;
    try {

      let bcryptsalt = await bcrypt.genSaltSync(10);
      hashPassword = await bcrypt.hash(password, bcryptsalt);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const updateUser = await db.users.update({ password: hashPassword, status: 1 }, { where: { activation_code: activation } });

    res.status(200).json({ updateUser })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.login = async (req, res) => {
  try {
    // get data
    let { email, password } = req.body;

    // validate data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // execute the query to find user in DB by email
    let result;
    try {
      result = await db.users.findAll({ where: { email: email, status: 1 } });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // user not found then return res
    if (result.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    // user found the verify DB password with entered password
    let hashPassword = result[0].password;
    if (await bcrypt.compare(password, hashPassword)) {
      // both are same

      //if db password and user's password matched then put the entry in login_attempts as accept

      try {

        await db.login_attemps.create({ u_id: result[0].id, status: true });

      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          message: "Internal Server Error",
        });
      }


      // generate token for the cookie
      let payload = {
        id: result[0].id,
        email: result[0].email,
      };

      // remove password from the user obj
      let { password: _, createdAt, deletedAt, updatedAt, status, activation_code, ...newObj } = result[0];
      // generate token
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // set token into userObj
      newObj.token = token;


      // if db password and user's password matched then put the entry in user sessiond with jwt token
      try {

        await db.user_sessions.create({ u_id: result[0].id, jwt_token: token, ip_address: req.ip });

      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          message: "Internal Server Error",
        });
      }



      return res
        .cookie("token", token, {
          maxAge: 4 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .json({
          success: true,
          user: newObj,
        });
    } else {
      //if db password and user's password not matched then put the entry in login_attempts as fail
      try {

        await db.login_attemps.create({ u_id: result[0].id, status: false });

      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          message: "Internal Server Error",
        });
      }

      //return res for the not match the password with stored password
      return res.json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.logout = async (req, res) => {
  try {
    return res.clearCookie("token").json({
      success: true,
      message: "user Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.logoutAllDevices = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: user not found',
      });
    }

    res.clearCookie("token");
    await db.user_sessions.destroy({ where: { u_id: req.user.id } });

    return res.status(200).json({
      success: true,
      message: "All user Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



exports.logoutAllOtherDevices = async (req, res) => {
  try {

    if (!req.user || !req.token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: user or token not found',
      });
    }

    await db.user_sessions.destroy({ where: { [Op.and]: [{ u_id: req.user.id }, { jwt_token: { [Op.ne]: req.token } }] } });
    console.log("log out from all other devices");

    return res.status(200).json({
      success: true,
      message: "All other user Logged out successfully",
    });
  } catch (error) {
    console.error('Error logging out from other devices: ',error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.getCurrentUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
     console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};  
