const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    addFamilyMember,

    getFamilyMembers,

    getFamilyMemberById,

    updateFamilyMember,

    deleteFamilyMember

} = require("../controllers/familyMemberController");

// Get All Family Members
router.get("/", protect, getFamilyMembers);

// Get Family Member By Id
router.get("/:id", protect, getFamilyMemberById);

// Add Family Member
router.post("/", protect, addFamilyMember);

// Update Family Member
router.put("/:id", protect, updateFamilyMember);

// Delete Family Member
router.delete("/:id", protect, deleteFamilyMember);

module.exports = router;