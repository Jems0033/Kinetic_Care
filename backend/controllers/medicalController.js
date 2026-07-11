const MedicalRecord = require("../models/MedicalRecord");

// ==========================
// Add Medical Record
// ==========================
const addMedicalRecord = async (req, res) => {

    try {

        const medicalRecord = await MedicalRecord.create(req.body);

        res.status(201).json({
            message: "Medical Record Added Successfully",
            medicalRecord
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Get All Medical Records
// ==========================
const getMedicalRecords = async (req, res) => {

    try {

        const records = await MedicalRecord.find()
            .populate("residentId", "name")
            .populate("staffId", "name");

        res.status(200).json(records);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Get Medical Record By ID
// ==========================
const getMedicalRecordById = async (req, res) => {

    try {

        const record = await MedicalRecord.findById(req.params.id)
            .populate("residentId", "name")
            .populate("staffId", "name");

        if (!record) {

            return res.status(404).json({
                message: "Medical Record Not Found"
            });

        }

        res.status(200).json(record);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Update Medical Record
// ==========================
const updateMedicalRecord = async (req, res) => {

    try {

        const record = await MedicalRecord.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        if (!record) {

            return res.status(404).json({
                message: "Medical Record Not Found"
            });

        }

        res.status(200).json({
            message: "Medical Record Updated Successfully",
            record
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Delete Medical Record
// ==========================
const deleteMedicalRecord = async (req, res) => {

    try {

        const record = await MedicalRecord.findByIdAndDelete(req.params.id);

        if (!record) {

            return res.status(404).json({
                message: "Medical Record Not Found"
            });

        }

        res.status(200).json({
            message: "Medical Record Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addMedicalRecord,
    getMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord
};