const express = require("express");
const router = express.Router();
const protect=require("../middleware/authMiddleware");


const { registerUser, getUsers, loginUser ,forgotPassword} = require("../controllers/userController");
router.post("/register", registerUser);
router.get("/", getUsers);
router.post("/register", registerUser);
router.get("/profile",protect,(req,res)=>{

res.json({
message:"Profile",
user:req.user
});

});
router.post("/login", loginUser);
router.post(
  "/forgot-password",
  forgotPassword
);
module.exports = router;