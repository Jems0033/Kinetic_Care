require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is Running...");
});


const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

const residentRoutes = require("./routes/residentRoutes");

app.use("/api/residents", residentRoutes);

const dashboardRoutes=require("./routes/dashboardRoutes");

app.use("/api/dashboard",dashboardRoutes);

const staffRoutes = require("./routes/staffRoutes");

app.use("/api/staff", staffRoutes);

const roomRoutes = require("./routes/roomRoutes");
app.use("/api/rooms", roomRoutes);

const donorRoutes = require("./routes/donorRoutes");
app.use("/api/donors", donorRoutes);

const medicalRoutes = require("./routes/medicalRoutes");
app.use("/api/medical", medicalRoutes);

const visitorRoutes = require("./routes/visitorRoutes");
app.use("/api/visitors", visitorRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

const familyMemberRoutes = require("./routes/familyMemberRoutes");
app.use("/api/family-members", familyMemberRoutes);

const familyDashboardRoutes = require("./routes/familyDashboardRoutes");
app.use("/api/family-dashboard", familyDashboardRoutes);

const doctorRoutes = require("./routes/doctorRoutes");

app.use("/api/doctor", doctorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});