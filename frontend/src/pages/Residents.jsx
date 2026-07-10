import Sidebar from "../components/Sidebar";
import "../css/Residents.css";

function Residents(){

    return(

        <div className="residents">

            <Sidebar/>

            <div className="resident-content">

                <div className="resident-header">

                    <h1>Residents</h1>

                    <button>
                        + Add Resident
                    </button>

                </div>

                <input
                    type="text"
                    placeholder="Search Resident..."
                />

                <table>

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Age</th>

                            <th>Gender</th>

                            <th>Room</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>Ramesh</td>

                            <td>72</td>

                            <td>Male</td>

                            <td>A101</td>

                            <td>Healthy</td>

                            <td>

                                <button>Edit</button>

                                <button>Delete</button>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Residents;