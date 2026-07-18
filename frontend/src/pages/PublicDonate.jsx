import { useState } from "react";
import axios from "axios";
import "../css/PublicDonate.css";

function PublicDonate() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    amount: "",
    donationType: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/donors",
        formData
      );

      alert("Thank you for your generous donation ❤️");

      setFormData({
        name: "",
        phone: "",
        email: "",
        amount: "",
        donationType: "",
        address: "",
      });
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Donation Failed"
      );
    }
  };

  return (
    <div className="public-donate-container">

      <div className="public-donate-card">

        <h1>Support Our Old Age Home</h1>

        <p>
          Your contribution helps us provide better care,
          food, medicines, and a comfortable life for our
          elderly residents.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Donation Amount"
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
            Donate Now ❤️
          </button>

        </form>

      </div>

    </div>
  );
}

export default PublicDonate;