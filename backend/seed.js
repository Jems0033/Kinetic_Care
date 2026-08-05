require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// =============================
// Models
// =============================

const User = require("./models/User");
const Staff = require("./models/Staff");
const Room = require("./models/Room");
const Resident = require("./models/Resident");
const FamilyMember = require("./models/FamilyMember");
const MedicalRecord = require("./models/MedicalRecord");
const CareRecord = require("./models/CareRecord");
const Visitor = require("./models/Visitor");
const Donor = require("./models/Donor");
const Event = require("./models/Event");

// =============================
// Main Seed Function
// =============================

const seedDatabase = async () => {
  try {
    // MongoDB connection
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected...");

    // =============================
    // Delete Old Data
    // =============================

    await Promise.all([
      CareRecord.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Visitor.deleteMany({}),
      FamilyMember.deleteMany({}),
      Resident.deleteMany({}),
      Room.deleteMany({}),
      Staff.deleteMany({}),
      User.deleteMany({}),
      Donor.deleteMany({}),
      Event.deleteMany({}),
    ]);

    console.log("Old sample data deleted...");

    // =============================
    // Common Password
    // =============================

    const hashedPassword = await bcrypt.hash("Test@123", 10);

    // =============================
    // Admin User
    // =============================

    const admin = await User.create({
      name: "Kinetic Care Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      phone: "9876500001",
    });

    console.log("Admin created:", admin.email);

    // =============================
    // Doctor Users
    // =============================

    const doctorUserData = [
      {
        name: "Rajesh Patel",
        email: "doctor@gmail.com",
        phone: "9876500002",
        gender: "Male",
        shift: "Morning",
        salary: 65000,
      },
      {
        name: "Dr. Neha Shah",
        email: "neha@gmail.com",
        phone: "9876500003",
        gender: "Female",
        shift: "Morning",
        salary: 68000,
      },
      {
        name: "Dr. Amit Mehta",
        email: "amit@gmail.com",
        phone: "9876500004",
        gender: "Male",
        shift: "Night",
        salary: 70000,
      },
      {
        name: "Dr. Priya Desai",
        email: "priya@gmail.com",
        phone: "9876500005",
        gender: "Female",
        shift: "Night",
        salary: 72000,
      },
    ];

    const doctors = [];

    for (const doctorData of doctorUserData) {
      const user = await User.create({
        name: doctorData.name,
        email: doctorData.email,
        password: hashedPassword,
        role: "doctor",
        phone: doctorData.phone,
      });

      const staff = await Staff.create({
        userId: user._id,
        name: doctorData.name,
        role: "Doctor",
        phone: doctorData.phone,
        gender: doctorData.gender,
        shift: doctorData.shift,
        salary: doctorData.salary,
      });

      doctors.push(staff);
    }

    console.log(`${doctors.length} doctors created...`);

    // =============================
    // Caretaker Users
    // =============================

    const caretakerUserData = [
      {
        name: "Suresh Parmar",
        email: "caretaker@gmail.com",
        phone: "9876500010",
        gender: "Male",
        shift: "Morning",
        salary: 28000,
      },
      {
        name: "Kavita Joshi",
        email: "kavita@gmail.com",
        phone: "9876500011",
        gender: "Female",
        shift: "Morning",
        salary: 30000,
      },
      {
        name: "Manish Solanki",
        email: "manish@gmail.com",
        phone: "9876500012",
        gender: "Male",
        shift: "Morning",
        salary: 29000,
      },
      {
        name: "Rekha Trivedi",
        email: "rekha@gmail.com",
        phone: "9876500013",
        gender: "Female",
        shift: "Night",
        salary: 32000,
      },
      {
        name: "Vijay Chauhan",
        email: "vijay@gmail.com",
        phone: "9876500014",
        gender: "Male",
        shift: "Night",
        salary: 31000,
      },
      {
        name: "Pooja Rana",
        email: "pooja01@gmail.com",
        phone: "9876500015",
        gender: "Female",
        shift: "Night",
        salary: 32500,
      },
    ];

    const caretakers = [];

    for (const caretakerData of caretakerUserData) {
      const user = await User.create({
        name: caretakerData.name,
        email: caretakerData.email,
        password: hashedPassword,
        role: "staff",
        phone: caretakerData.phone,
      });

      const staff = await Staff.create({
        userId: user._id,
        name: caretakerData.name,
        role: "Caretaker",
        phone: caretakerData.phone,
        gender: caretakerData.gender,
        shift: caretakerData.shift,
        salary: caretakerData.salary,
      });

      caretakers.push(staff);
    }

    console.log(`${caretakers.length} caretakers created...`);

    // Separate staff by shifts
    const morningDoctors = doctors.filter(
      (doctor) => doctor.shift === "Morning"
    );

    const nightDoctors = doctors.filter(
      (doctor) => doctor.shift === "Night"
    );

    const morningCaretakers = caretakers.filter(
      (caretaker) => caretaker.shift === "Morning"
    );

    const nightCaretakers = caretakers.filter(
      (caretaker) => caretaker.shift === "Night"
    );

    // =============================
    // Rooms
    // =============================

    /*
      Tara current controller ma:
      Double room totalCapacity = capacity * 2

      Etle:
      Single capacity 1 = 1 resident
      Double capacity 1 = 2 residents
    */

    const rooms = await Room.insertMany([
      {
        roomNumber: "A101",
        roomType: "Single",
        capacity: 1,
        occupiedBeds: 1,
        status: "Occupied",
      },
      {
        roomNumber: "A102",
        roomType: "Single",
        capacity: 1,
        occupiedBeds: 1,
        status: "Occupied",
      },
      {
        roomNumber: "A103",
        roomType: "Single",
        capacity: 1,
        occupiedBeds: 1,
        status: "Occupied",
      },
      {
        roomNumber: "A104",
        roomType: "Single",
        capacity: 1,
        occupiedBeds: 0,
        status: "Available",
      },
      {
        roomNumber: "B201",
        roomType: "Single",
        capacity: 2,
        occupiedBeds: 2,
        status: "Occupied",
      },
      {
        roomNumber: "B202",
        roomType: "Single",
        capacity: 2,
        occupiedBeds: 2,
        status: "Occupied",
      },
      {
        roomNumber: "B203",
        roomType: "Single",
        capacity: 2,
        occupiedBeds: 2,
        status: "Occupied",
      },
      {
        roomNumber: "B204",
        roomType: "Single",
        capacity: 2,
        occupiedBeds: 0,
        status: "Available",
      },
      {
        roomNumber: "C301",
        roomType: "Single",
        capacity: 1,
        occupiedBeds: 0,
        status: "Maintenance",
      },
      {
        roomNumber: "C302",
        roomType: "Single",
        capacity: 1,
        occupiedBeds: 0,
        status: "Available",
      },
    ]);

    console.log(`${rooms.length} rooms created...`);

    // =============================
    // Resident Sample Information
    // =============================

    const residentData = [
      {
        name: "Rameshbhai Patel",
        age: 74,
        gender: "Male",
        medicalCondition: "Diabetes and high blood pressure",
        admissionDate: new Date("2026-01-10"),
        status: "Active",
        roomIndex: 0,
      },
      {
        name: "Shantaben Shah",
        age: 69,
        gender: "Female",
        medicalCondition: "Arthritis",
        admissionDate: new Date("2026-02-15"),
        status: "Active",
        roomIndex: 1,
      },
      {
        name: "Maheshbhai Desai",
        age: 78,
        gender: "Male",
        medicalCondition: "Heart condition",
        admissionDate: new Date("2025-11-20"),
        status: "Active",
        roomIndex: 2,
      },
      {
        name: "Kamlaben Mehta",
        age: 72,
        gender: "Female",
        medicalCondition: "Asthma",
        admissionDate: new Date("2026-03-05"),
        status: "Active",
        roomIndex: 4,
      },
      {
        name: "Haribhai Trivedi",
        age: 81,
        gender: "Male",
        medicalCondition: "Weak eyesight and hypertension",
        admissionDate: new Date("2025-12-18"),
        status: "Active",
        roomIndex: 4,
      },
      {
        name: "Savitaben Joshi",
        age: 76,
        gender: "Female",
        medicalCondition: "Knee pain",
        admissionDate: new Date("2026-01-25"),
        status: "Active",
        roomIndex: 5,
      },
      {
        name: "Dineshbhai Parmar",
        age: 70,
        gender: "Male",
        medicalCondition: "Diabetes",
        admissionDate: new Date("2026-04-12"),
        status: "Active",
        roomIndex: 5,
      },
      {
        name: "Geetaben Rana",
        age: 68,
        gender: "Female",
        medicalCondition: "No major medical condition",
        admissionDate: new Date("2026-05-01"),
        status: "Active",
        roomIndex: 6,
      },
      {
        name: "Bhupendrabhai Solanki",
        age: 79,
        gender: "Male",
        medicalCondition: "Memory loss",
        admissionDate: new Date("2025-10-10"),
        status: "Active",
        roomIndex: 6,
      },
      {
        name: "Nirmalaben Chauhan",
        age: 73,
        gender: "Female",
        medicalCondition: "High blood pressure",
        admissionDate: new Date("2026-02-28"),
        status: "Temporary Leave",
        roomIndex: 7,
      },
    ];

    const residents = [];

    for (let index = 0; index < residentData.length; index++) {
      const data = residentData[index];

      const resident = await Resident.create({
        name: data.name,
        age: data.age,
        gender: data.gender,
        medicalCondition: data.medicalCondition,
        admissionDate: data.admissionDate,
        status: data.status,
        room: rooms[data.roomIndex]._id,

        // Round-robin staff assignment
        morningDoctor:
          morningDoctors[index % morningDoctors.length]._id,

        morningCaretaker:
          morningCaretakers[index % morningCaretakers.length]._id,

        nightDoctor:
          nightDoctors[index % nightDoctors.length]._id,

        nightCaretaker:
          nightCaretakers[index % nightCaretakers.length]._id,
      });

      residents.push(resident);
    }

    console.log(`${residents.length} residents created...`);

    // =============================
    // Family Users and Members
    // =============================

    const familyData = [
      {
        name: "Amit Patel",
        email: "family@gmail.com",
        phone: "9898010001",
        relation: "Son",
      },
      {
        name: "Pooja Shah",
        email: "pooja@gmail.com",
        phone: "9898010002",
        relation: "Daughter",
      },
      {
        name: "Karan Desai",
        email: "karan@gmail.com",
        phone: "9898010003",
        relation: "Son",
      },
      {
        name: "Neeta Mehta",
        email: "neeta@gmail.com",
        phone: "9898010004",
        relation: "Daughter",
      },
      {
        name: "Vishal Trivedi",
        email: "vishal@gmail.com",
        phone: "9898010005",
        relation: "Son",
      },
      {
        name: "Mansi Joshi",
        email: "mansi@gmail.com",
        phone: "9898010006",
        relation: "Daughter",
      },
      {
        name: "Jay Parmar",
        email: "jay@gmail.com",
        phone: "9898010007",
        relation: "Son",
      },
      {
        name: "Rita Rana",
        email: "rita@gmail.com",
        phone: "9898010008",
        relation: "Daughter",
      },
      {
        name: "Dhruv Solanki",
        email: "dhruv@gmail.com",
        phone: "9898010009",
        relation: "Grandson",
      },
      {
        name: "Hetal Chauhan",
        email: "hetal@gmail.com",
        phone: "9898010010",
        relation: "Daughter",
      },
    ];

    const familyUsers = [];

    for (let index = 0; index < familyData.length; index++) {
      const data = familyData[index];

      const familyUser = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "family",
        phone: data.phone,
      });

      await FamilyMember.create({
        userId: familyUser._id,
        residentId: residents[index]._id,
        relation: data.relation,
      });

      familyUsers.push(familyUser);
    }

    console.log(`${familyUsers.length} family members created...`);

    // =============================
    // Medical Records
    // =============================

    const problems = [
      "Blood sugar level was slightly high",
      "Regular blood pressure check",
      "Knee pain during walking",
      "Mild breathing difficulty",
      "Routine health examination",
      "Headache and weakness",
      "Difficulty sleeping",
      "Seasonal cold and cough",
      "Memory and concentration problem",
      "General body pain",
    ];

    const medicines = [
      "Metformin 500mg after meal",
      "Amlodipine 5mg once daily",
      "Calcium tablet once daily",
      "Inhaler when required",
      "Multivitamin once daily",
      "Paracetamol after meal",
      "Sleeping medicine as prescribed",
      "Cough syrup twice daily",
      "Vitamin B12 tablet",
      "Pain relief tablet after meal",
    ];

    const medicalRecords = [];

    for (let index = 0; index < residents.length; index++) {
      const resident = residents[index];
      const doctor = morningDoctors[index % morningDoctors.length];

      const record = await MedicalRecord.create({
        residentId: resident._id,
        staffId: doctor._id,
        doctor: doctor.name,
        problem: problems[index],
        medicine: medicines[index],
        date: new Date(
          Date.now() - index * 24 * 60 * 60 * 1000
        ),
      });

      medicalRecords.push(record);
    }

    console.log(`${medicalRecords.length} medical records created...`);

    // =============================
    // Care Records
    // =============================

    const careRecords = [];

    for (let index = 0; index < residents.length; index++) {
      const resident = residents[index];

      const morningRecord = await CareRecord.create({
        residentId: resident._id,
        caretakerId:
          morningCaretakers[index % morningCaretakers.length]._id,
        shift: "Morning",
        medicine: true,
        meal: true,
        bath: index % 2 === 0,
        walking: true,
        water: true,
        rest: true,
        notes: "Morning routine completed successfully.",
        date: new Date(),
      });

      const nightRecord = await CareRecord.create({
        residentId: resident._id,
        caretakerId:
          nightCaretakers[index % nightCaretakers.length]._id,
        shift: "Night",
        medicine: true,
        meal: true,
        bath: false,
        walking: index % 3 !== 0,
        water: true,
        rest: true,
        notes: "Night care completed. Resident is resting.",
        date: new Date(),
      });

      careRecords.push(morningRecord, nightRecord);
    }

    console.log(`${careRecords.length} care records created...`);

    // =============================
    // Visitors
    // =============================

    const visitorStatuses = [
      "Approved",
      "Pending",
      "Approved",
      "Rejected",
    ];

    const visitors = [];

    for (let index = 0; index < 8; index++) {
      const visitor = await Visitor.create({
        residentId: residents[index]._id,
        visitorName: familyData[index].name,
        phone: familyData[index].phone,
        relation: familyData[index].relation,
        purpose: "Regular family meeting",
        visitDate: new Date(
          Date.now() + (index + 1) * 24 * 60 * 60 * 1000
        ),
        status: visitorStatuses[index % visitorStatuses.length],
        checkIn: new Date(),
        checkOut:
          index % 2 === 0
            ? new Date(Date.now() + 60 * 60 * 1000)
            : undefined,
      });

      visitors.push(visitor);
    }

    console.log(`${visitors.length} visitor records created...`);

    // =============================
    // Donors
    // =============================

    const donors = await Donor.insertMany([
      {
        name: "Rajesh Shah",
        phone: "9825011101",
        email: "rajesh@gmail.com",
        amount: 25000,
        donationType: "Money",
        donationDate: new Date("2026-07-01"),
        address: "Satellite, Ahmedabad",
      },
      {
        name: "Mehul Patel",
        phone: "9825011102",
        email: "mehul@gmail.com",
        amount: 10000,
        donationType: "Food",
        donationDate: new Date("2026-07-08"),
        address: "Bopal, Ahmedabad",
      },
      {
        name: "Nisha Desai",
        phone: "9825011103",
        email: "nisha@gmail.com",
        amount: 15000,
        donationType: "Medicine",
        donationDate: new Date("2026-07-12"),
        address: "Navrangpura, Ahmedabad",
      },
      {
        name: "Kiran Foundation",
        phone: "9825011104",
        email: "kiran.foundation@gmail.com",
        amount: 30000,
        donationType: "Clothes",
        donationDate: new Date("2026-07-20"),
        address: "Maninagar, Ahmedabad",
      },
      {
        name: "Anand Charitable Trust",
        phone: "9825011105",
        email: "anandtrust@gmail.com",
        amount: 50000,
        donationType: "Money",
        donationDate: new Date("2026-07-25"),
        address: "Prahlad Nagar, Ahmedabad",
      },
    ]);

    console.log(`${donors.length} donors created...`);

    // =============================
    // Events
    // =============================

    const events = await Event.insertMany([
      {
        title: "Independence Day Celebration",
        description:
          "Flag hoisting, cultural activities and breakfast for residents.",
        date: new Date("2026-08-15"),
        time: "08:00 AM",
        location: "Kinetic Care Main Garden",
      },
      {
        title: "Monthly Health Check-up",
        description:
          "Complete health check-up for all active residents.",
        date: new Date("2026-08-20"),
        time: "10:00 AM",
        location: "Medical Room",
      },
      {
        title: "Family Meeting Day",
        description:
          "Family members can meet residents and discuss their care.",
        date: new Date("2026-08-23"),
        time: "11:00 AM",
        location: "Visitor Hall",
      },
      {
        title: "Yoga and Meditation",
        description:
          "Light yoga and guided meditation session for residents.",
        date: new Date("2026-08-27"),
        time: "07:30 AM",
        location: "Activity Hall",
      },
      {
        title: "Music Evening",
        description:
          "Music, singing and entertainment programme for residents.",
        date: new Date("2026-08-30"),
        time: "05:30 PM",
        location: "Community Hall",
      },
    ]);

    console.log(`${events.length} events created...`);

    // =============================
    // Final Summary
    // =============================

    console.log("\n=================================");
    console.log("DATABASE SEEDED SUCCESSFULLY");
    console.log("=================================");
    console.log(`Admin: ${admin.email}`);
    console.log(`Doctors: ${doctors.length}`);
    console.log(`Caretakers: ${caretakers.length}`);
    console.log(`Rooms: ${rooms.length}`);
    console.log(`Residents: ${residents.length}`);
    console.log(`Family Members: ${familyUsers.length}`);
    console.log(`Medical Records: ${medicalRecords.length}`);
    console.log(`Care Records: ${careRecords.length}`);
    console.log(`Visitors: ${visitors.length}`);
    console.log(`Donors: ${donors.length}`);
    console.log(`Events: ${events.length}`);
    console.log("=================================");
    console.log("Common password: Test@123");
    console.log("=================================\n");
  } catch (error) {
    console.error("Seed error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedDatabase();