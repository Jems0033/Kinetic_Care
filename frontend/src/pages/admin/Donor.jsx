import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Donor.css";

function Donor() {

    const [donors, setDonors] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        getDonors();

    }, []);

    const getDonors = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                "http://localhost:5000/api/donors",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setDonors(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const filteredDonors = donors.filter((donor) =>

        donor.name.toLowerCase().includes(search.toLowerCase()) ||

        donor.phone.includes(search) ||

        donor.email.toLowerCase().includes(search.toLowerCase()) ||

        donor.donationType.toLowerCase().includes(search.toLowerCase())

    );

        return (

        <div className="donor-page">

            <Sidebar />

            <div className="donor-content">

                <div className="donor-header">

  <div>

    <p className="donor-small-title">
      Donation Management
    </p>

    <h1>Donors</h1>

    <span>
      View donor information and donation history
    </span>

  </div>

</div>

<div className="donor-search-box">

  <input
    type="text"
    placeholder="Search by name, phone, email or donation type..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>

               <div className="donor-grid">

  {filteredDonors.length > 0 ? (

    filteredDonors.map((donor) => (

      <div
        className="donor-card"
        key={donor._id}
      >

        <div className="donor-card-top">

          <div className="donor-profile">

            <div className="donor-avatar">
              {donor.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>

              <span>Donor</span>

              <h3>{donor.name}</h3>

              <p>{donor.email}</p>

            </div>

          </div>

          <span className="donation-type-badge">
            {donor.donationType}
          </span>

        </div>


        <div className="donation-amount-box">

          <span>Donation Amount</span>

          <h2>
            ₹ {Number(donor.amount || 0)
              .toLocaleString("en-IN")}
          </h2>

        </div>


        <div className="donor-info-grid">

          <div>

            <span>Phone</span>

            <strong>
              {donor.phone || "-"}
            </strong>

          </div>

          <div>

            <span>Date</span>

            <strong>
              {new Date(
                donor.donationDate
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>

          </div>

        </div>


        <div className="donor-address-box">

          <span>Address</span>

          <p>
            {donor.address || "Address not available"}
          </p>

        </div>

      </div>

    ))

  ) : (

    <div className="donor-empty">

      <div className="donor-empty-icon">
        🤝
      </div>

      <h3>No Donors Found</h3>

      <p>
        Donor records will appear here.
      </p>

    </div>

  )}

</div> 
            </div>

        </div>

    );

}

export default Donor;