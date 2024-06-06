const cron = require('node-cron');
const db = require('../models');
const { Op } = require("sequelize");
const transporter = require("../utils/nodemailer");
const cloudinary = require('./cloudinary');
require('dotenv').config();
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


// this crone job will run on every sunday at 00:00
// ===== FOR GENERATING CSV =====
cron.schedule('0 0 * * 0', async () => {
  try {

    const allId = await db.medicine_logs.findAll({ where: { [Op.and]: [{ log_date: { [Op.lte]: new Date().toISOString().slice(0, 10) } }, { log_date: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) } }] }, attributes: [], raw: true, include: { model: db.medicines, attributes: ['u_id'] }, group: ['medicine.u_id'] });

    allId.forEach(async (user) => {

      const allData = await db.medicine_logs.findAll({ where: { [Op.and]: [{ log_date: { [Op.lte]: new Date().toISOString().slice(0, 10) } }, { log_date: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) } }] }, attributes: ['log_date', 'is_done'], raw: true, include: { model: db.medicines, where: { u_id: user['medicine.u_id'] }, attributes: ['name', 'description', 'medication_timing', 'time', 'u_id'] } });

      const csvFileName = `${allData[0]['medicine.u_id']}_${new Date().toISOString().slice(0, 10)}.csv`;
      const csvPath = `./reports/${csvFileName}`;

      const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
          { id: 'medicine.name', title: 'Name' },
          { id: 'medicine.time', title: 'Time' },
          { id: 'log_date', title: 'Date' },
          { id: 'is_done', title: 'Marked Done (0 - not marked done, 1 - marked)' },
          { id: 'medicine.description', title: 'description' },
          { id: 'medicine.medication_timing', title: 'schedule' },
        ]
      });

      await csvWriter.writeRecords(allData);       // returns a promise
      console.log('csv generated');

      const result = await cloudinary.uploader.upload(csvPath,
        // { public_id: csvFileName },
        { resource_type: "raw" },
      )

      // TODO: uncomment this csvfile deleting code
      // fs.unlink(csvPath);

      const userEmail = await db.users.findOne({ where: { id: user['medicine.u_id'] }, attributes: ['email', 'first_name'], raw: true });

      const mailOptions = {
        from: process.env.your_email,
        to: userEmail.email,
        subject: "Weekly report",
        html: `<h2>Hey ${userEmail.first_name}</h2><p>This is your weekly report for your medicine reminder schedule from remindMe platform.</p><p>Click on below link to download file</p><a href='${result.url}''>Download weekly report</a>`,
        // attachments: [{ filename: `./reports/${csvFileName}` }]
      }

      await transporter.sendMail(mailOptions);
      console.log('mail sent of csv file');

    });


  } catch (error) {
    console.log(error);
  }
})