import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

function Home() {

  const navigate = useNavigate();

  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          Kinetic<span>Care</span>
        </div>

        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

      </nav>

      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-left">

          <h1>
            Smart Old Age Home
            <br />
            Management System
          </h1>

          <p>
            Caring for senior citizens with technology,
            compassion and modern healthcare management.
          </p>

          <div className="hero-btns">

            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <a href="#about">
              <button className="secondary-btn">
                Learn More
              </button>
            </a>

            <button
              className="primary-btn"
              onClick={() => navigate("/donate")}
            >
              Donate
            </button>

          </div>

        </div>

        <div className="hero-right">

          <img
            src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=900"
            alt="Old Age Home"
          />

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section className="about" id="about">

        <h2>About Kinetic Care</h2>

        <p>
          Kinetic Care is a smart old age home management
          system developed to simplify resident management,
          medical records, staff management, room allocation
          and family communication.
        </p>

        <div className="about-boxes">

          <div className="about-card">
            <h3>👴 Residents</h3>
            <p>
              Manage resident profiles and personal details.
            </p>
          </div>

          <div className="about-card">
            <h3>💊 Healthcare</h3>
            <p>
              Store medical history and medicines.
            </p>
          </div>

          <div className="about-card">
            <h3>👨‍⚕️ Staff</h3>
            <p>
              Manage doctors, nurses and caretakers.
            </p>
          </div>

        </div>

      </section>

      {/* ================= SERVICES ================= */}

      <section className="services" id="services">

        <h2>Our Services</h2>

        <div className="service-grid">

          <div className="service-card">
            <h3>Resident Management</h3>
            <p>
              Complete resident profile with room allocation.
            </p>
          </div>

          <div className="service-card">
            <h3>Medical Records</h3>
            <p>
              Store diseases, medicines and doctor reports.
            </p>
          </div>

          <div className="service-card">
            <h3>Staff Management</h3>
            <p>
              Manage doctors, nurses and employees.
            </p>
          </div>

          <div className="service-card">
            <h3>Room Management</h3>
            <p>
              Track available and occupied rooms.
            </p>
          </div>

          <div className="service-card">
            <h3>Visitor Management</h3>
            <p>
              Keep visitor records securely.
            </p>
          </div>

          <div className="service-card">
            <h3>Payment Records</h3>
            <p>
              Maintain payment and fee details.
            </p>
          </div>

        </div>

      </section>
            {/* ================= WHY CHOOSE US ================= */}

      <section className="why-us">

        <h2>Why Choose Kinetic Care?</h2>

        <div className="why-grid">

          <div className="why-card">
            <h3>24/7 Care</h3>
            <p>
              Professional doctors, nurses and caretakers are
              available round the clock.
            </p>
          </div>

          <div className="why-card">
            <h3>Safe Environment</h3>
            <p>
              Secure rooms with emergency support and CCTV
              monitoring.
            </p>
          </div>

          <div className="why-card">
            <h3>Medical Support</h3>
            <p>
              Daily health monitoring, medicines and doctor
              visits.
            </p>
          </div>

          <div className="why-card">
            <h3>Family Connection</h3>
            <p>
              Family members can check resident details and
              stay connected anytime.
            </p>
          </div>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section className="contact" id="contact">

        <h2>Contact Us</h2>

        <div className="contact-container">

          <div className="contact-box">

            <h3>Address</h3>

            <p>
              Kinetic Care Old Age Home
            </p>

            <p>
              Ahmedabad, Gujarat
            </p>

          </div>

          <div className="contact-box">

            <h3>Email</h3>

            <p>
              kineticcare@gmail.com
            </p>

          </div>

          <div className="contact-box">

            <h3>Phone</h3>

            <p>
              +91 9876543210
            </p>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <h2>Kinetic Care</h2>

        <p>
          Smart Old Age Home Management System
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>

    </div>
  );
}

export default Home;