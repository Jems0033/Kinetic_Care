import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    FaUserAlt,
    FaBed,
    FaHeartbeat,
    FaCalendarAlt,
    FaDonate,
    FaUserMd,
    FaPhoneAlt
} from "react-icons/fa";

import "../css/FamilyDashboard.css";
const bookVisit = async (req, res) => {

    try {

        const userId = req.user.id;

        const family = await FamilyMember.findOne({ userId });

        if (!family) {
            return res.status(404).json({
                message: "Family Member Not Found"
            });
        }

        const {
            visitorName,
            phone,
            relation,
            purpose,
            visitDate
        } = req.body;

        const visitor = await Visitor.create({

            residentId: family.residentId,

            visitorName,

            phone,

            relation,

            purpose,

            visitDate

        });

        res.status(201).json({
            message: "Visit Booked Successfully",
            visitor
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

function FamilyDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({

        resident: {},

        medicalCount: 0,

        eventCount: 0,

        latestMedical: {}

    });

    useEffect(() => {

        getDashboard();

    }, []);

    const getDashboard = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                "http://localhost:5000/api/family/dashboard",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setDashboard(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="family-dashboard">

            <div className="welcome-section">

                <h1>

                    Welcome Family 👋

                </h1>

                <p>

                    Stay connected with your loved one anytime.

                </p>

            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <FaUserAlt className="card-icon" />

                    <h3>Resident</h3>

                    <h2>

                        {dashboard.resident.name || "-"}

                    </h2>

                </div>

                <div className="dashboard-card">

                    <FaBed className="card-icon" />

                    <h3>Room</h3>

                    <h2>

                        {dashboard.resident.room || "-"}

                    </h2>

                </div>

                <div className="dashboard-card">

                    <FaHeartbeat className="card-icon" />

                    <h3>Medical</h3>

                    <h2>

                        {dashboard.medicalCount}

                    </h2>

                </div>

                <div className="dashboard-card">

                    <FaCalendarAlt className="card-icon" />

                    <h3>Events</h3>

                    <h2>

                        {dashboard.eventCount}

                    </h2>

                </div>

            </div>
            <div className="dashboard-content">

                {/* Resident Profile */}

                <div className="dashboard-box">

                    <div className="box-header">

                        <h2>👴 Resident Profile</h2>

                    </div>

                    <div className="resident-profile">

                        <div className="resident-image">

                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="Resident"
                            />

                        </div>

                        <div className="resident-details">

                            <p><strong>Name :</strong> {dashboard.resident.name}</p>

                            <p><strong>Age :</strong> {dashboard.resident.age}</p>

                            <p><strong>Gender :</strong> {dashboard.resident.gender}</p>

                            <p><strong>Room :</strong> {dashboard.resident.room}</p>

                        </div>

                    </div>

                </div>


                {/* Latest Medical */}

                <div className="dashboard-box">

                    <div className="box-header">

                        <h2>💊 Latest Medical Record</h2>

                    </div>

                    <div className="medical-details">

                        <p>

                            <strong>Doctor :</strong>

                            {dashboard.latestMedical?.doctor || "-"}

                        </p>

                        <p>

                            <strong>Problem :</strong>

                            {dashboard.latestMedical?.problem || "-"}

                        </p>

                        <p>

                            <strong>Medicine :</strong>

                            {dashboard.latestMedical?.medicine || "-"}

                        </p>

                        <p>

                            <strong>Date :</strong>

                            {dashboard.latestMedical?.date
                                ? new Date(
                                    dashboard.latestMedical.date
                                ).toLocaleDateString()
                                : "-"}

                        </p>

                    </div>

                </div>


                {/* Upcoming Events */}

                <div className="dashboard-box">

                    <div className="box-header">

                        <h2>🎉 Upcoming Events</h2>

                    </div>

                    <div className="event-box">

                        <h3>

                            Total Upcoming Events

                        </h3>

                        <span>

                            {dashboard.eventCount}

                        </span>

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="dashboard-box">

                    <div className="box-header">

                        <h2>⚡ Quick Actions</h2>

                    </div>

                    <div className="quick-actions">

                        <button onClick={() => navigate("/family/book-visit")}>
    <FaCalendarAlt />
    Book Visit
</button>

                        <button>

                            <FaDonate />

                            Donate

                        </button>

                        <button>

                            <FaHeartbeat />

                            Medical History

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default FamilyDashboard;