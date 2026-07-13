import { useState } from "react";
import axios from "axios";
import "../css/BookVisit.css";

function BookVisit() {

    const [formData, setFormData] = useState({

        visitorName: "",
        phone: "",
        relation: "",
        purpose: "",
        visitDate: ""

    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.post(

                "http://localhost:5000/api/family/book-visit",

                formData,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            alert(res.data.message);

            setFormData({

                visitorName: "",
                phone: "",
                relation: "",
                purpose: "",
                visitDate: ""

            });

        }

        catch (err) {

            alert(err.response?.data?.message || "Something went wrong");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="book-visit-container">

            <div className="book-visit-card">

                <h2>Book a Visit</h2>

                <p>
                    Fill the details below to request a visit for your resident.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Visitor Name</label>

                        <input
                            type="text"
                            name="visitorName"
                            value={formData.visitorName}
                            onChange={handleChange}
                            placeholder="Enter Visitor Name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Phone Number</label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter Phone Number"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Relation</label>

                        <select

                            name="relation"

                            value={formData.relation}

                            onChange={handleChange}

                            required

                        >

                            <option value="">Select Relation</option>
                            <option>Father</option>
                            <option>Mother</option>
                            <option>Son</option>
                            <option>Daughter</option>
                            <option>Brother</option>
                            <option>Sister</option>
                            <option>Friend</option>
                            <option>Relative</option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Visit Date</label>

                        <input
                            type="date"
                            name="visitDate"
                            value={formData.visitDate}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Purpose</label>

                        <textarea

                            name="purpose"

                            rows="4"

                            value={formData.purpose}

                            onChange={handleChange}

                            placeholder="Purpose of Visit"

                            required

                        />

                    </div>

                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Booking..."

                                : "Book Visit"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default BookVisit;