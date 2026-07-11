import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../css/Medical.css";

function Medical() {

    const [records, setRecords] = useState([]);
    const [residents, setResidents] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({

        residentId: "",

        staffId: "",

        problem: "",

        medicine: ""

    });

    useEffect(() => {

        getMedicalRecords();

        getResidents();

        getDoctors();

    }, []);

    const getMedicalRecords = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(

            "http://localhost:5000/api/medical",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        setRecords(res.data);

    }

    catch (error) {

        console.log(error);

    }

};

const getResidents = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(

            "http://localhost:5000/api/residents",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        setResidents(res.data);

    }

    catch (error) {

        console.log(error);

    }

};
const getDoctors = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(

            "http://localhost:5000/api/staff/doctors",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        setDoctors(res.data);

    } catch (error) {

        console.log(error);

    }

};
const handleChange = (e) => {

    setFormData({

        ...formData,

        [e.target.name]: e.target.value

    });

};
const addMedicalRecord = async () => {

    try {

        const token = localStorage.getItem("token");

        await axios.post(

            "http://localhost:5000/api/medical",

            formData,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("Medical Record Added Successfully");

        closeModal();

        getMedicalRecords();

    } catch (error) {

        console.log(error);

        alert("Unable To Add Medical Record");

    }

};

// ===========================
// Edit Medical Record
// ===========================

const editMedicalRecord = (record) => {

    setEditId(record._id);

    setFormData({

        residentId: record.residentId._id,

        staffId: record.staffId._id,

        problem: record.problem,

        medicine: record.medicine

    });

    setShowModal(true);

};

// ===========================
// Update Medical Record
// ===========================

const updateMedicalRecord = async () => {

    try {

        const token = localStorage.getItem("token");

        await axios.put(

            `http://localhost:5000/api/medical/${editId}`,

            formData,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("Medical Record Updated Successfully");

        closeModal();

        getMedicalRecords();

    } catch (error) {

        console.log(error);

    }

};

// ===========================
// Delete Medical Record
// ===========================

const deleteMedicalRecord = async (id) => {

    if (!window.confirm("Delete this record?")) return;

    try {

        const token = localStorage.getItem("token");

        await axios.delete(

            `http://localhost:5000/api/medical/${id}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("Medical Record Deleted Successfully");

        getMedicalRecords();

    } catch (error) {

        console.log(error);

    }

};

// ===========================
// Close Modal
// ===========================

const closeModal = () => {

    setEditId(null);

    setShowModal(false);

    setFormData({

        residentId: "",

        staffId: "",

        problem: "",

        medicine: ""

    });

};

// ===========================
// Search
// ===========================

const filteredRecords = records.filter((record) =>

    record.residentId?.name.toLowerCase().includes(search.toLowerCase()) ||

    record.staffId?.name.toLowerCase().includes(search.toLowerCase()) ||

    record.problem.toLowerCase().includes(search.toLowerCase()) ||

    record.medicine.toLowerCase().includes(search.toLowerCase())

);

return (

    <>

        <div className="medical-page">

            <Sidebar />

            <div className="medical-content">

                <div className="medical-header">

                    <h1>Medical Records</h1>

                    <button
                        onClick={() => {

                            closeModal();

                            setShowModal(true);

                        }}
                    >
                        + Add Record
                    </button>

                </div>

                <input
                    type="text"
                    placeholder="Search Medical Record..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table>

                    <thead>

                        <tr>

                            <th>Resident</th>

                            <th>Doctor</th>

                            <th>Problem</th>

                            <th>Medicine</th>

                            <th>Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredRecords.map((record) => (

                                <tr key={record._id}>

                                    <td>{record.residentId?.name}</td>

                                    <td>{record.staffId?.name}</td>

                                    <td>{record.problem}</td>

                                    <td>{record.medicine}</td>

                                    <td>

                                        {new Date(record.date).toLocaleDateString()}

                                    </td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => editMedicalRecord(record)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteMedicalRecord(record._id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

        {

            showModal && (

                <div className="modal">

                    <div className="modal-box">

                        <h2>

                            {

                                editId

                                    ? "Edit Medical Record"

                                    : "Add Medical Record"

                            }

                        </h2>

                        <select
                            name="residentId"
                            value={formData.residentId}
                            onChange={handleChange}
                        >

                            <option value="">Select Resident</option>

                            {

                                residents.map((resident) => (

                                    <option
                                        key={resident._id}
                                        value={resident._id}
                                    >
                                        {resident.name}
                                    </option>

                                ))

                            }

                        </select>

                        <select
                            name="staffId"
                            value={formData.staffId}
                            onChange={handleChange}
                        >

                            <option value="">Select Doctor</option>

                            {

                                doctors.map((doctor) => (

                                    <option
                                        key={doctor._id}
                                        value={doctor._id}
                                    >
                                        {doctor.name}
                                    </option>

                                ))

                            }

                        </select>

                        <input
                            type="text"
                            name="problem"
                            placeholder="Problem"
                            value={formData.problem}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="medicine"
                            placeholder="Medicine"
                            value={formData.medicine}
                            onChange={handleChange}
                        />

                        <div className="modal-buttons">

                            <button
                                onClick={
                                    editId
                                        ? updateMedicalRecord
                                        : addMedicalRecord
                                }
                            >

                                {

                                    editId
                                        ? "Update"
                                        : "Save"

                                }

                            </button>

                            <button
                                className="cancel-btn"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )

        }

    </>

);

}

export default Medical;