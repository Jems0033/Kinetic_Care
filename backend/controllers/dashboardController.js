const Resident = require("../models/Resident");
const Staff = require("../models/Staff");
const Room = require("../models/Room");

const getDashboard = async (req, res) => {

    try {

        const totalResidents = await Resident.countDocuments();

        const totalStaff = await Staff.countDocuments();

        const totalRooms = await Room.countDocuments();

        const pendingPayments = await Payment.countDocuments({
            status: "Pending",
        });

        res.status(200).json({

            totalResidents,

            totalStaff,

            totalRooms,

            pendingPayments,

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};

module.exports = {
    getDashboard,
};
