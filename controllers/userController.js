const db = require("../models");

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

exports.addOneMedicine = async (req, res) => {
  try {

    const { name, medication_timing, date, time, description } = req.body;
    const u_id = 1;
    // const u_id = req.user.id;

    if (!name || !date || !time) {
      return res.status(500).json({
        success: false,
        message: "data missing for add one time medicine"
      })
    }

    const addMedicine = await db.medicines.create({ u_id, name, type: 0, medication_timing, start_date: date, end_date: date, time, description, day: new Date(date).getDay() })

    res.status(200).send(addMedicine);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



exports.cronjobOneMedicine = async (req, res) => {
  try {

    const allMedicines = await db.medicines.findAll({ });





    res.send(allMedicines);

  } catch (error) {
    console.log(error);
  }
}