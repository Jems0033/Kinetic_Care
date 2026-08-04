import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Donor.css";

import {
  FaRupeeSign,
  FaUtensils,
  FaPills,
  FaTshirt,
  FaGift,
} from "react-icons/fa";

function Donor() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDonors();
  }, []);

  const getDonors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonors(res.data);
    } catch (error) {
      console.log("Get Donors Error:", error.response?.data || error);
    }
  };

  const getDonationDetails = (donationType) => {
    const type = donationType?.toLowerCase().trim();

    switch (type) {
      case "money":
        return {
          icon: <FaRupeeSign />,
          label: "Donation Amount",
          valuePrefix: "₹ ",
          typeClass: "money",
        };

      case "food":
        return {
          icon: <FaUtensils />,
          label: "Food Quantity",
          valuePrefix: "",
          typeClass: "food",
        };

      case "medicine":
        return {
          icon: <FaPills />,
          label: "Medicine Quantity",
          valuePrefix: "",
          typeClass: "medicine",
        };

      case "clothes":
      case "cloths":
        return {
          icon: <FaTshirt />,
          label: "Clothes Quantity",
          valuePrefix: "",
          typeClass: "clothes",
        };

      default:
        return {
          icon: <FaGift />,
          label: "Donation Value",
          valuePrefix: "",
          typeClass: "other",
        };
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const searchValue = search.toLowerCase();

    return (
      donor.name?.toLowerCase().includes(searchValue) ||
      donor.phone?.includes(search) ||
      donor.email?.toLowerCase().includes(searchValue) ||
      donor.donationType?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="donor-page">
      <Sidebar />

      <div className="donor-content">
        <div className="donor-header">
          <div>
            <h1>Donors</h1>

            <span>View donor information and donation history</span>
          </div>
        </div>

        <div className="donor-search-box">
          <input
            type="text"
            placeholder="Search donor by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="search-clear-btn"
              onClick={() => setSearch("")}
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        <div className="donor-grid">
          {filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => {
              const donationDetails = getDonationDetails(donor.donationType);

              return (
                <div
                  className={`donor-card donor-card-${donationDetails.typeClass}`}
                  key={donor._id}
                >
                  <div className="donor-card-top">
                    <div className="donor-profile">
                      <div className="donor-avatar">
                        {donor.name?.charAt(0)?.toUpperCase() || "D"}
                      </div>

                      <div>
                        <span>Donor</span>

                        <h3>{donor.name}</h3>

                        <p>{donor.email}</p>
                      </div>
                    </div>

                    <span
                      className={`donation-type-badge ${donationDetails.typeClass}`}
                    >
                      {donor.donationType}
                    </span>
                  </div>

                  <div
                    className={`donation-amount-box ${donationDetails.typeClass}`}
                  >
                    <div className="donation-value-icon">
                      {donationDetails.icon}
                    </div>

                    <div>
                      <span>{donationDetails.label}</span>

                      <h2>
                        {donationDetails.valuePrefix}
                        {Number(donor.amount || 0).toLocaleString("en-IN")}
                      </h2>
                    </div>
                  </div>

                  <div className="donor-info-grid">
                    <div>
                      <span>Phone</span>

                      <strong>{donor.phone || "-"}</strong>
                    </div>

                    <div>
                      <span>Date</span>

                      <strong>
                        {donor.donationDate
                          ? new Date(donor.donationDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </strong>
                    </div>
                  </div>

                  <div className="donor-address-box">
                    <span>Address</span>

                    <p>{donor.address || "Address not available"}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="donor-empty">
              <div className="donor-empty-icon">🤝</div>

              <h3>No Donors Found</h3>

              <p>Donor records will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Donor;
