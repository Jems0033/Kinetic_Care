const MedicalRecord = require("../models/MedicalRecord");


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

module.exports = {
    getMedicalRecords,
    getMedicalRecordById,
    
};