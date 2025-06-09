import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.REACT_APP_API_URL;

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: ""
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
      const response = await fetch(`${apiUrl}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        // Decode token to get role
        const decodedToken = jwtDecode(data.token);
        const userRole = decodedToken.role; // this is from your backend claims

        localStorage.setItem("userRole", userRole);

        console.log(decodedToken);

        alert("Login successful");

        if (userRole === "student") {
          navigate("/student-dashboard");
        } else if (userRole === "instructor") {
          navigate("/instructor-dashboard");
        } else {
          // fallback or error if role is unknown
          alert("Unknown user role");
        }
      } else {
        alert("Login failed: Invalid Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Select Role
          </label>
          <select
            name="role"
            className="form-select"
            id="role"
            onChange={handleChange}
            value={formData.role}
            required
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="Email" className="form-label">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            className="form-control"
            id="email"
            onChange={handleChange}
            value={formData.email} required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Password" className="form-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="Password"
            onChange={handleChange}
            value={formData.password} required
          />
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <p className="mb-3">
            Don't have an account? Sign up <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;