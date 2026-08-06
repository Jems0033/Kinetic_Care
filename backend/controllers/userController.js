const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Staff = require("../models/Staff");

// Login User
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // const currentHour = new Date().getHours();

    // // day : 6 AM - 5:59 PM
    // // Night : 6 PM - 5:59 AM

    // if (user.role === "staff" || user.role === "doctor") {
    //   const staff = await Staff.findOne({ userId: user._id });

    //   if (!staff) {
    //     return res.status(404).json({
    //       message: "Staff not found",
    //     });
    //   }

    //   const isdayTime = currentHour >= 6 && currentHour < 18;

    //   if (staff.shift === "day" && !isdayTime) {
    //     return res.status(403).json({
    //       message:
    //         "You are assigned to the day shift. Please login between 6:00 AM and 6:00 PM.",
    //     });
    //   }

    //   if (staff.shift === "Night" && isdayTime) {
    //     return res.status(403).json({
    //       message:
    //         "You are assigned to the Night shift. Please login between 6:00 PM and 6:00 AM.",
    //     });
    //   }
    // }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    email = email.toLowerCase().trim();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    await transporter.sendMail({
      from: `"Kinetic Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Kinetic Care Password",

      html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
  </head>

  <body style="
    margin:0;
    padding:0;
    background-color:#f4f7f6;
    font-family:Arial, Helvetica, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0" 
      style="background-color:#f4f7f6; padding:40px 15px;">
      
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="100%" cellpadding="0" cellspacing="0"
            style="
              max-width:550px;
              background:#ffffff;
              border-radius:14px;
              overflow:hidden;
              box-shadow:0 4px 15px rgba(0,0,0,0.08);
            "
          >

            <!-- Header -->
            <tr>
              <td align="center" style="
                background:#1f9d74;
                padding:30px 20px;
              ">

                <!-- LOGO -->
                <img
                  src="https://raw.githubusercontent.com/Jems0033/Kinetic_Care/main/frontend/public/logo.png"
                  alt="Kinetic Care"
                  width="75"
                  style="
                    display:block;
                    margin-bottom:12px;
                  "
                />

                <h1 style="
                  color:#ffffff;
                  margin:0;
                  font-size:26px;
                  letter-spacing:0.5px;
                ">
                  Kinetic Care
                </h1>

                <p style="
                  color:#dff5ed;
                  margin:7px 0 0;
                  font-size:14px;
                ">
                  Caring Today. Comforting Tomorrow.
                </p>

              </td>
            </tr>


            <!-- Content -->
            <tr>
              <td style="padding:35px 40px;">

                <h2 style="
                  color:#222222;
                  margin-top:0;
                  font-size:22px;
                ">
                  Password Reset Request
                </h2>

                <p style="
                  color:#555555;
                  font-size:15px;
                  line-height:1.6;
                ">
                  Hello ${user.name},
                </p>

                <p style="
                  color:#555555;
                  font-size:15px;
                  line-height:1.6;
                ">
                  We received a request to reset the password for your
                  <strong>Kinetic Care</strong> account.
                </p>

                <p style="
                  color:#555555;
                  font-size:15px;
                  line-height:1.6;
                ">
                  Please use the verification code below to continue:
                </p>


                <!-- OTP BOX -->
                <div style="
                  background:#f0faf6;
                  border:1px solid #ccebdd;
                  border-radius:10px;
                  padding:20px;
                  text-align:center;
                  margin:25px 0;
                ">

                  <p style="
                    margin:0 0 10px;
                    color:#666666;
                    font-size:13px;
                    text-transform:uppercase;
                    letter-spacing:1px;
                  ">
                    Verification Code
                  </p>

                  <div style="
                    font-size:34px;
                    font-weight:bold;
                    letter-spacing:10px;
                    color:#1f9d74;
                  ">
                    ${otp}
                  </div>

                </div>


                <p style="
                  text-align:center;
                  color:#777777;
                  font-size:14px;
                ">
                  This code will expire in
                  <strong style="color:#333333;">5 minutes</strong>.
                </p>


                <!-- Security Warning -->
                <div style="
                  background:#fff8e6;
                  border-left:4px solid #f0b429;
                  padding:12px 15px;
                  margin-top:25px;
                  border-radius:4px;
                ">

                  <p style="
                    margin:0;
                    color:#665c3d;
                    font-size:13px;
                    line-height:1.5;
                  ">
                    🔒 <strong>Security Notice:</strong>
                    Never share this OTP with anyone. Kinetic Care
                    will never ask you for your OTP or password.
                  </p>

                </div>


                <p style="
                  color:#777777;
                  font-size:13px;
                  line-height:1.6;
                  margin-top:25px;
                ">
                  If you did not request a password reset, you can safely
                  ignore this email. Your account password will remain
                  unchanged.
                </p>

              </td>
            </tr>


            <!-- Footer -->
            <tr>
              <td align="center" style="
                background:#f8faf9;
                border-top:1px solid #eeeeee;
                padding:22px;
              ">

                <p style="
                  margin:0 0 5px;
                  color:#1f9d74;
                  font-weight:bold;
                  font-size:15px;
                ">
                  Kinetic Care
                </p>

                <p style="
                  margin:0;
                  color:#999999;
                  font-size:12px;
                ">
                  Old Age Home Management System
                </p>

                <p style="
                  margin:8px 0 0;
                  color:#aaaaaa;
                  font-size:11px;
                ">
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
  `,
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.resetOTP || !user.resetOTPExpire) {
      return res.status(400).json({
        message: "Please request a new OTP",
      });
    }

    if (new Date() > user.resetOTPExpire) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      message: "OTP Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.resetOTP || !user.resetOTPExpire) {
      return res.status(400).json({
        message: "Please request a new OTP",
      });
    }

    if (new Date() > user.resetOTPExpire) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetOTP = null;
    user.resetOTPExpire = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  registerUser,
  getUsers,
  loginUser,
  resetPassword,
  sendResetOTP,
  verifyResetOTP,
};
