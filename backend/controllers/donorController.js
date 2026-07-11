const Donor = require("../models/Donor");

// ======================
// Add Donor (Public)
// ======================
const addDonor = async (req, res) => {

    try {

        const donor = await Donor.create(req.body);

        res.status(201).json({
            message: "Donation Submitted Successfully",
            donor
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// Get All Donors (Admin)
// ======================
const getDonors = async (req, res) => {

    try {

        const donors = await Donor.find().sort({ createdAt: -1 });

        res.status(200).json(donors);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addDonor,
    getDonors
};