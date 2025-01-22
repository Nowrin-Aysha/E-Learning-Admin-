import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

const SidebarNavbar = ({ superAdmin, mentor, user, count, showProfileDropdown }) => {


  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/");
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };



  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

 const navigate = useNavigate();

  return (
    <>
      
      <div className="col-md-2 p-3 bg-dark text-white" style={{ position: "fixed", height: "100vh" }}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/dashboard">
              <div className="sidebar-option">
                <i className="bi bi-house-door-fill"></i> Dashboard
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/courses">
              <div className="sidebar-option">
                <i className="bi bi-book-fill"></i> Courses
              </div>
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link className="nav-link text-white" to="/communication">
              <div className="sidebar-option">
                <i className="bi bi-chat-dots-fill"></i> Communication
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/revenue">
              <div className="sidebar-option">
                <i className="bi bi-wallet2"></i> Revenue
              </div>
            </Link>
          </li> */}
          {/* <li className="nav-item">
            <Link className="nav-link text-white" to="/students">
              <div className="sidebar-option">
                <i className="bi bi-person-fill"></i> Student Management
              </div>
            </Link>
          </li> */}

          {superAdmin && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admins">
                <div className="sidebar-option">
                  <i className="bi bi-person-fill"></i> Admin Management
                </div>
              </Link>
            </li>
          )}

          {!mentor && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/mentors">
                <div className="sidebar-option">
                  <i className="bi bi-person-fill"></i> Mentor Management
                </div>
              </Link>
            </li>
          )}
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
            <a className="navbar-brand" href="#">
              Wezlearn E-Learning 
            </a>
            <div className="navbar-nav ms-auto">
              {superAdmin && (
                <li className="nav-item">
                  <Link
                    className="btn btn-primary mx-2"
                    to="/add-admin"
                    style={{ backgroundColor: "#001f3d" }}
                  >
                    Add Admin
                  </Link>
                </li>
              )}
              {!mentor && (
                <li className="nav-item">
                  <Link
                    className="btn btn-primary mx-2"
                    to="/add-mentor"
                    style={{ backgroundColor: "#001f3d" }}
                  >
                    Add Mentor
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className="btn btn-primary mx-2"
                  to="/add-course"
                  style={{ backgroundColor: "#001f3d" }}
                >
                  Add Course
                </Link>
              </li>
              {mentor && (
                <li className="nav-item">
                  <Link
                    className="btn btn-primary mx-2"
                    to="/add-course"
                    style={{ backgroundColor: "#001f3d" }}
                  >
                    Add Student
                  </Link>
                </li>
              )}

              {!mentor && (
                <li className="nav-item relative">
                  <a
                    className="nav-link text-dark"
                    href="#"
                    style={{ fontSize: "1.5rem" }}
                    onClick={toggleNotification}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M12 2a7 7 0 00-7 7v4.5c0 .536-.215 1.05-.586 1.414l-1.828 1.828A1 1 0 004 18h16a1 1 0 00.707-1.707l-1.828-1.828A2 2 0 0119 13.5V9a7 7 0 00-7-7zm0 18a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 20z" />
                    </svg>

                    {count > 0 && (
                      <span className="absolute top-0 right-0 grid min-h-[20px] min-w-[20px] translate-x-2/4 -translate-y-2/4 place-items-center rounded-full bg-red-500 py-1 px-1 text-xs font-medium leading-none text-white">
                        {count}
                      </span>
                    )}
                  </a>
                </li>
              )}

              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  href="#"
                  onClick={handleProfileClick}
                  style={{
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    color: "#001f3d",
                  }}
                >
                  {/* {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <FaUserCircle size={35} className="text-primary" />
                  )} */}
                </a>

                {showProfileDropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "40px",
                      right: "0",
                      backgroundColor: "#f8f9fa",
                      borderColor: "#001f3d",
                    }}
                  >
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      style={{
                        color: "#001f3d",
                        fontSize: "1rem",
                      }}
                    >
                      My Profile
                    </Link>
                  </div>
                )}
              </li>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SidebarNavbar;
