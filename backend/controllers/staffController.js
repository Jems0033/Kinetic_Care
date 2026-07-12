const Staff = require("../models/Staff");
const User = require("../models/User");
// Add Staff
const addStaff = async (req, res) => {

    try {

        const staff = await Staff.create(req.body);

        res.status(201).json({
            message: "Staff Added Successfully",
            staff,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

// Get All Staff
const getStaff = async (req, res) => {

    try {

        const staff = await Staff.find();

        res.status(200).json(staff);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

// Get Staff By Id
const getStaffById = async (req, res) => {

    try {

        const staff = await Staff.findById(req.params.id);

        if (!staff) {

            return res.status(404).json({
                message: "Staff Not Found",
            });

        }

        res.status(200).json(staff);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

// Update Staff
const updateStaff = async (req, res) => {

    try {

        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Staff Updated Successfully",
            staff,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

// Delete Staff
const deleteStaff = async (req, res) => {

    try {

        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                message: "Staff Not Found"
            });
        }

        // Delete User
        await User.findByIdAndDelete(staff.userId);

        // Delete Staff
        await Staff.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Staff Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

    // ==========================
// Get All Doctors
// ==========================
const getDoctors = async (req, res) => {

    try {

        const doctors = await Staff.find({
            role: "Doctor"
        });

        res.status(200).json(doctors);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getDoctors,
};