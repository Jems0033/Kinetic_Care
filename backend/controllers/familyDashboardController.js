const FamilyMember = require("../models/FamilyMember");
const MedicalRecord = require("../models/MedicalRecord");
const Event = require("../models/Event");
const Visitor = require("../models/Visitor");

const getFamilyDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const family = await FamilyMember.findOne({
            userId
        }).populate({
            path: "residentId",
            populate: {
                path: "room",
                select: "roomNumber"
            }
        });

        if (!family) {

            return res.status(404).json({
                message: "Family Member Not Found"
            });

        }

        const resident = family.residentId;

        const medicalCount = await MedicalRecord.countDocuments({
            residentId: resident._id
        });

        const latestMedical = await MedicalRecord.findOne({
            residentId: resident._id
        }).sort({ date: -1 });

        const eventCount = await Event.countDocuments({
            eventDate: {
                $gte: new Date()
            }
        });

        res.status(200).json({

            resident: {

                name: resident.name,
                age: resident.age,
                gender: resident.gender,
                room: resident.room?.roomNumber || "-"

            },

            medicalCount,
            eventCount,
            latestMedical

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// =======================
// BOOK VISIT
// =======================

const bookVisit = async (req, res) => {

    try {

        const userId = req.user.id;

        const family = await FamilyMember.findOne({
            userId
        });

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

            visitDate,

            status: "Pending"

        });

        res.status(201).json({

            message: "Visit Request Sent Successfully",

            visitor

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getFamilyDashboard,

    bookVisit

};