import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

import {
  FaArrowRight,
  FaUserFriends,
  FaNotesMedical,
  FaUserMd,
  FaBed,
  FaWalking,
  FaHeart,
  FaShieldAlt,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home">
      {/* NAVBAR */}

      <nav className="home-navbar">
        <div className="home-logo">
          <img src="/logo.png" alt="Kinetic Care" />

          <h2>
            Kinetic<span>Care</span>
          </h2>
        </div>

        <ul className={`home-nav-links ${menuOpen ? "nav-open" : ""}`}>
          <li>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
          </li>

          <li>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </li>

          <li>
            <a href="#services" onClick={() => setMenuOpen(false)}>
              Services
            </a>
          </li>

          <li>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <button
            type="button"
            className="nav-donate-btn"
            onClick={() =>
              navigate("/donate", {
                state: {
                  from: "home",
                },
              })
            }
          >
            <FaHeart />
            Donate
          </button>

          <button
            type="button"
            className="nav-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <button
          type="button"
          className="home-menu-btn"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* HERO */}

      <section className="home-hero" id="home">
        <div className="hero-content">
          <div className="hero-badge">
            <FaHeart />
            Compassionate Elderly Care
          </div>

          <h1>
            A better place to
            <span> care, connect and live.</span>
          </h1>

          <p>
            Kinetic Care combines compassionate elderly care with modern
            technology to manage health, rooms, visits, staff and family
            communication from one trusted platform.
          </p>

          <div className="hero-actions">
            <button
              className="hero-primary-btn"
              onClick={() => navigate("/login")}
            >
              Login to Portal
              <FaArrowRight />
            </button>

            <a href="#about" className="hero-secondary-btn">
              Explore Kinetic Care
            </a>
          </div>

          <div className="hero-trust">
            <div>
              <FaCheckCircle />
              Safe Environment
            </div>

            <div>
              <FaCheckCircle />
              Medical Support
            </div>

            <div>
              <FaCheckCircle />
              Family Connection
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?w=1000"
              alt="Senior care"
            />

            <div className="hero-floating-card care-card">
              <div>
                <FaClock />
              </div>

              <span>
                <strong>24/7 Care</strong>
                Professional support
              </span>
            </div>

            <div className="hero-floating-card medical-floating">
              <div>
                <FaNotesMedical />
              </div>

              <span>
                <strong>Health First</strong>
                Medical monitoring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="home-stats">
        <div>
          <strong>24/7</strong>
          <span>Resident Care</span>
        </div>

        <div>
          <strong>100%</strong>
          <span>Care Focused</span>
        </div>

        <div>
          <strong>Easy</strong>
          <span>Family Access</span>
        </div>

        <div>
          <strong>Smart</strong>
          <span>Health Records</span>
        </div>
      </section>

      {/* ABOUT */}

      <section className="home-about" id="about">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1576765608622-067973a79f53?w=1000"
            alt="Elderly care"
          />

          <div className="about-experience-card">
            <FaHeart />

            <div>
              <strong>Care with dignity</strong>
              <span>Because every life matters</span>
            </div>
          </div>
        </div>

        <div className="about-content">
          <p className="home-section-label">About Kinetic Care</p>

          <h2>Technology that supports human-centered care.</h2>

          <p>
            Kinetic Care is a smart old age home management system designed to
            simplify daily operations while keeping residents' comfort, health
            and family connection at the center.
          </p>

          <div className="about-feature-list">
            <div>
              <FaCheckCircle />

              <span>Resident profiles and room management</span>
            </div>

            <div>
              <FaCheckCircle />

              <span>Medical records and doctor access</span>
            </div>

            <div>
              <FaCheckCircle />

              <span>Family visits and health updates</span>
            </div>

            <div>
              <FaCheckCircle />

              <span>Donation and visitor management</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}

      <section className="home-services" id="services">
        <div className="section-heading-center">
          <p className="home-section-label">What We Manage</p>

          <h2>Smart Care Services</h2>

          <span>
            Everything needed for efficient and compassionate elderly care.
          </span>
        </div>

        <div className="home-service-grid">
          <div className="home-service-card">
            <div className="service-icon resident-service">
              <FaUserFriends />
            </div>

            <h3>Resident Management</h3>

            <p>
              Maintain resident profiles, room details, status and family
              information.
            </p>
          </div>

          <div className="home-service-card">
            <div className="service-icon medical-service">
              <FaNotesMedical />
            </div>

            <h3>Medical Records</h3>

            <p>
              Track health conditions, medicines and doctor treatment records.
            </p>
          </div>

          <div className="home-service-card">
            <div className="service-icon staff-service">
              <FaUserMd />
            </div>

            <h3>Staff Management</h3>

            <p>
              Manage doctors, nurses, caretakers and daily staff
              responsibilities.
            </p>
          </div>

          <div className="home-service-card">
            <div className="service-icon room-service">
              <FaBed />
            </div>

            <h3>Room Management</h3>

            <p>Track room capacity, occupancy and availability in real time.</p>
          </div>

          <div className="home-service-card">
            <div className="service-icon visitor-service">
              <FaWalking />
            </div>

            <h3>Visitor Management</h3>

            <p>
              Record family visits, check-in and checkout information securely.
            </p>
          </div>

          <div className="home-service-card">
            <div className="service-icon donation-service">
              <FaHeart />
            </div>

            <h3>Donations</h3>

            <p>
              Support residents through monetary or essential item donations.
            </p>
          </div>
        </div>
      </section>

      {/* WHY US */}

      <section className="home-why-us">
        <div className="section-heading-center">
          <p className="home-section-label">Why Kinetic Care</p>

          <h2>Care you can trust</h2>
        </div>

        <div className="home-why-grid">
          <div className="home-why-card">
            <FaClock />

            <h3>24/7 Support</h3>

            <p>
              Dedicated care and assistance for residents throughout the day.
            </p>
          </div>

          <div className="home-why-card">
            <FaShieldAlt />

            <h3>Safe Environment</h3>

            <p>
              Organized rooms, controlled visitor records and resident
              monitoring.
            </p>
          </div>

          <div className="home-why-card">
            <FaNotesMedical />

            <h3>Health Monitoring</h3>

            <p>
              Doctors and medical records remain connected for better resident
              care.
            </p>
          </div>

          <div className="home-why-card">
            <FaUserFriends />

            <h3>Family Connection</h3>

            <p>
              Families can stay updated and connected with their loved ones.
            </p>
          </div>
        </div>
      </section>

      {/* DONATION CTA */}

      <section className="home-donation-cta">
        <div>
          <p>Support Our Residents</p>

          <h2>Your kindness can make someone's day brighter.</h2>

          <span>
            Help us provide food, healthcare, comfort and happiness to elderly
            residents.
          </span>
        </div>

        <button
          onClick={() =>
            navigate("/donate", {
              state: { from: "home" },
            })
          }
        >
          <FaHeart />
          Donate Now
        </button>
      </section>

      {/* CONTACT */}

      <section className="home-contact" id="contact">
        <div className="section-heading-center">
          <p className="home-section-label">Contact Us</p>

          <h2>We're Here to Help</h2>
        </div>

        <div className="home-contact-grid">
          <div className="home-contact-card">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>

            <span>Address</span>

            <strong>Kinetic Care Old Age Home</strong>

            <p>Ahmedabad, Gujarat</p>
          </div>

          <div className="home-contact-card">
            <div className="contact-icon">
              <FaEnvelope />
            </div>

            <span>Email</span>

            <strong>kineticcare@gmail.com</strong>

            <p>Send us your questions anytime</p>
          </div>

          <div className="home-contact-card">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>

            <span>Phone</span>

            <strong>+91 9876543210</strong>

            <p>Contact our support team</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="home-footer">
        <div className="footer-top">
          {/* Logo */}
          <div className="footer-brand">
            <img src="/logo.png" alt="Kinetic Care" />
            <div>
              <h2>
                Kinetic<span>Care</span>
              </h2>
              <p>
                Providing compassionate care, medical support and a safe home
                for every resident.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>

          {/* Services */}
          <div className="footer-column">
            <h3>Our Services</h3>
            <p>Resident Management</p>
            <p>Medical Records</p>
            <p>Room Management</p>
            <p>Visitor Management</p>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h3>Contact Info</h3>
            <p>📍 Ahmedabad, Gujarat</p>
            <p>
              <FaEnvelope /> kineticcare@gmail.com
            </p>
            <p>📞 +91 9876543210</p>
            <p>🕒 24/7 Support</p>
          </div>
        </div>

        <hr />

        <div className="footer-bottom">
          <p>© 2026 Kinetic Care. All Rights Reserved.</p>
          <p>Made with ❤️ for Better Elderly Care</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
