const { Op } = require("sequelize");
const db = require("../models");
require('dotenv').config();

exports.getDashboard = async (req, res) => {
  try {

    res.status(200).render('dashboard');

  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


exports.dashboardData = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      })
    }

    const allMedicines = await db.medicines.findAll({ where: { [Op.and]: [{ start_date: { [Op.lte]: new Date() } }, { end_date: { [Op.gte]: new Date() } }, { u_id: req.user.id }] }, raw: true });

    res.status(200).send(allMedicines);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.getOneTimePage = async (req, res) => {
  try {

    res.status(200).render('oneTime');

  } catch (error) {
    console.error(error);
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
    console.error(error);
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


exports.getHistoryPage = async (req, res) => {
  try {

    res.status(200).render('history');

  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


exports.getHistoryData = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      })
    }

    const allMedicines = await db.medicines.findAll({ where: { u_id: req.user.id }, attributes: ['id', 'name', 'start_date', 'end_date', 'time', 'recurring_type'], raw: true });

    res.status(200).send(allMedicines);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.getParticularMedicineHistoryData = async (req, res) => {
  try {

    if (!req.body.medicine_id) {
      return res.status(400).json({
        success: false,
        message: "medicine id not found"
      })
    }

    const allMedicines = await db.medicines.findOne({ where: { id: req.body.medicine_id }, raw: true });

    res.status(200).send(allMedicines);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.deleteMedicine = async (req, res) => {
  try {
    const { medicine_id } = req.body;

    if (!medicine_id) {
      return res.status(400).json({
        success: false,
        message: "medicine id not found"
      })
    }

    await db.medicines.destroy({ where: { id: medicine_id } });

    res.status(200).json({
      success: true,
      message: "medicine deleted successfully"
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}