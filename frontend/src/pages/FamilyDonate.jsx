import { useState } from "react";
import axios from "axios";
import "../css/FamilyDonate.css";

function FamilyDonate() {

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        amount: "",
        donationType: "",
        address: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/donors",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Thank You For Your Donation ❤️");

            setFormData({
                name: "",
                phone: "",
                email: "",
                amount: "",
                donationType: "",
                address: ""
            });

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="family-donate">

            <h1>Donate</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />

                <select
                    name="donationType"
                    value={formData.donationType}
                    onChange={handleChange}
                    required
                >

                    <option value="">Select Donation Type</option>

                    <option value="Money">Money</option>

                    <option value="Food">Food</option>

                    <option value="Medicine">Medicine</option>

                    <option value="Clothes">Clothes</option>

                </select>

                <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                />

                <button type="submit">

                    Donate

                </button>

            </form>

        </div>

    );

}

export default FamilyDonate;