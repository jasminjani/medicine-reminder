const cron = require('node-cron');
const db = require('../models');
const { Op } = require("sequelize");
const transporter = require("../utils/nodemailer");
require('dotenv').config();


// Schedule the cron job to run every minute
// ===== FOR ONE TIME ONLY MEDICINES =====
cron.schedule('* * * * *', async () => {
  try {

    const allMedicines = await db.medicines.findAll({ where: { [Op.and]: [{ start_date: { [Op.lte]: new Date() } }, { end_date: { [Op.gte]: new Date() } }, { type: 0 }] } });

    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();

    // used ternary operator for check if hour or minute is 1(one digit) then it will become 01(add 0 ahead for make two digit) and if those are 12(two digit) then it will remain 12(two digit).
    let currTime = (hour.toString().length > 1 ? hour : '0' + hour) + ':' + (minute.toString().length > 1 ? minute : '0' + minute) + ':00';

    allMedicines.forEach(async (element) => {
      if (element.time == currTime) {
        // console.log("time matched");

        const user = await db.users.findOne({ where: { id: element.u_id }, attributes: ['email', 'first_name'], raw: true });

        const medicineLog = await db.medicine_logs.create({ medicine_id: element.id, log_date: new Date(), log_time: currTime });

        const mailOptions = {
          from: process.env.your_email,
          to: user.email,
          subject: "Reminder for medicine",
          html: `<h2>Hey ${user.first_name}, Reminder for taking your medicine.</h2><p>it's time to take your <strong>${element.name}</strong> medicine <strong>${element.medication_timing}</strong>. because it's <strong>${element.time}</strong>.</p><p>Without forgottting take your medicine.</p><a href='http://localhost:${process.env.port}/mark-done/${medicineLog.id}'">Mark as done</a>`
        }

        await transporter.sendMail(mailOptions);

      }
    });


  } catch (error) {
    console.log(error);
  }

});

// ===== FOR RECURRING DAILY MEDICINES =====
cron.schedule('* * * * *', async () => {
  try {

    const allMedicines = await db.medicines.findAll({ where: { [Op.and]: [{ start_date: { [Op.lte]: new Date() } }, { end_date: { [Op.gte]: new Date() } }, { type: 1 }, { recurring_type: 'daily' }] } });

    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();

    // used ternary operator for check if hour or minute is 1(one digit) then it will become 01(add 0 ahead for make two digit) and if those are 12(two digit) then it will remain 12(two digit).
    let currTime = (hour.toString().length > 1 ? hour : '0' + hour) + ':' + (minute.toString().length > 1 ? minute : '0' + minute) + ':00';

    allMedicines.forEach(async (element) => {
      if (element.time == currTime) {
        // console.log("time matched");

        const user = await db.users.findOne({ where: { id: element.u_id }, attributes: ['email', 'first_name'], raw: true });

        const medicineLog = await db.medicine_logs.create({ medicine_id: element.id, log_date: new Date(), log_time: currTime });

        const mailOptions = {
          from: process.env.your_email,
          to: user.email,
          subject: "Reminder for medicine",
          html: `<h2>Hey ${user.first_name}, Reminder for taking your medicine.</h2><p>it's time to take your <strong>${element.name}</strong> medicine <strong>${element.medication_timing}</strong>. because it's <strong>${element.time}</strong>.</p><p>Without forgottting take your medicine.</p><a href='http://localhost:${process.env.port}/mark-done/${medicineLog.id}'">Mark as done</a>`
        }

        await transporter.sendMail(mailOptions);

      }
    });

  } catch (error) {
    console.log(error);
  }

});

// ===== FOR RECURRING WEEKLY MEDICINES =====
cron.schedule('* * * * *', async () => {
  try {

    const allMedicines = await db.medicines.findAll({ where: { [Op.and]: [{ start_date: { [Op.lte]: new Date() } }, { end_date: { [Op.gte]: new Date() } }, { type: 1 }, { recurring_type: 'weekly' }] } });

    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();


    // used ternary operator for check if hour or minute is 1(one digit) then it will become 01(add 0 ahead for make two digit) and if those are 12(two digit) then it will remain 12(two digit).
    let currTime = (hour.toString().length > 1 ? hour : '0' + hour) + ':' + (minute.toString().length > 1 ? minute : '0' + minute) + ':00';

    allMedicines.forEach(async (element) => {

      // console.log(element.day);
      // console.log(element.day.split(','));

      element.day.split(',').forEach(async (day) => {

        if (day == date.getDay()) {
          // console.log("day matched");

          if (element.time == currTime) {
            // console.log("time matched");

            const user = await db.users.findOne({ where: { id: element.u_id }, attributes: ['email', 'first_name'], raw: true });

            const medicineLog = await db.medicine_logs.create({ medicine_id: element.id, log_date: new Date(), log_time: currTime });

            const mailOptions = {
              from: process.env.your_email,
              to: user.email,
              subject: "Reminder for medicine",
              html: `<h2>Hey ${user.first_name}, Reminder for taking your medicine.</h2><p>it's time to take your <strong>${element.name}</strong> medicine <strong>${element.medication_timing}</strong>. because it's <strong>${element.time}</strong>.</p><p>Without forgottting take your medicine.</p><a href='http://localhost:${process.env.port}/mark-done/${medicineLog.id}'">Mark as done</a>`
            }

            await transporter.sendMail(mailOptions);

          }
        }
      });
    });

  } catch (error) {
    console.log(error);
  }

});

