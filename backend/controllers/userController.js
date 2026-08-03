const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
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
      users
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
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
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Kinetic Care - Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing:4px;color:#1f9d74;">
          ${otp}
        </h1>

        <p>This OTP is valid for 5 minutes.</p>

        <br>

        <p>Kinetic Care</p>
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

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

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