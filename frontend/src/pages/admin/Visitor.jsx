import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../css/admin/Visitor.css";

function Visitor() {
  const [visitors, setVisitors] = useState([]);
 
  const [search, setSearch] = useState("");


  useEffect(() => {
    getVisitors();

  }, []);
  const getVisitors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/visitors",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setVisitors(res.data);
    } catch (error) {
      console.log(error);
    }
  };



  const checkOutVisitor = async (id) => {

    try {

        const token = localStorage.getItem("token");

        await axios.put(

            `http://localhost:5000/api/visitors/checkout/${id}`,

            {},

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        getVisitors();

    }

    catch(error){

        console.log(error);

    }

};

  // ===========================
  // Search
  // ===========================

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      visitor.phone.includes(search) ||
      visitor.relation.toLowerCase().includes(search.toLowerCase()) ||
      visitor.residentId?.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="visitor-page">
        <Sidebar />

        <div className="visitor-content">
          <div className="visitor-header">

  <div>
    <p className="visitor-small-title">
      Visit Management
    </p>

    <h1>Visitors</h1>

    <span>
      Track resident visitors and check-in activity
    </span>
  </div>

</div>

<div className="visitor-search-box">

  <input
    type="text"
    placeholder="Search visitor, resident, phone or relation..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>

          <div className="visitor-grid">

  {filteredVisitors.length === 0 ? (

    <div className="visitor-empty">
      <div className="visitor-empty-icon">👥</div>

      <h3>No Visitors Found</h3>

      <p>
        Visitor records will appear here.
      </p>
    </div>

  ) : (

    filteredVisitors.map((visitor) => (

      <div
        className="visitor-card"
        key={visitor._id}
      >

        <div className="visitor-card-top">

          <div className="visitor-profile">

            <div className="visitor-avatar">
              {visitor.visitorName
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>

              <span>Visitor</span>

              <h3>{visitor.visitorName}</h3>

              <p>{visitor.phone}</p>

            </div>

          </div>

          <span
            className={
              visitor.checkOut
                ? "visit-status completed-status"
                : "visit-status active-status"
            }
          >
            {visitor.checkOut
              ? "Completed"
              : "Visiting"}
          </span>

        </div>


        <div className="visiting-resident-box">

          <span>Visiting Resident</span>

          <strong>
            {visitor.residentId?.name || "Unknown Resident"}
          </strong>

          <small>
            {visitor.relation || "Relation not specified"}
          </small>

        </div>


        <div className="visitor-purpose">

          <span>Purpose of Visit</span>

          <p>
            {visitor.purpose || "Not specified"}
          </p>

        </div>


        <div className="visitor-time-grid">

          <div>

            <span>Check In</span>

            <strong>
              {visitor.checkIn
                ? new Date(visitor.checkIn)
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                : "-"}
            </strong>

            <small>
              {visitor.checkIn
                ? new Date(visitor.checkIn)
                    .toLocaleDateString("en-IN")
                : ""}
            </small>

          </div>


          <div>

            <span>Check Out</span>

            <strong>
              {visitor.checkOut
                ? new Date(visitor.checkOut)
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                : "--:--"}
            </strong>

            <small>
              {visitor.checkOut
                ? new Date(visitor.checkOut)
                    .toLocaleDateString("en-IN")
                : "Still Visiting"}
            </small>

          </div>

        </div>


        <div className="visitor-card-action">

          {visitor.checkOut ? (

            <div className="visit-completed">
              ✓ Visit Completed
            </div>

          ) : (

            <button
              className="visitor-checkout-btn"
              onClick={() =>
                checkOutVisitor(visitor._id)
              }
            >
              Check Out Visitor
            </button>

          )}

        </div>

      </div>

    ))

  )}

</div>
        </div>
      </div>

    </>
  );
}

export default Visitor;
