const Resident = require("../models/Resident");
const generatePassword = require("../utils/generatePassword");
const sendMail = require("../utils/sendMail");
const Room = require("../models/Room");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Staff = require("../models/Staff");
const FamilyMember = require("../models/FamilyMember");
const LeaveRequest = require("../models/LeaveRequest");

const getLeastAssignedStaff = async (role, shift, residentField) => {
  const staff = await Staff.aggregate([
    {
      $match: {
        role: role,
        shift: shift,
      },
    },
    {
      $lookup: {
        from: "residents",
        localField: "_id",
        foreignField: residentField,
        as: "assignedResidents",
      },
    },
    {
      $addFields: {
        totalAssigned: {
          $size: "$assignedResidents",
        },
      },
    },
    {
      $sort: {
        totalAssigned: 1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  return staff[0];
};

const addResident = async (req, res) => {
  let resident = null;
  let firstResident = null;
  let secondResident = null;

  try {
    const { isFamily } = req.body;

    const roomId = isFamily ? req.body.resident1.room : req.body.room;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room Not Found",
      });
    }

    let totalCapacity = room.capacity;

    if (room.occupiedBeds >= totalCapacity) {
      return res.status(400).json({
        message: "Room Full",
      });
    }

    // ===========================
    // STAFF ASSIGNMENT
    // ===========================

    const dayDoctor = await getLeastAssignedStaff(
      "Doctor",
      "Day",
      "dayDoctor",
    );

    const nightDoctor = await getLeastAssignedStaff(
      "Doctor",
      "Night",
      "nightDoctor",
    );

    const dayCaretaker = await getLeastAssignedStaff(
      "Caretaker",
      "Day",
      "dayCaretaker",
    );

    const nightCaretaker = await getLeastAssignedStaff(
      "Caretaker",
      "Night",
      "nightCaretaker",
    );

    if (
      !dayDoctor ||
      !nightDoctor ||
      !dayCaretaker ||
      !nightCaretaker
    ) {
      return res.status(400).json({
        message:
          "Day/Night doctor ane caretaker is not available.Please add the staff",
      });
    }

    // ===========================
    // FAMILY DETAILS
    // ===========================

    const familyData = isFamily ? req.body.resident1 : req.body;

    const hasFamily =
      familyData.familyName &&
      familyData.familyEmail &&
      familyData.familyPhone &&
      familyData.relation;

    if (hasFamily) {
      const existingUser = await User.findOne({
        email: familyData.familyEmail,
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Family Email Already Exists",
        });
      }
    }

    // ===========================
    // FAMILY RESIDENTS
    // ===========================

    if (isFamily) {
      const { resident1, resident2 } = req.body;

      firstResident = await Resident.create({
        name: resident1.name,
        age: resident1.age,
        gender: resident1.gender,
        room: resident1.room,
        medicalCondition: resident1.medicalCondition,
        status: "Active",

        dayDoctor: dayDoctor._id,
        dayCaretaker: dayCaretaker._id,
        nightDoctor: nightDoctor._id,
        nightCaretaker: nightCaretaker._id,
      });

      secondResident = await Resident.create({
        name: resident2.name,
        age: resident2.age,
        gender: resident2.gender,
        room: resident1.room,
        medicalCondition: resident2.medicalCondition,
        status: "Active",

        dayDoctor: dayDoctor._id,
        dayCaretaker: dayCaretaker._id,
        nightDoctor: nightDoctor._id,
        nightCaretaker: nightCaretaker._id,
      });

      if (hasFamily) {
        const generatedPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const user = await User.create({
          name: resident1.familyName,
          email: resident1.familyEmail,
          phone: resident1.familyPhone,
          password: hashedPassword,
          role: "family",
        });

        await FamilyMember.create({
          userId: user._id,
          residentId: firstResident._id,
          relation: resident1.relation,
        });

        await FamilyMember.create({
          userId: user._id,
          residentId: secondResident._id,
          relation: resident1.relation,
        });
        const familyName = resident1.familyName;

        const familyEmail = resident1.familyEmail;

        const residentsText = `${resident1.name} and ${resident2.name}`;
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
                    Hello <strong>${familyName}</strong>,
                  </p>

                  <p
                    style="
                      margin: 0 0 16px;
                      color: #555555;
                      font-size: 15px;
                      line-height: 1.7;
                    "
                  >
                    Your family account has been created successfully.
                    You can now use this account to monitor and stay
                    connected with
                    <strong>${residentsText}</strong>.
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
                          ${familyEmail}
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
            email: resident1.familyEmail,
            subject: "Kinetic Care Family Login Credentials",
            html: emailHtml,
          });
        } catch (err) {
          console.log(err.message);
        }
      }

      room.occupiedBeds += 2;
    }

    // ===========================
    // SINGLE RESIDENT
    // ===========================
    else {
      resident = await Resident.create({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        room: req.body.room,
        medicalCondition: req.body.medicalCondition,
        status: req.body.status || "Active",

        dayDoctor: dayDoctor._id,
        dayCaretaker: dayCaretaker._id,
        nightDoctor: nightDoctor._id,
        nightCaretaker: nightCaretaker._id,
      });

      if (hasFamily) {
        const generatedPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const user = await User.create({
          name: familyData.familyName,
          email: familyData.familyEmail,
          phone: familyData.familyPhone,
          password: hashedPassword,
          role: "family",
        });

        await FamilyMember.create({
          userId: user._id,
          residentId: resident._id,
          relation: familyData.relation,
        });

        const familyName = familyData.familyName;

        const familyEmail = familyData.familyEmail;

        const residentsText = resident.name;

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
                    Hello <strong>${familyName}</strong>,
                  </p>

                  <p
                    style="
                      margin: 0 0 16px;
                      color: #555555;
                      font-size: 15px;
                      line-height: 1.7;
                    "
                  >
                    Your family account has been created successfully.
                    You can now use this account to monitor and stay
                    connected with
                    <strong>${residentsText}</strong>.
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
                          ${familyEmail}
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
            email: familyData.familyEmail,
            subject: "Kinetic Care Family Login Credentials",
            html: emailHtml,
          });
        } catch (err) {
          console.log(err.message);
        }
      }

      room.occupiedBeds++;
    }

    if (room.occupiedBeds >= totalCapacity) {
      room.status = "Occupied";
    }

    await room.save();

    if (isFamily) {
      return res.status(201).json({
        message:
          "Family residents added successfully. Login credentials have been sent to the registered family email.",
        residents: [firstResident, secondResident],
      });
    }

    return res.status(201).json({
      message:
        "Resident added successfully. Family login credentials have been sent to the registered email.",
      resident,
    });
  } catch (error) {
    if (resident) {
      await Resident.findByIdAndDelete(resident._id);
    }

    if (firstResident) {
      await Resident.findByIdAndDelete(firstResident._id);
    }

    if (secondResident) {
      await Resident.findByIdAndDelete(secondResident._id);
    }

    res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// Get All Residents
// ===============================
const getResidents = async (req, res) => {
  try {
    const residents = await Resident.find()
      .sort({ createdAt: -1 })
      .populate("room", "roomNumber")
      .populate("dayDoctor", "name phone shift")
      .populate("dayCaretaker", "name phone shift")
      .populate("nightDoctor", "name phone shift")
      .populate("nightCaretaker", "name phone shift");

    const data = await Promise.all(
      residents.map(async (resident) => {
        const family = await FamilyMember.findOne({
          residentId: resident._id,
        }).populate("userId", "name email phone");

        return {
          ...resident.toObject(),
          family: family
            ? {
                name: family.userId.name,
                email: family.userId.email,
                phone: family.userId.phone,
                relation: family.relation,
              }
            : null,
        };
      }),
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Resident By ID
// ===============================
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("room", "roomNumber")
      .populate("dayDoctor", "name phone")
      .populate("dayCaretaker", "name phone")
      .populate("nightDoctor", "name phone")
      .populate("nightCaretaker", "name phone");
    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Resident
// ===============================
const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    
    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }
    
    const previousStatus = resident.status;
    // ==========================
    // Resident Discharge
    // ==========================
    if (req.body.status === "Discharged" && resident.status !== "Discharged") {
      if (resident.room) {
        const room = await Room.findById(resident.room);

        if (room) {
          room.occupiedBeds--;

          if (room.occupiedBeds < 0) {
            room.occupiedBeds = 0;
          }

          if (room.occupiedBeds < room.capacity) {
            room.status = "Available";
          }

          await room.save();
        }
      }

      resident.room = null;
    }

    // ==========================
    // Room Changed
    // ==========================
    else if (resident.room && resident.room.toString() !== req.body.room) {
      // Old Room
      const oldRoom = await Room.findById(resident.room);

      if (oldRoom) {
        oldRoom.occupiedBeds--;

        if (oldRoom.occupiedBeds < 0) {
          oldRoom.occupiedBeds = 0;
        }

        if (oldRoom.occupiedBeds < oldRoom.capacity) {
          oldRoom.status = "Available";
        }

        await oldRoom.save();
      }

      // New Room
      const newRoom = await Room.findById(req.body.room);

      if (!newRoom) {
        return res.status(404).json({
          message: "New Room Not Found",
        });
      }

      if (newRoom.occupiedBeds >= newRoom.capacity) {
        return res.status(400).json({
          message: "Room Full",
        });
      }

      newRoom.occupiedBeds++;

      if (newRoom.occupiedBeds >= newRoom.capacity) {
        newRoom.status = "Occupied";
      }

      await newRoom.save();

      resident.room = req.body.room;
    }

    // ==========================
    // Update Resident
    // ==========================
    resident.name = req.body.name;
    resident.age = req.body.age;
    resident.gender = req.body.gender;

    if (req.body.status !== "Discharged") {
      resident.room = req.body.room;
    }

    resident.medicalCondition = req.body.medicalCondition;
    resident.status = req.body.status;
    const becomingActive =
  previousStatus !== "Active" &&
  resident.status === "Active";

if (becomingActive) {

  const dayCaretakerOnLeave = await isCaretakerOnLeave(
    resident.dayCaretaker
  );

  if (dayCaretakerOnLeave) {
  const newDayCaretaker = await getAvailableCaretaker(
    "Day",
    "dayCaretaker",
    resident.dayCaretaker,
  );

  if (!newDayCaretaker) {
    return res.status(400).json({
      message:
        "Day caretaker leave par chhe ane bijo available Day caretaker nathi.",
    });
  }

  resident.dayCaretaker = newDayCaretaker._id;
}

  const nightCaretakerOnLeave =
    await isCaretakerOnLeave(
      resident.nightCaretaker
    );

  if (nightCaretakerOnLeave) {
  const newNightCaretaker = await getAvailableCaretaker(
    "Night",
    "nightCaretaker",
    resident.nightCaretaker,
  );

  if (!newNightCaretaker) {
    return res.status(400).json({
      message:
        "Night caretaker leave par chhe ane bijo available Night caretaker nathi.",
    });
  }

  resident.nightCaretaker = newNightCaretaker._id;
}

}

    await resident.save();

    // ==========================
    // Update Family
    // ==========================
    const family = await FamilyMember.findOne({
      residentId: resident._id,
    });

    if (family) {
      family.relation = req.body.relation;

      await family.save();

      await User.findByIdAndUpdate(family.userId, {
        name: req.body.familyName,
        email: req.body.familyEmail,
        phone: req.body.familyPhone,
      });
    }

    res.status(200).json({
      message: "Resident Updated Successfully",
      resident,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// Delete Resident
// ===============================
const deleteResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        message: "Resident Not Found",
      });
    }

    // Room Update
    const room = await Room.findById(resident.room);

    if (room) {
      room.occupiedBeds--;

      if (room.occupiedBeds < 0) {
        room.occupiedBeds = 0;
      }

      room.status = "Available";

      await room.save();
    }

    const family = await FamilyMember.findOne({
      residentId: resident._id,
    });

    if (family) {
      const totalLinks = await FamilyMember.countDocuments({
        userId: family.userId,
      });

      await FamilyMember.findByIdAndDelete(family._id);

      if (totalLinks === 1) {
        await User.findByIdAndDelete(family.userId);
      }
    }
    // Delete Resident
    await Resident.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Resident Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecentResidents = async (req, res) => {
  try {
    const residents = await Resident.find()
      .populate("room")
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const isCaretakerOnLeave = async (caretakerId) => {
  if (!caretakerId) {
    return false;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const leave = await LeaveRequest.findOne({
    caretakerId,
    status: "Approved",

    // Leave range overlaps with today's date
    fromDate: {
      $lt: tomorrowStart,
    },

    toDate: {
      $gte: todayStart,
    },
  });

  return Boolean(leave);
};

const getAvailableCaretaker = async (
  shift,
  residentField,
  excludedCaretakerId = null,
) => {
  const caretakers = await Staff.find({
    role: "Caretaker",
    shift,
    ...(excludedCaretakerId && {
      _id: {
        $ne: excludedCaretakerId,
      },
    }),
  });

  const availableCaretakers = [];

  for (const caretaker of caretakers) {
    const onLeave = await isCaretakerOnLeave(caretaker._id);

    if (!onLeave) {
      const residentCount = await Resident.countDocuments({
        [residentField]: caretaker._id,
        status: "Active",
      });

      availableCaretakers.push({
        caretaker,
        residentCount,
      });
    }
  }

  availableCaretakers.sort(
    (first, second) =>
      first.residentCount - second.residentCount,
  );

  return availableCaretakers.length
    ? availableCaretakers[0].caretaker
    : null;
};

module.exports = {
  addResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
  getRecentResidents,
};
