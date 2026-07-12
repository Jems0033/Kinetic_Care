const bcrypt = require("bcrypt");
const User = require("../models/User");
const FamilyMember = require("../models/FamilyMember");

// ==========================
// Add Family Member
// ==========================
const addFamilyMember = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
            residentId,
            relation
        } = req.body;

        // Check Email
        const userExists = await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({

            name,
            email,
            phone,
            password: hashedPassword,
            role: "family"

        });

        // Create Family Member
        const family = await FamilyMember.create({

            userId: user._id,

            residentId,

            relation

        });

        res.status(201).json({

            message: "Family Member Added Successfully",

            family

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================
// Get All Family Members
// ==========================
const getFamilyMembers = async (req, res) => {

    try {

        const familyMembers = await FamilyMember.find()

            .populate("userId", "name email phone")

            .populate("residentId", "name");

        res.status(200).json(familyMembers);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
// ==========================
// Get Family Member By ID
// ==========================
const getFamilyMemberById = async (req, res) => {

    try {

        const family = await FamilyMember.findById(req.params.id)

            .populate("userId", "name email phone")

            .populate("residentId", "name");

        if (!family) {

            return res.status(404).json({

                message: "Family Member Not Found"

            });

        }

        res.status(200).json(family);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================
// Update Family Member
// ==========================
const updateFamilyMember = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            residentId,
            relation
        } = req.body;

        const family = await FamilyMember.findById(req.params.id);

        if (!family) {

            return res.status(404).json({
                message: "Family Member Not Found"
            });

        }

        // Update User Table
        await User.findByIdAndUpdate(

            family.userId,

            {
                name,
                email,
                phone
            },

            { new: true }

        );

        // Update Family Table
        family.residentId = residentId;
        family.relation = relation;

        await family.save();

        res.status(200).json({
            message: "Family Member Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Delete Family Member
// ==========================
const deleteFamilyMember = async (req, res) => {

    try {

        const family = await FamilyMember.findById(req.params.id);

        if (!family) {

            return res.status(404).json({
                message: "Family Member Not Found"
            });

        }

        // Delete User
        await User.findByIdAndDelete(family.userId);

        // Delete Family Member
        await FamilyMember.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Family Member Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    addFamilyMember,

    getFamilyMembers,

    getFamilyMemberById,

    updateFamilyMember,

    deleteFamilyMember

};