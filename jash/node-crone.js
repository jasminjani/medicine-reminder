const cron = require('node-cron');
const db = require('../models');


// Schedule the cron job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    // console.log("jash jalsa j kare ne baka");

    const allMedicines = await db.medicines.findAll({});
    console.log("a: ",allMedicines);


  } catch (error) {
    console.log('error');
  }

});