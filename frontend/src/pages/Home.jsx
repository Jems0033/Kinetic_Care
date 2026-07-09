import React, { useState, useEffect } from "react";
import "./Home.css";

// SVG Icons as reusable components for clean rendering without external icon packs
const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SmileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DoubleFlowerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4zm0 12c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8zm-5-6a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3zm13 0a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3z" />
  </svg>
);

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("independent");
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    careLevel: "assisted",
    date: "",
    message: ""
  });

  // Handle scroll to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Care Tiers data
  const careTiers = {
    independent: {
      title: "Independent Living",
      desc: "For seniors who want to enjoy an active, maintenance-free lifestyle with the security of having support nearby whenever they need it. Embrace absolute freedom in a welcoming community.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
      features: [
        "Private luxury cottages",
        "Housekeeping & laundry",
        "Social clubs & excursions",
        "Chef-prepared dining options",
        "Wellness & fitness programs",
        "24/7 emergency response"
      ]
    },
    assisted: {
      title: "Assisted Living",
      desc: "Designed for residents who require some assistance with activities of daily living, such as bathing, dressing, or medication management, while promoting max independence and active living.",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80",
      features: [
        "Personalized care plans",
        "Medication management",
        "Assistance with daily living",
        "Scheduled transportation",
        "Nutritious meals & snacks",
        "Daily physical therapy"
      ]
    },
    memory: {
      title: "Memory Support",
      desc: "A secure, therapeutic environment tailored for residents experiencing Alzheimer's, dementia, or other memory challenges. Our specialist care focuses on maintaining dignity, calming routine, and security.",
      image: "https://images.unsplash.com/photo-1460518451285-cd7afbc11b0b?w=800&auto=format&fit=crop&q=80",
      features: [
        "Specifically trained caregivers",
        "Secure indoor & outdoor spaces",
        "Cognitive therapy activities",
        "High staff-to-resident ratio",
        "Sensory garden activities",
        "Compassionate family support"
      ]
    },
    medical: {
      title: "24/7 Skilled Nursing",
      desc: "Comprehensive around-the-clock medical care for residents with complex health requirements, post-surgical recovery needs, or chronic conditions, managed by registered nurses and therapists.",
      image: "https://images.unsplash.com/photo-1576765589456-5a3983244558?w=800&auto=format&fit=crop&q=80",
      features: [
        "24-hour registered nursing",
        "On-site rehabilitation clinic",
        "Post-hospitalization recovery",
        "Physicians & specialists on-call",
        "IV therapy & wound care",
        "Palliative care support"
      ]
    }
  };

  // Testimonials data
  const testimonials = [
    {
      quote: "Sending my mother to Kinetic Care was the best decision we ever made. The caregivers aren't just employees; they've become like second children to her. She is eating better, laughing more, and feels safe.",
      name: "Eleanor Vance",
      relation: "Daughter of Resident Margaret V.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "I was skeptical about moving into an old age home, but Kinetic Care changed my perspective entirely. I have my own cozy cottage, a library of books to read, and daily card games with my friends. It is indeed a home.",
      name: "Arthur Pendelton",
      relation: "Independent Resident since 2024",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "The specialized memory care team at Kinetic Care has provided my grandfather with peace and routines that have slowed his confusion. Their patience, kindness, and continuous feedback bring our family complete peace of mind.",
      name: "David K. Alvarez",
      relation: "Grandson of Resident Joseph A.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  ];

  // FAQ data
  const faqs = [
    {
      q: "What types of care plans are available, and can they be changed?",
      a: "Yes! We offer a full spectrum of senior care including Independent Living, Assisted Living, Memory Support, and Skilled Nursing. Before a resident moves in, our medical team conducts a detailed assessment to create a personalized care plan. These plans are evaluated quarterly (or sooner if needed) to adjust care levels as health needs change."
    },
    {
      q: "Are family members allowed to visit at any time?",
      a: "Yes, family and friends are always welcome! We believe in keeping families connected. Our main gates are secure, but visiting hours are flexible. We also have private family dining rooms and guest suites available if you would like to host a family dinner or stay overnight."
    },
    {
      q: "What is your staff-to-resident ratio?",
      a: "Our staff-to-resident ratio varies depending on the care level. In our Independent and Assisted Living areas, it is approximately 1:8 during peak hours. In our Memory Support and Skilled Nursing units, the ratio is much higher (around 1:4) to guarantee safety, continuous observation, and rapid response to complex needs."
    },
    {
      q: "How are meals prepared and dietary restrictions managed?",
      a: "All meals are designed by our clinical nutritionist and freshly prepared daily by our on-site culinary chefs. We prioritize organic, locally-sourced ingredients. We fully accommodate all dietary restrictions and allergies, including diabetic-friendly, low-sodium, vegetarian, and pureed diets."
    },
    {
      q: "Is transportation provided for outside medical appointments?",
      a: "Yes. Kinetic Care provides scheduled, wheelchair-accessible transportation for medical appointments, local shopping trips, and community group outings. Residents can book transportation through the concierge desk free of charge."
    }
  ];

  // Form handle functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in your Name, Email, and Phone number.");
      return;
    }
    // Simulate API call
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      careLevel: "assisted",
      date: "",
      message: ""
    });
    setIsSubmitted(false);
  };

  // Carousel handlers
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="home-page">
      {/* ==========================================
         FLOATING NAVBAR
      ========================================== */}
      <div className={`home-nav-container ${isScrolled ? "scrolled" : ""}`}>
        <div className="home-nav-wrapper">
          <a href="#welcome" className="nav-brand">
            <DoubleFlowerIcon />
            <span className="nav-logo-text">Kinetic<span>Care</span></span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="nav-menu-desktop">
            <li className="nav-item-desktop"><a href="#about">Our Story</a></li>
            <li className="nav-item-desktop"><a href="#care">Care Tiers</a></li>
            <li className="nav-item-desktop"><a href="#amenities">Amenities</a></li>
            <li className="nav-item-desktop"><a href="#testimonials">Reviews</a></li>
            <li className="nav-item-desktop"><a href="#faq">FAQ</a></li>
            <li>
              <a href="#contact" className="nav-cta-btn">Book a Tour</a>
            </li>
          </ul>

          {/* Hamburger Menu Toggle Button */}
          <button
            className="menu-hamburger-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <ul className={`nav-menu-mobile ${isMenuOpen ? "open" : ""}`}>
        <li className="nav-item-mobile"><a href="#about" onClick={() => setIsMenuOpen(false)}>Our Story</a></li>
        <li className="nav-item-mobile"><a href="#care" onClick={() => setIsMenuOpen(false)}>Care Tiers</a></li>
        <li className="nav-item-mobile"><a href="#amenities" onClick={() => setIsMenuOpen(false)}>Amenities</a></li>
        <li className="nav-item-mobile"><a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Reviews</a></li>
        <li className="nav-item-mobile"><a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a></li>
        <li style={{ marginTop: "20px" }}>
          <a href="#contact" className="nav-cta-btn" style={{ textAlign: "center", display: "block" }} onClick={() => setIsMenuOpen(false)}>
            Book a Tour
          </a>
        </li>
      </ul>
      <div className={`mobile-overlay ${isMenuOpen ? "visible" : ""}`} onClick={() => setIsMenuOpen(false)}></div>


      {/* ==========================================
         HERO SECTION
      ========================================== */}
      <section className="hero-section" id="welcome">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Redefining Senior Care</span>
          </div>
          <h1>A Place Where Love, Dignity, and Joy Live.</h1>
          <p>
            Welcome to a boutique senior living community designed to celebrate life.
            Nestled in tranquil nature, we provide a safe, active, and deeply compassionate home.
          </p>
          <div className="hero-actions">
            <a href="#contact"><button className="btn-primary">Schedule a Visit</button></a>
            <a href="#care"><button className="btn-secondary">Explore Care Tiers</button></a>
          </div>

          {/* Quick Stats Panel */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Happy Residents</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Medical Care</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years of Trust</span>
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
         PHILOSOPHY / VALUES SECTION
      ========================================== */}
      <section className="section-padding" id="about">
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle">Our Philosophy</span>
            <h2 className="section-title">Rooted in Care, Growing in Happiness</h2>
            <p className="section-desc">
              We believe old age isn't a limitation—it's a new chapter filled with discovery, friendship,
              and comfort. We govern our home with four pillars of dedication.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-wrapper">
                <HeartIcon />
              </div>
              <h3>Unconditional Love</h3>
              <p>We treat every resident like our own parents, ensuring warmth, respect, and deep personal care.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-wrapper">
                <ShieldIcon />
              </div>
              <h3>Active Security</h3>
              <p>With 24/7 medical surveillance, smart layouts, and doctors on call, security is built into our walls.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-wrapper">
                <SmileIcon />
              </div>
              <h3>Joyful Living</h3>
              <p>Recreation, arts, gardening, and music fill our days, keeping minds active and spirits young.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-wrapper">
                <CommunityIcon />
              </div>
              <h3>Warm Community</h3>
              <p>Laughter is meant to be shared. Our dining rooms, lobbies, and parks nurture lifelong friendships.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
         CARE TIERS (TABS) SECTION
      ========================================== */}
      <section className="section-padding care-section" id="care">
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle">Tiers of Support</span>
            <h2 className="section-title">Support Tailored for Every Need</h2>
            <p className="section-desc">
              We offer multiple levels of licensed, personalized care. Select a tier below to explore how we support
              different lifestyle and medical requirements.
            </p>
          </div>

          {/* Tab Navigation buttons */}
          <div className="care-tabs-nav">
            <button
              className={`care-tab-btn ${activeTab === "independent" ? "active" : ""}`}
              onClick={() => setActiveTab("independent")}
            >
              Independent Living
            </button>
            <button
              className={`care-tab-btn ${activeTab === "assisted" ? "active" : ""}`}
              onClick={() => setActiveTab("assisted")}
            >
              Assisted Living
            </button>
            <button
              className={`care-tab-btn ${activeTab === "memory" ? "active" : ""}`}
              onClick={() => setActiveTab("memory")}
            >
              Memory Support
            </button>
            <button
              className={`care-tab-btn ${activeTab === "medical" ? "active" : ""}`}
              onClick={() => setActiveTab("medical")}
            >
              24/7 Skilled Nursing
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="care-tab-content">
            <div className="care-tab-image">
              <img src={careTiers[activeTab].image} alt={careTiers[activeTab].title} />
            </div>
            <div className="care-tab-info">
              <h3>{careTiers[activeTab].title}</h3>
              <p>{careTiers[activeTab].desc}</p>

              <ul className="care-features-list">
                {careTiers[activeTab].features.map((feature, idx) => (
                  <li className="care-feature-item" key={idx}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a href="#contact">
                <button className="btn-primary" style={{ padding: "12px 28px", fontSize: "0.95rem" }}>
                  Inquire About This Tier
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
         AMENITIES SECTION
      ========================================== */}
      <section className="section-padding" id="amenities">
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle">Comforts of Home</span>
            <h2 className="section-title">Spaces Designed to Enhance Daily Life</h2>
            <p className="section-desc">
              Every room, garden, and community space at Kinetic Care is designed to feel spacious,
              peaceful, and barrier-free, allowing for comfortable senior movement.
            </p>
          </div>

          <div className="amenities-grid">
            {/* Amenity 1 */}
            <div className="amenity-card">
              <div
                className="amenity-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80')` }}
              ></div>
              <div className="amenity-card-overlay">
                <div className="amenity-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3>Gourmet Dining</h3>
                <p>Nutritious meals designed by clinical dietitians and cooked fresh by in-house chefs.</p>
              </div>
            </div>

            {/* Amenity 2 */}
            <div className="amenity-card">
              <div
                className="amenity-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80')` }}
              ></div>
              <div className="amenity-card-overlay">
                <div className="amenity-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3>Lush Organic Gardens</h3>
                <p>Scenic walking trails, relaxation benches, and elevated raised garden beds for resident use.</p>
              </div>
            </div>

            {/* Amenity 3 */}
            <div className="amenity-card">
              <div
                className="amenity-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80')` }}
              ></div>
              <div className="amenity-card-overlay">
                <div className="amenity-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
                    <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
                  </svg>
                </div>
                <h3>Physical Therapy</h3>
                <p>Fully equipped rehabilitation room with licensed physiotherapists on staff daily.</p>
              </div>
            </div>

            {/* Amenity 4 */}
            <div className="amenity-card">
              <div
                className="amenity-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80')` }}
              ></div>
              <div className="amenity-card-overlay">
                <div className="amenity-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h3>Library & Quiet Room</h3>
                <p>A serene environment filled with books, audiobooks, and comfortable reading armchairs.</p>
              </div>
            </div>

            {/* Amenity 5 */}
            <div className="amenity-card">
              <div
                className="amenity-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80')` }}
              ></div>
              <div className="amenity-card-overlay">
                <div className="amenity-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3>Social & Recreation Club</h3>
                <p>Weekly movies, arts & crafts workshops, board game nights, and musical performances.</p>
              </div>
            </div>

            {/* Amenity 6 */}
            <div className="amenity-card">
              <div
                className="amenity-card-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80')` }}
              ></div>
              <div className="amenity-card-overlay">
                <div className="amenity-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3>24/7 Security & Health Alert</h3>
                <p>Continuous facility security, emergency push buttons, and fall-detection alarms in all suites.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
         TESTIMONIALS SLIDER SECTION
      ========================================== */}
      <section className="section-padding testimonials-section" id="testimonials">
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle">Real Stories</span>
            <h2 className="section-title">Loved by Residents, Trusted by Families</h2>
            <p className="section-desc">
              Nothing speaks louder than the testimonials of those who live in our community and the families
              who have placed their trust in our hands.
            </p>
          </div>

          <div className="testimonial-slider-container">
            {/* Left Nav Button */}
            <button className="testimonial-nav-btn prev" onClick={prevTestimonial} aria-label="Previous Testimonial">
              <ArrowLeftIcon />
            </button>

            {/* Slide */}
            <div className="testimonial-slide">
              <div className="testimonial-rating">
                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
              </div>
              <p className="testimonial-text">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} />
                </div>
                <span className="testimonial-name">{testimonials[activeTestimonial].name}</span>
                <span className="testimonial-relation">{testimonials[activeTestimonial].relation}</span>
              </div>
            </div>

            {/* Right Nav Button */}
            <button className="testimonial-nav-btn next" onClick={nextTestimonial} aria-label="Next Testimonial">
              <ArrowRightIcon />
            </button>

            {/* Pagination Dots */}
            <div className="testimonial-dots">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`testimonial-dot ${activeTestimonial === idx ? "active" : ""}`}
                  onClick={() => setActiveTestimonial(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
         FAQ SECTION
      ========================================== */}
      <section className="section-padding" id="faq">
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">
              We want you to feel confident and informed. Here are answers to some of the most common questions
              families ask before choosing Kinetic Care.
            </p>
          </div>

          <div className="faq-wrapper">
            {faqs.map((faq, idx) => (
              <div className={`faq-item ${activeFaq === idx ? "active" : ""}`} key={idx}>
                <button className="faq-trigger" onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}>
                  <h3 className="faq-question">{faq.q}</h3>
                  <div className="faq-icon-wrapper">
                    <ChevronDownIcon />
                  </div>
                </button>
                <div className="faq-content">
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ==========================================
         CONTACT & TOUR BOOKING SECTION
      ========================================== */}
      <section className="section-padding contact-section" id="contact">
        <div className="section-container">
          <div className="contact-grid">

            {/* Information panel */}
            <div className="contact-info-panel">
              <div className="info-header">
                <h3>Get In Touch</h3>
                <p>Have questions or want to see our beautiful home in person? We would love to host you.</p>
              </div>

              <ul className="info-details-list">
                <li className="info-detail-item">
                  <div className="info-icon">
                    <PhoneIcon />
                  </div>
                  <div className="info-text">
                    <h4>Direct Call</h4>
                    <p>+1 (555) 732-8400</p>
                  </div>
                </li>

                <li className="info-detail-item">
                  <div className="info-icon">
                    <EmailIcon />
                  </div>
                  <div className="info-text">
                    <h4>Email Us</h4>
                    <p>care@kineticcare.com</p>
                  </div>
                </li>

                <li className="info-detail-item">
                  <div className="info-icon">
                    <MapPinIcon />
                  </div>
                  <div className="info-text">
                    <h4>Our Location</h4>
                    <p>8400 Whispering Pines Lane, Santa Clara, CA 95054</p>
                  </div>
                </li>
              </ul>

              <div className="info-socials">
                <a href="#facebook" className="social-link-btn" aria-label="Facebook">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14H6.5v4h3v8h5v-8h3.64l.63-4z" />
                  </svg>
                </a>
                <a href="#instagram" className="social-link-btn" aria-label="Instagram">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                  </svg>
                </a>
                <a href="#twitter" className="social-link-btn" aria-label="Twitter">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Form panel */}
            <div className="contact-form-panel">
              {isSubmitted ? (
                <div className="form-success-card">
                  <div className="success-icon-badge">
                    <CheckIcon />
                  </div>
                  <h4>Tour Request Received!</h4>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. We have saved your request for a tour.
                    Our relationship coordinator will contact you at <strong>{formData.phone}</strong> or
                    <strong> {formData.email}</strong> within 24 hours to confirm your scheduling.
                  </p>
                  <button className="btn-reset-form" onClick={handleResetForm}>
                    Send Another Request
                  </button>
                </div>
              ) : (
                <>
                  <h3>Schedule a Tour</h3>
                  <form className="booking-form" onSubmit={handleFormSubmit}>

                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="(555) 000-0000"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-row-2col">
                      <div className="form-group">
                        <label htmlFor="careLevel">Care Tier Interest</label>
                        <select
                          id="careLevel"
                          name="careLevel"
                          value={formData.careLevel}
                          onChange={handleInputChange}
                        >
                          <option value="independent">Independent Living</option>
                          <option value="assisted">Assisted Living</option>
                          <option value="memory">Memory Support</option>
                          <option value="nursing">24/7 Skilled Nursing</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="date">Preferred Tour Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message / Questions</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your requirements..."
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <button type="submit" className="form-submit-btn">
                      Request Tour Schedule
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
         FOOTER SECTION
      ========================================== */}
      <footer className="home-footer">
        <div className="footer-top-grid">

          <div className="footer-column footer-column-logo">
            <span className="nav-logo-text">Kinetic<span>Care</span></span>
            <p>
              Providing serene, warm, and highly specialized residential environments for seniors since 2011.
            </p>
            <div className="footer-contact-details">
              <div className="footer-contact-item">
                <MapPinIcon />
                <span>8400 Whispering Pines Lane, Santa Clara, CA 95054</span>
              </div>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links-list">
              <li className="footer-link-item"><a href="#about">Our Story</a></li>
              <li className="footer-link-item"><a href="#care">Care Tiers</a></li>
              <li className="footer-link-item"><a href="#amenities">Amenities & spaces</a></li>
              <li className="footer-link-item"><a href="#testimonials">Resident Stories</a></li>
              <li className="footer-link-item"><a href="#faq">Frequently Asked</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="footer-links-list">
              <li className="footer-link-item" style={{ color: "rgba(250,247,242,0.8)" }}>
                <strong>Toll Free:</strong> 1-800-555-KARE
              </li>
              <li className="footer-link-item" style={{ color: "rgba(250,247,242,0.8)" }}>
                <strong>Direct Desk:</strong> +1 (555) 732-8400
              </li>
              <li className="footer-link-item" style={{ color: "rgba(250,247,242,0.8)" }}>
                <strong>Email:</strong> care@kineticcare.com
              </li>
              <li className="footer-link-item" style={{ color: "rgba(250,247,242,0.8)" }}>
                <strong>Admissions:</strong> apply@kineticcare.com
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Newsletter</h3>
            <div className="newsletter-form">
              <p>Sign up to receive our monthly health tips and event schedule.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed! Thank you."); }}>
                <div className="newsletter-input-group">
                  <input type="email" placeholder="Your email address" required />
                  <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                    <ArrowRightIcon />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 Kinetic Care Senior Living. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#accessibility">Accessibility Statement</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
