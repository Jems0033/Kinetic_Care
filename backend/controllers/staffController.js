const Room = require("../models/Room");
const Staff = require("../models/Staff");
const User = require("../models/User");
const Resident = require("../models/Resident");
const MedicineLog = require("../models/MedicineLog");
const bcrypt = require("bcrypt");
const generatePassword = require("../utils/generatePassword");
const sendMail = require("../utils/sendMail");
// Add Staff
const addStaff = async (req, res) => {
  let createdUser = null;

  try {

    const {
      name,
      email,
      phone,
      gender,
      role,
      shift,
      salary,
      address,
    } = req.body;

    if (!name || !email || !role || !shift || !gender) {
      return res.status(400).json({
        message: "Name, email, role, shift and gender are required",
      });
    }

    const validRoles = ["Doctor", "Caretaker"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid staff role",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Generate Password
    const generatedPassword = generatePassword();

    // Hash Password
    const hashedPassword = await bcrypt.hash(
      generatedPassword,
      10
    );

    const loginRole =
      role === "Doctor"
        ? "doctor"
        : "staff";

    // Create Login User
    createdUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: loginRole,
    });

    // Create Staff
    const staff = await Staff.create({
      name,
      email: email.toLowerCase(),
      phone,
      gender,
      role,
      shift,
      salary,
      address,
      userId: createdUser._id,
    });

    const staffName = name;

const staffEmail = email.toLowerCase();

    // Send Credentials Mail
    const emailHtml = `
      <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>

    <body
      style="
        margin: 0;
        padding: 0;
        background-color: #f3f7f5;
        font-family: Arial, Helvetica, sans-serif;
      "
    >
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="background-color: #f3f7f5; padding: 40px 15px;"
      >
        <tr>
          <td align="center">

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                max-width: 580px;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
              "
            >

              <!-- Header -->
              <tr>
                <td
                  align="center"
                  style="
                    background-color: #1f9d74;
                    padding: 32px 25px;
                  "
                >
                  <img
                    src="https://raw.githubusercontent.com/Jems0033/Kinetic_Care/main/frontend/public/logo.png"
                    alt="Kinetic Care Logo"
                    width="80"
                    style="
                      display: block;
                      width: 80px;
                      height: auto;
                      margin: 0 auto 12px;
                      border: 0;
                    "
                  />

                  <h1
                    style="
                      margin: 0;
                      color: #ffffff;
                      font-size: 28px;
                      font-weight: 700;
                    "
                  >
                    Kinetic Care
                  </h1>

                  <p
                    style="
                      margin: 8px 0 0;
                      color: #dff5ed;
                      font-size: 14px;
                    "
                  >
                    Caring Today, Comforting Tomorrow
                  </p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 36px 40px;">

                  <h2
                    style="
                      margin: 0 0 20px;
                      color: #222222;
                      font-size: 23px;
                    "
                  >
                    Welcome to Kinetic Care
                  </h2>

                  <p
                    style="
                      margin: 0 0 16px;
                      color: #555555;
                      font-size: 15px;
                      line-height: 1.7;
                    "
                  >
                    Hello <strong>${staffName}</strong>,
                  </p>

                  <p
                    style="
                      margin: 0 0 16px;
                      color: #555555;
                      font-size: 15px;
                      line-height: 1.7;
                    "
                  >
                    Your staff account has been created successfully.
                    You can now use this account to monitor and stay
                    connected with Kinetic care.
                  </p>

                  <p
                    style="
                      margin: 0 0 20px;
                      color: #555555;
                      font-size: 15px;
                      line-height: 1.7;
                    "
                  >
                    Please use the following credentials to log in:
                  </p>

                  <!-- Credentials Card -->
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      background-color: #f0faf6;
                      border: 1px solid #cdeadd;
                      border-radius: 12px;
                      margin: 22px 0;
                    "
                  >
                    <tr>
                      <td style="padding: 22px;">

                        <p
                          style="
                            margin: 0 0 7px;
                            color: #777777;
                            font-size: 12px;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                          "
                        >
                          Login Email
                        </p>

                        <p
                          style="
                            margin: 0 0 20px;
                            color: #222222;
                            font-size: 16px;
                            font-weight: bold;
                            word-break: break-all;
                          "
                        >
                          ${staffEmail}
                        </p>

                        <p
                          style="
                            margin: 0 0 7px;
                            color: #777777;
                            font-size: 12px;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                          "
                        >
                          Password
                        </p>

                        <div
                          style="
                            display: inline-block;
                            background-color: #ffffff;
                            border: 1px dashed #1f9d74;
                            border-radius: 8px;
                            padding: 12px 18px;
                            color: #1f9d74;
                            font-size: 20px;
                            font-weight: bold;
                            letter-spacing: 2px;
                          "
                        >
                          ${generatedPassword}
                        </div>

                      </td>
                    </tr>
                  </table>

                  <!-- Security Alert -->
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      background-color: #fff8e6;
                      border-left: 4px solid #e8ad24;
                      border-radius: 6px;
                      margin-top: 25px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding: 14px 16px;
                          color: #665c3d;
                          font-size: 13px;
                          line-height: 1.6;
                        "
                      >
                        <strong>Security Notice:</strong>
                        Please change this temporary password after your
                        first login. Never share your password with anyone.
                      </td>
                    </tr>
                  </table>


                  <p
                    style="
                      margin: 25px 0 0;
                      color: #777777;
                      font-size: 13px;
                      line-height: 1.7;
                    "
                  >
                    If you believe you received this email by mistake,
                    please contact the Kinetic Care administration.
                  </p>

                  <p
                    style="
                      margin: 28px 0 0;
                      color: #555555;
                      font-size: 14px;
                      line-height: 1.6;
                    "
                  >
                    Regards,<br />
                    <strong style="color: #1f9d74;">
                      Kinetic Care Team
                    </strong>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="
                    background-color: #f8faf9;
                    border-top: 1px solid #eeeeee;
                    padding: 22px 20px;
                  "
                >
                  <p
                    style="
                      margin: 0 0 5px;
                      color: #1f9d74;
                      font-size: 15px;
                      font-weight: bold;
                    "
                  >
                    Kinetic Care
                  </p>

                  <p
                    style="
                      margin: 0;
                      color: #999999;
                      font-size: 12px;
                    "
                  >
                    Old Age Home Management System
                  </p>

                  <p
                    style="
                      margin: 8px 0 0;
                      color: #aaaaaa;
                      font-size: 11px;
                    "
                  >
                    © ${new Date().getFullYear()} Kinetic Care.
                    All rights reserved.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
  </html>

    `;

    try {

      await sendMail({
        email: email.toLowerCase(),
        subject: "Kinetic Care Login Credentials",
        html: emailHtml,
      });

    } catch (mailError) {

      console.log(
        "Mail Error :",
        mailError.message
      );

    }

    return res.status(201).json({
      message:
        "Staff added successfully. Login credentials have been sent to the registered email.",
      staff,
    });

  } catch (error) {

    if (createdUser) {
      await User.findByIdAndDelete(createdUser._id);
    }

    return res.status(500).json({
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

const getStaffDashboard = async (req, res) => {
  try {

    const staff = await Staff.findOne({
      userId: req.user.id,
    });

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found",
      });
    }

    const totalResidents = await Resident.countDocuments();

    res.json({
      name: staff.name,
      role: staff.role,
      shift: staff.shift,
      totalResidents,
      assignedResidents: totalResidents
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getStaffResidents = async (req, res) => {
  try {

    const residents = await Resident.find()
      .populate("room", "roomNumber")
      .sort({ createdAt: -1 });

    const data = residents.map((resident) => ({
      _id: resident._id,
      name: resident.name,
      age: resident.age,
      gender: resident.gender,
      room: resident.room ? resident.room.roomNumber : "N/A",
      medicalCondition: resident.medicalCondition,
    }));

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getStaffResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("room", "roomNumber roomType");

    if (!resident) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    return res.status(200).json({
      resident,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const getResidentHistory = async (req, res) => {
  try {
    const vitals = await Vital.find({
      resident: req.params.id,
    })
      .populate("staff", "name")
      .sort({ createdAt: -1 });

    const medicines = await MedicineLog.find({
      resident: req.params.id,
    })
      .populate("staff", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      vitals,
      medicines,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
  getStaffDashboard,
  getStaffResidents,
  getStaffResidentById,
  getResidentHistory,
};