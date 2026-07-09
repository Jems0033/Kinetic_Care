const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login User
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );


    res.json({
      message:"Login Successful",
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    });


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
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
      role,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  }catch (error) {

    console.log("ERROR:", error);

    res.status(500).json({
        message: error.message
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

module.exports = {
  registerUser,
  getUsers,
  loginUser
};
