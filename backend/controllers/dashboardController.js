const Resident = require("../models/Resident");
const Staff = require("../models/Staff");
const Room = require("../models/Room");
const Donor = require("../models/Donor");
const Event = require("../models/Event");

const getDashboard = async (req, res) => {

    try {

        const totalResidents = await Resident.countDocuments();

        const totalStaff = await Staff.countDocuments();

        const totalRooms = await Room.countDocuments();

        const totalDonors = await Donor.countDocuments();

        const totalEvents = await Event.countDocuments();  

        res.status(200).json({

            totalResidents,

            totalStaff,

            totalRooms,

            totalDonors,

            totalEvents

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {
    getDashboard
};