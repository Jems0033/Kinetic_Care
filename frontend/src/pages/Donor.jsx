import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../css/Donor.css";

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

                    <h1>Donor Management</h1>

                </div>

                <input
                    type="text"
                    placeholder="Search Donor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table>

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Phone</th>

                            <th>Email</th>

                            <th>Amount</th>

                            <th>Donation Type</th>

                            <th>Date</th>

                            <th>Address</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredDonors.length > 0 ? (

                                filteredDonors.map((donor) => (

                                    <tr key={donor._id}>

                                        <td>{donor.name}</td>

                                        <td>{donor.phone}</td>

                                        <td>{donor.email}</td>

                                        <td>₹ {donor.amount}</td>

                                        <td>{donor.donationType}</td>

                                        <td>
                                            {new Date(
                                                donor.donationDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>{donor.address}</td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="7">
                                        No Donors Found
                                    </td>

                                </tr>

                            )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Donor;