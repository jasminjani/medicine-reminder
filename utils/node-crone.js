const cron = require('node-cron');
const db = require('../models');
const { Op } = require("sequelize");
const { sentEmail } = require('../helpers/email');
require('dotenv').config();


// Schedule the cron job to run every minute
// ===== FOR ALL TYPE MEDICINES =====
cron.schedule('* * * * *', async () => {
  try {

    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();

    // used ternary operator for check if hour or minute is 1(one digit) then it will become 01(add 0 ahead for make two digit) and if those are 12(two digit) then it will remain 12(two digit).
    let currTime = (hour.toString().length > 1 ? hour : '0' + hour) + ':' + (minute.toString().length > 1 ? minute : '0' + minute) + ':00';

    // all medicine taken on current time for today's date (either it's day = today's day or not) 
    const allMedicines = await db.medicines.findAll({ where: { [Op.and]: [{ start_date: { [Op.lte]: date } }, { end_date: { [Op.gte]: date } }, { time: currTime }] }, raw: true });

    allMedicines.forEach(async (element) => {

      if (element.type == '0' || (element.type == '1' && element.recurring_type.trim().toLowerCase() == 'daily')) {
        await sendMedicineReminderEmail(element, currTime);
      }
      else if (element.type == '1' && element.recurring_type.trim().toLowerCase() == 'weekly') {
        await sendWeeklyReminderEmail(element, currTime, date)
      }
    });

  } catch (error) {
    console.error(error);
  }

});


const sendWeeklyReminderEmail = async (medicine, currTime, date) => {
  try {

    medicine.day.split(',').forEach(async (day) => {
      // weekly medicine day is today's day then send email
      if (day == date.getDay()) {
        await sendMedicineReminderEmail(medicine, currTime);
      }
    });
  } catch (error) {
    console.error(error);
  }
}


const sendMedicineReminderEmail = async (medicine, currTime) => {
  try {

    const user = await db.users.findOne({ where: { id: medicine.u_id }, attributes: ['email', 'first_name'], raw: true });

    const medicineLog = await db.medicine_logs.create({ medicine_id: medicine.id, log_date: new Date(), log_time: currTime });

    const emailHtml = `<h2>Hey ${user.first_name}, Reminder for taking your medicine.</h2><p>it's time to take your <strong>${medicine.name}</strong> medicine <strong>${medicine.medication_timing}</strong>. because it's <strong>${medicine.time}</strong>.</p><p>Without forgottting take your medicine.</p><a href='http://localhost:${process.env.port}/mark-done/${medicineLog.id}'">Mark as done</a>`;

    await sentEmail(user.email, "Reminder for medicine", emailHtml);

  } catch (error) {
    console.error(error);
  }
}
