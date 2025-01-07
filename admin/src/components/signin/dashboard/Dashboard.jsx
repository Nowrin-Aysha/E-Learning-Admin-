import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaBell, FaUserCircle } from "react-icons/fa";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// isSuperAdmin=localStorage.getItem('isSuperAdmin'&&'isSuperAdmin')

const Dashboard = () => {
  const [superAdmin, setSuperAdmin] = useState(false);
  const [mentor, setMentor] = useState(false);
  const [count, setCount] = useState("0");
  const [showNotification, setShowNotification] = useState(false);
  const [user, setUser] = useState({});
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const token = localStorage.getItem("token");
useEffect(() => {
if(token){
  navigate('/dashboard')
}
else{
  navigate('/')
}
}, [])

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("data"));
if(data){
    setSuperAdmin(data.isSuperAdmin);
    setMentor(data.isMentor);

    setUser({
      name: data.name,
      email: data.email,
      role: data.role,
      profilePicture: data.profilePicture,
    });
  }
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5001/api/mentor/pendingMentorsCount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setCount(response.data.pendingMentors);
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  const courseEnrollmentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Courses Enrolled",
        data: [50, 100, 150, 200, 250, 300, 350],
        backgroundColor: "#001f3d",
        borderColor: "#001f3d",
        borderWidth: 1,
      },
    ],
  };

  const studentEnrollmentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Students Enrolled",
        data: [200, 300, 400, 500, 600, 700, 800],
        backgroundColor: "#4BC0C0",
        borderColor: "#4BC0C0",
        borderWidth: 1,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/");
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleNotificationClick = () => {
    navigate("/mentors");
    setShowNotification(false);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <div
      className="container-fluid"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div className="row h-100">
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
            <li className="nav-item">
              <Link className="nav-link text-white" to="/students">
                <div className="sidebar-option">
                  <i className="bi bi-person-fill"></i> Student Management
                </div>
              </Link>
            </li>

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

        <div
          className="col-md-10 offset-md-2 p-3"
          style={{ marginLeft: "16.6667%" }}
        >
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">
                E-Learning Dashboard
              </a>
              <div className="navbar-nav ms-auto">
                {/* {superAdmin && (
                  // <li className="nav-item">
                  //   <Link
                  //     className="btn btn-primary mx-2"
                  //     to="/add-admin"
                  //     style={{ backgroundColor: "#001f3d" }}
                  //   >
                  //     Add Admin
                  //   </Link>
                  // </li>
                )} */}
                {/* {!mentor && (
                  <li className="nav-item">
                    <Link
                      className="btn btn-primary mx-2"
                      to="/add-mentor"
                      style={{ backgroundColor: "#001f3d" }}
                    >
                      Add Mentor
                    </Link>
                  </li>
                )} */}
                {/* <li className="nav-item">
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
                )} */}

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
                    {user.profilePicture ? (
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
                    )}
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

                      {/* <button className="dropdown-item" onClick={handleLogout}>
        Logout
      </button> */}
                    </div>
                  )}
                </li>
              </div>
            </div>
          </nav>

          {showNotification && (
            <div
              className="modal"
              style={{ display: "block" }}
              onClick={toggleNotification}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Pending Mentors</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={toggleNotification}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body" style={{ cursor: "pointer" }}>
                    <p onClick={handleNotificationClick}>
                      You have {count} pending mentor requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row g-4 mt-5">
            <div className="col-md-3">
              <div
                className="card text-white"
                style={{ backgroundColor: "#001f3d" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Students</h5>
                  <p className="card-text" style={{ fontSize: "2rem" }}>
                    1500
                  </p>
                  <Link
                    className="btn btn-light mt-2"
                    to="/students"
                    style={{ backgroundColor: "#001f3d", color: "#ffffff"  }}
                  >
                    View Students
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="card text-white"
                style={{ backgroundColor: "#4BC0C0" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Total Courses</h5>
                  <p className="card-text" style={{ fontSize: "2rem" }}>
                    120
                  </p>
                  <Link
                    className="btn btn-light mt-2"
                    to="/courses"
                    style={{ backgroundColor: "#4BC0C0" }}
                  >
                    View Courses
                  </Link>
                </div>
              </div>
            </div>
            {!mentor && (
              <div className="col-md-3">
                <div
                  className="card text-white"
                  style={{ backgroundColor: "#001f3d" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Total Mentors</h5>
                    <p className="card-text" style={{ fontSize: "2rem" }}>
                      75
                    </p>
                    <Link
                      className="btn btn-light mt-2"
                      to="/mentors"
                      style={{ backgroundColor: "#001f3d", color: "#ffffff"  }}
                    >
                      View Mentors
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {superAdmin && (
              <div className="col-md-3">
                <div
                  className="card text-white"
                  style={{ backgroundColor: "#4BC0C0" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Total Admins</h5>
                    <p className="card-text" style={{ fontSize: "2rem" }}>
                      10
                    </p>
                    <Link
                      className="btn btn-light mt-2"
                      to="/admins"
                      style={{ backgroundColor: "#4BC0C0" }}
                    >
                      View Admins
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="row g-4 mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Course Enrollment</div>
                <div className="card-body">
                  <Bar data={courseEnrollmentData} />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Student Enrollment</div>
                <div className="card-body">
                  <Bar data={studentEnrollmentData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
