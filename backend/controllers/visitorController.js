const Visitor = require("../models/Visitor");
const FamilyMember = require("../models/FamilyMember");

// ===========================
// Add Visitor
// ===========================
const addVisitor = async (req, res) => {

    try {

        const visitor = await Visitor.create(req.body);

        res.status(201).json({
            message: "Visitor Added Successfully",
            visitor
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===========================
// Get All Visitors
// ===========================
const getVisitors = async (req, res) => {

    try {

        const visitors = await Visitor.find()
            .populate("residentId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(visitors);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===========================
// Get Visitor By Id
// ===========================
const getVisitorById = async (req, res) => {

    try {

        const visitor = await Visitor.findById(req.params.id)
            .populate("residentId", "name");

        if (!visitor) {

            return res.status(404).json({
                message: "Visitor Not Found"
            });

        }

        res.status(200).json(visitor);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===========================
// Update Visitor
// ===========================
const updateVisitor = async (req, res) => {

    try {

        const visitor = await Visitor.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        if (!visitor) {

            return res.status(404).json({
                message: "Visitor Not Found"
            });

        }

        res.status(200).json({
            message: "Visitor Updated Successfully",
            visitor
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===========================
// Delete Visitor
// ===========================
const deleteVisitor = async (req, res) => {

    try {

        const visitor = await Visitor.findByIdAndDelete(req.params.id);

        if (!visitor) {

            return res.status(404).json({
                message: "Visitor Not Found"
            });

        }

        res.status(200).json({
            message: "Visitor Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const checkOutVisitor = async (req, res) => {

    try {

        const visitor = await Visitor.findById(req.params.id);

        if (!visitor) {

            return res.status(404).json({
                message: "Visitor Not Found"
            });

        }

        visitor.checkOut = new Date();

        await visitor.save();

        res.status(200).json({
            message: "Visitor Checked Out"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const bookVisit = async (req, res) => {

    try {

        const userId = req.user.id;

        const family = await FamilyMember.findOne({ userId });

        if (!family) {
            return res.status(404).json({
                message: "Family Member Not Found"
            });
        }

        const {
            visitorName,
            phone,
            relation,
            purpose,
            visitDate
        } = req.body;

        const visitor = await Visitor.create({

            residentId: family.residentId,

            visitorName,

            phone,

            relation,

            purpose,

            visitDate

        });

        res.status(201).json({
            message: "Visit Booked Successfully",
            visitor
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addVisitor,
    getVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor,
    checkOutVisitor,
    bookVisit,
};