import React, { useState } from "react";
import { Link } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

function Register() {
    const [formData, setFormData] = useState({
        Role: "",
        Name: "",
        Email: "",
        Password: ""
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
            const response = await fetch(`${apiUrl}/Auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Registration successful");
            } else {
                alert("Registration failed");
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("something went wrong");
        }
    };



    return (
        <div className="container mt-5" style = {{maxWidth:"400px"}}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
                <label htmlFor="role" className="form-label">Select Role</label>
                <select name = "Role" className="form-select" id="role"onChange={handleChange} value = {formData.Role} required>
                    <option value = "" disabled>Select role</option>
                    <option value="instructor">Instructor</option>
                    <option value="student">Student</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="Name" className="form-label">Name</label>
                <input name = "Name" type="text" className="form-control" id="Name" onChange={handleChange} value={formData.Name} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="Email" className="form-label">Email Addess</label>
                <input name="Email" type="email" className="form-control" id="Email" onChange={handleChange} value={formData.Email} required />
            </div>

            <div className="mb-3">
                <label htmlFor="Password" className="form-label">Password</label>
                <input name = "Password" type="password" className="form-control" id="Password" onChange={handleChange} value={formData.Password} required />
            </div>

            <div className = "mt-3">
                <button type="submit" className="btn btn-primary">Submit</button>
                <p className="mb-3">Already Have an account? <Link to = "/login">Login</Link></p>

            </div>
            </form>
        </div>
    );
}

export default Register;