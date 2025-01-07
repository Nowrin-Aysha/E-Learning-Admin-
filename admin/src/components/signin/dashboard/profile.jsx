import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [superAdmin, setSuperAdmin] = useState(false);

  useEffect(() => {
   
    let data = JSON.parse(localStorage.getItem("data"));
    setSuperAdmin(data.isSuperAdmin);

    setUser({
      name: data.name,
      email: data.email,
      phone: data.phone, 
      password: data.password, 
      role: data.role,
      gender: data.gender, 
      profilePicture: data.profilePicture, 
    });
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container-fluid" style={{ height: "100vh", width: "100vw" }}>
      <div className="row h-100">
        {/* Sidebar */}
        <div
          className="col-md-2 p-3 bg-dark text-white"
          style={{ position: "fixed", height: "100vh" }}
        >
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">
                <div className="sidebar-option">
                  <i className="bi bi-house-door-fill"></i> Dashboard
                </div>
              </Link>
            </li>
            {/* Other sidebar items */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/courses">
                <div className="sidebar-option">
                  <i className="bi bi-book-fill"></i> Courses
                </div>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/students">
                <div className="sidebar-option">
                  <i className="bi bi-person-fill"></i> Student Details
                </div>
              </Link>
            </li>
            {superAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admins">
                  <div className="sidebar-option">
                    <i className="bi bi-person-fill"></i> Our Admins
                  </div>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/mentors">
                <div className="sidebar-option">
                  <i className="bi bi-person-fill"></i> Our Mentors
                </div>
              </Link>
            </li>
          </ul>

          <div className="mt-auto">
            <button
              className="btn btn-outline-light w-100 mt-4"
              style={{ backgroundColor: "#001f3d", borderColor: "#ffffff" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        
        <div className="col-md-10 offset-md-2 p-3" style={{ marginLeft: "16.6667%" }}>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">E-Learning Dashboard</a>
              <div className="navbar-nav ms-auto">
               
                <li className="nav-item">
                  <Link className="btn btn-primary mx-2" to="/profile" style={{ backgroundColor: "#001f3d" }}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </li>
              </div>
            </div>
          </nav>

          
          <div className="card mb-4 shadow">
            <div className="card-header">
              <h3>Profile Details</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center">
                 
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                      style={{ width: "150px", height: "150px" }}
                    />
                  ) : (
                    <FaUserCircle size={150} className="text-primary" />
                  )}
                </div>
                <div className="col-md-8">
                  <h4>{user.name}</h4>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
