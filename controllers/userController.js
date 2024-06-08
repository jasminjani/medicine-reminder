const db = require("../models");
require('dotenv').config();

exports.getDashboard = async (req, res) => {
  try {

    res.status(200).render('dashboard');

  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


exports.getOneTimePage = async (req, res) => {
  try {

    res.status(200).render('oneTime');

  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}



exports.recurringPage = async (req, res) => {
  try {

    res.status(200).render('recurring');

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



exports.addMedicines = async (req, res) => {
  try {

    let { name, medication_timing, start_date, end_date, time, day, description, type, recurring_type } = req.body;
    const u_id = req.user.id;

    if (!name || !start_date || !time || !type) {
      return res.status(400).json({
        success: false,
        message: "data missing for add medicine"
      })
    }

    if (type == '1' && (!end_date || !recurring_type || (recurring_type.trim().toLowerCase() == 'weekly' && !day))) {
      return res.status(400).json({
        success: false,
        message: "data missing for reccuring medicine add"
      })
    }

    if (type == '0') {
      day = new Date(start_date).getDay();
      end_date = start_date;
    }

    const dt = new Date(end_date);
    // endDt give result in UTC timezone and every date in database is in UTC.
    const endDt = new Date(dt.setDate(dt.getDate() + 1));

    const addMedicine = await db.medicines.create({ u_id, name, type, medication_timing, start_date: start_date, end_date: endDt, time, description, day: day?.toString(), recurring_type });

    res.status(200).json({
      success: true,
      message: "medicine added successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}





exports.emailMarkAsDone = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(500).json({
        success: false,
        message: "id not found while updating email mark as done"
      })
    }

    await db.medicine_logs.update({ is_done: 1 }, { where: { id: id } });

    res.status(200).send('this email marked as done');

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

