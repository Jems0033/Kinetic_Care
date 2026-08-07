const Visitor = require("../models/Visitor");
const FamilyMember = require("../models/FamilyMember");
const sendEmail = require("../utils/sendMail");
// ===========================
// Add Visitor
// ===========================
const addVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);

    res.status(201).json({
      message: "Visitor Added Successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================
// Get All Visitors
// ===========================
const getVisitors = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await Visitor.updateMany(
      {
        status: "Approved",
        checkOut: null,
        visitDate: {
          $lt: today,
        },
      },
      {
        $set: {
          status: "Completed",
          checkOut: today,
        },
      },
    );
    const visitors = await Visitor.find()
      .populate("residentId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================
// Get Visitor By Id
// ===========================
const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate(
      "residentId",
      "name",
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor Not Found",
      });
    }

    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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

      { new: true },
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor Not Found",
      });
    }

    res.status(200).json({
      message: "Visitor Updated Successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
        message: "Visitor Not Found",
      });
    }

    res.status(200).json({
      message: "Visitor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor Not Found",
      });
    }

    visitor.checkOut = new Date();
    visitor.status = "Completed";

    await visitor.save();

    res.status(200).json({
      message: "Visitor Checked Out",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const bookVisit = async (req, res) => {
  try {
    const userId = req.user.id;

    const family = await FamilyMember.findOne({ userId });

    if (!family) {
      return res.status(404).json({
        message: "Family Member Not Found",
      });
    }

    const { visitorName, phone, relation, purpose, visitDate } = req.body;

    const existingVisit = await Visitor.findOne({
      familyMemberId: family._id,
      status: {
        $in: ["Pending", "Approved"],
      },
    });

    if (existingVisit) {
      return res.status(400).json({
        message:
          "You have already booked a visit. Please wait until your current visit is completed.",
      });
    }

    const visitor = await Visitor.create({
      residentId: family.residentId,
      familyMemberId: family._id,
      visitorName,
      phone,
      relation,
      purpose,
      visitDate,
    });

    res.status(201).json({
      message: "Visit Booked Successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const approveVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate({
        path: "familyMemberId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("residentId", "name");

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    visitor.status = "Approved";

    await visitor.save();

    await sendEmail({
      email: visitor.familyMemberId.userId.email,
      subject: "Visit Approved",
      html: `
    <h2>Hello ${visitor.familyMemberId.userId.name},</h2>

    <p>Your visit request has been <b style="color:green">APPROVED</b>.</p>

    <p><b>Resident:</b> ${visitor.residentId.name}</p>
    <p><b>Visitor:</b> ${visitor.visitorName}</p>
<p><b>Date:</b> ${new Date(visitor.visitDate).toLocaleDateString("en-IN")}</p>
    <p>Please arrive on time.</p>

    <br>
    <p>Kinetic Care Team</p>
  `,
    });

    res.status(200).json({
      message: "Visitor approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const rejectVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate({
        path: "familyMemberId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("residentId", "name");

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    visitor.status = "Rejected";

    await visitor.save();

    await sendEmail({
      email: visitor.familyMemberId.userId.email,
      subject: "Visit Rejected",
      html: `
    <h2>Hello ${visitor.familyMemberId.userId.name},</h2>

    <p>Your visit request has been <b style="color:red">REJECTED</b>.</p>

    <p><b>Resident:</b> ${visitor.residentId.name}</p>
    <p><b>Visitor:</b> ${visitor.visitorName}</p>

    <p>If required, please book another visit.</p>

    <br>
    <p>Kinetic Care Team</p>
  `,
    });

    res.status(200).json({
      message: "Visitor rejected",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
  approveVisitor,
  rejectVisitor,
};
