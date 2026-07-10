const Resident = require("../models/Resident");

// ===============================
// Add Resident
// ===============================
const addResident = async (req, res) => {
  try {
    const resident = await Resident.create(req.body);

    res.status(201).json({
      message: "Resident Added Successfully",
      resident,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get All Residents
// ===============================
const getResidents = async (req, res) => {
  try {
    const residents = await Resident.find();

    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Resident By ID
// ===============================
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Resident
// ===============================
const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    res.status(200).json({
      message: "Resident Updated Successfully",
      resident,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Delete Resident
// ===============================
const deleteResident = async (req, res) => {
  try {
    const resident = await Resident.findByIdAndDelete(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    res.status(200).json({
      message: "Resident Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
};