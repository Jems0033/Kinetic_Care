import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";

function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                <div className="dashboard-header">

                    <div>

                        <h1>
                            Welcome {user?.name}
                        </h1>

                        <p>
                            Kinetic Care Dashboard
                        </p>

                    </div>

                </div>

                <div className="dashboard-cards">

                    <div className="dashboard-card">

                        <h2>125</h2>

                        <p>Total Residents</p>

                    </div>

                    <div className="dashboard-card">

                        <h2>32</h2>

                        <p>Total Staff</p>

                    </div>

                    <div className="dashboard-card">

                        <h2>50</h2>

                        <p>Available Rooms</p>

                    </div>

                    <div className="dashboard-card">

                        <h2>15</h2>

                        <p>Pending Payments</p>

                    </div>

                </div>

                <div className="recent-section">

                    <h2>Recent Residents</h2>

                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Age</th>

                                <th>Room</th>

                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>Ramesh Patel</td>

                                <td>72</td>

                                <td>A-102</td>

                                <td>Healthy</td>

                            </tr>

                            <tr>

                                <td>Meena Shah</td>

                                <td>68</td>

                                <td>B-203</td>

                                <td>Under Treatment</td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;