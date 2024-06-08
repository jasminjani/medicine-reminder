const cron = require('node-cron');
const db = require('../models');
const { Op } = require("sequelize");
const cloudinary = require('./cloudinary');
require('dotenv').config();
const fs = require('fs');
const { queue, redisOptions } = require('./bullmq');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { Worker } = require('bullmq');
const { sentEmail } = require('../helpers/email');


// function for generating csv and upload it to cloudinary and sent mail to user
const jobFunction = async (job) => {
  try {

    // finding all sent mail in last week for this userid
    const allData = await db.medicine_logs.findAll({ where: { [Op.and]: [{ log_date: { [Op.lte]: job.data.currDate } }, { log_date: { [Op.gte]: job.data.prevDate } }] }, attributes: ['log_date', 'is_done'], raw: true, include: { model: db.medicines, where: { u_id: job.data.id }, attributes: ['name', 'description', 'medication_timing', 'time', 'u_id'] } });

    const csvFileName = `${allData[0]['medicine.u_id']}_${job.data.currDate}.csv`;
    const csvPath = `./reports/${csvFileName}`;

    // generating csv with their headers
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

    // writ records into csv file
    await csvWriter.writeRecords(allData);       // returns a promise
    console.log('csv generated');

    // uploading csv file to cloudinary 
    const result = await cloudinary.uploader.upload(csvPath,
      { resource_type: "raw" },
    )


    // after uploading csv file to cloudinary deleting it from server
    fs.unlinkSync(csvPath);

    // finding user's name and email 
    const userEmail = await db.users.findOne({ where: { id: job.data.id }, attributes: ['email', 'first_name'], raw: true });

    // sending mail
    const receiverEmail = userEmail.email;
    const emailSubject = "Weekly report";
    const emailHtml = `<h2>Hey ${userEmail.first_name}</h2><p>This is your weekly report for your medicine reminder schedule from remindMe platform.</p><p>Click on below link to download file</p><a href='${result.url}''>Download weekly report</a>`;

    await sentEmail(receiverEmail, emailSubject, emailHtml);

    console.log('mail sent of csv file');

  } catch (error) {
    console.error(error);
  }
};


// creating worker for doing task which is in queue.
const worker = new Worker('sendReport', jobFunction, { connection: redisOptions });


// this crone job will run on every sunday at 00:00
// ===== FOR GENERATING CSV =====
cron.schedule('0 0 * * 0', async () => {
  try {

    const allId = await db.medicine_logs.findAll({ where: { [Op.and]: [{ log_date: { [Op.lte]: new Date().toISOString().slice(0, 10) } }, { log_date: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) } }] }, attributes: [], raw: true, include: { model: db.medicines, attributes: ['u_id'] }, group: ['medicine.u_id'] });

    allId.forEach(async (user) => {
      await queue.add("usersIdForReport", { id: user['medicine.u_id'], currDate: new Date().toISOString().slice(0, 10), prevDate: new Date(new Date().setDate(new Date().getDate() - 7)) });
    });

  } catch (error) {
    console.error(error);
  }
});