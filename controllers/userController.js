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

exports.addOneMedicine = async (req, res) => {
  try {

    const { name, medication_timing, date, time, description } = req.body;
    const u_id = req.user.id;

    if (!name || !date || !time) {
      return res.status(500).json({
        success: false,
        message: "data missing for add one time medicine"
      })
    }

    const dt = new Date(date);
    const endDt = new Date(new Date(date).setDate(new Date(date).getDate() + 1));

    const addMedicine = await db.medicines.create({ u_id, name, type: 0, medication_timing, start_date: date, end_date: endDt, time, description, day: new Date(date).getDay() })

    res.status(200).send(addMedicine);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.recurringDailyPage = async (req, res) => {
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


exports.addRecurringDaily = async (req, res) => {
  try {

    const { name, medication_timing, start_date, end_date, time, description } = req.body;
    const u_id = req.user.id;

    if (!name || !start_date || !end_date || !time) {
      return res.status(500).json({
        success: false,
        message: "data missing for add recurring daily medicine"
      })
    }

    const dt = new Date(end_date);
    // endDt give result in UTC timezone and every date in database is in UTC.
    const endDt = new Date(dt.setDate(dt.getDate() + 1));

    const addMedicine = await db.medicines.create({ u_id, name, type: 1, medication_timing, start_date: start_date, end_date: endDt, time, description, recurring_type: 'daily' });

    res.status(200).send(addMedicine);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.recurringWeeklyPage = async (req, res) => {
  try {

    res.status(200).render('recurringWeekly');

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.addRecurringWeekly = async (req, res) => {
  try {

    const { name, medication_timing, start_date, end_date, time, day, description } = req.body;
    const u_id = req.user.id;

    if (!name || !start_date || !end_date || !time || !day) {
      return res.status(500).json({
        success: false,
        message: "data missing for add recurring weekly medicine"
      })
    }

    console.log(day.toString());

    const dt = new Date(end_date);
    // endDt give result in UTC timezone and every date in database is in UTC.
    const endDt = new Date(dt.setDate(dt.getDate() + 1));

    const addMedicine = await db.medicines.create({ u_id, name, type: 1, medication_timing, start_date: start_date, end_date: endDt, time, description, day: day.toString(), recurring_type: 'weekly' });

    res.status(200).send(addMedicine);

  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

