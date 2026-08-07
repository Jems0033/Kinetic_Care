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

  const approveVisitor = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/visitors/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getVisitors();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectVisitor = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/visitors/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getVisitors();
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
            Authorization: `Bearer ${token}`,
          },
        },
      );

      getVisitors();
    } catch (error) {
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <>
      <div className="visitor-page">
        <Sidebar />

        <div className="visitor-content">
          <div className="visitor-header">
            <div>
              <h1>Visitors</h1>

              <span>Track resident visitors and check-in activity</span>
            </div>
          </div>

          <div className="visitor-search-box">
            <input
              type="text"
              placeholder="Search visitor by name..."
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

          <div className="visitor-grid">
            {filteredVisitors.length === 0 ? (
              <div className="visitor-empty">
                <div className="visitor-empty-icon">👥</div>

                <h3>No Visitors Found</h3>

                <p>Visitor records will appear here.</p>
              </div>
            ) : (
              filteredVisitors.map((visitor) => (
                <div className="visitor-card" key={visitor._id}>
                  <div className="visitor-card-top">
                    <div className="visitor-profile">
                      <div className="visitor-avatar">
                        {visitor.visitorName?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <span>Visitor</span>

                        <h3>{visitor.visitorName}</h3>

                        <p>{visitor.phone}</p>
                      </div>
                    </div>

                    <span
                      className={`visit-status ${
                        visitor.status === "Pending"
                          ? "pending-status"
                          : visitor.status === "Approved"
                            ? "active-status"
                            : visitor.status === "Rejected"
                              ? "rejected-status"
                              : "completed-status"
                      }`}
                    >
                      {visitor.status}
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

                    <p>{visitor.purpose || "Not specified"}</p>
                  </div>

                  <div className="visitor-time-grid">
                    <div>
                      <span>Visit Date</span>

                      <strong>
                        {new Date(visitor.visitDate).toLocaleDateString(
                          "en-IN",
                        )}
                      </strong>

                      
                    </div>

                    <div>
                      <span>Check Out</span>

                      <small>
                        {visitor.checkOut
                          ? new Date(visitor.checkOut).toLocaleDateString(
                              "en-IN",
                            )
                          : "---"}
                      </small>
                    </div>
                  </div>

                  <div className="visitor-card-action">
                    {visitor.status === "Pending" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => approveVisitor(visitor._id)}
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => rejectVisitor(visitor._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {visitor.status === "Approved" &&
                      new Date(visitor.visitDate).setHours(0, 0, 0, 0) ===
                        today.getTime() &&
                      !visitor.checkOut && (
                        <button
                          className="visitor-checkout-btn"
                          onClick={() => checkOutVisitor(visitor._id)}
                        >
                          Check Out Visitor
                        </button>
                      )}

                    {visitor.status === "Completed" && (
                      <div className="visit-completed">✓ Visit Completed</div>
                    )}

                    {visitor.status === "Rejected" && (
                      <div className="visit-rejected">✕ Visit Rejected</div>
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
