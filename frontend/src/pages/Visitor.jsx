import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../css/Visitor.css";

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
            <h1>Visitor Management</h1>

          </div>

          <input
            type="text"
            placeholder="Search Visitor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table>
            <thead>
              <tr>
                <th>Resident</th>

                <th>Visitor</th>

                <th>Phone</th>

                <th>Relation</th>

                <th>Purpose</th>

                <th>Check In</th>

                <th>Check Out</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredVisitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.residentId?.name}</td>

                  <td>{visitor.visitorName}</td>

                  <td>{visitor.phone}</td>

                  <td>{visitor.relation}</td>

                  <td>{visitor.purpose}</td>

                  <td>
                    {visitor.checkIn
                      ? new Date(visitor.checkIn).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    {visitor.checkOut
                      ? new Date(visitor.checkOut).toLocaleString()
                      : "Still Visiting"}
                  </td>

                  <td>

    {

        visitor.checkOut ?

        <span className="completed">
            Completed
        </span>

        :

        <button
            className="checkout-btn"
            onClick={() => checkOutVisitor(visitor._id)}
        >
            Check Out
        </button>

    }

</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}

export default Visitor;
