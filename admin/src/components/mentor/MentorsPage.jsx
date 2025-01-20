import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Navbar, Nav, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarNavbar from "../signin/dashboard/SidebarNavbar";
import { useNavigate } from "react-router-dom";
import { FaBan, FaUnlockAlt } from "react-icons/fa";

const MentorsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedMentor, setEditedMentor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reload, setReload] = useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedMentors, setSelectedMentors] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5001/api/mentor/getMentors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMentors(response.data.data);
    };
    fetchData();
  }, [token, reload]);


  
  useEffect(() => {
    if (token) {
      if (role === "admin") {
        navigate("/mentors");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/");
    }
  }, [token, role]);

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    setEditedMentor({ ...mentor });
    setImagePreview(mentor.photo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(false);
    setSelectedMentor(null);
    setEditedMentor(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleDeleteMentor = (mentorId) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          `http://localhost:5001/api/mentor/deleteMentor/${mentorId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.error === false) {
          Swal.fire("Deleted!", "Your mentor has been deleted.", "success");
          setReload(!reload);
        }
        handleCloseModal();
      }
    });
  };

  const handleApproveMentor = async (mentorId) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          `http://localhost:5001/api/mentor/updateMentorStatus/${mentorId}`,
          { status: "1" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.error === false) {
          Swal.fire("Approved!", "Mentor has been approved.", "success");
          setReload(!reload);
        }
        handleCloseModal();
      }
    });
  };

  const handleRejectMentor = async (mentorId) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          `http://localhost:5001/api/mentor/updateMentorStatus/${mentorId}`,
          { status: "2" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.error === false) {
          Swal.fire("Rejected!", "Mentor has been rejected.", "success");
          setReload(!reload);
        }
        handleCloseModal();
      }
    });
  };

  const handleEditMentor = () => {
    setEditing(true);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    const validationErrors = validateMentor(editedMentor);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const isEmailUnique = !mentors.some(
      (mentor) =>
        mentor.email === editedMentor.email && mentor._id !== selectedMentor._id
    );
    const isPhoneUnique = !mentors.some(
      (mentor) =>
        mentor.phone === editedMentor.phone && mentor._id !== selectedMentor._id
    );

    if (!isEmailUnique) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is already in use. it must be unique.",
      }));
      return;
    }

    if (!isPhoneUnique) {
      setErrors((prev) => ({ ...prev, phone: "Phone number must be unique." }));
      return;
    }

    const formData = new FormData();
    formData.append("name", editedMentor.name);
    formData.append("email", editedMentor.email);
    formData.append("phone", editedMentor.phone);
    formData.append("photo", editedMentor.photo);

    try {
      const response = await axios.post(
        `http://localhost:5001/api/mentor/updatementor/${selectedMentor._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error === false) {
        setReload(!reload);
        Swal.fire(
          "Success!",
          "Mentor details updated successfully.",
          "success"
        );
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating mentor:", error);
      Swal.fire(
        "Error!",
        "There was an error updating the mentor details.",
        "error"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMentor({
      ...editedMentor,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedMentor({
          ...editedMentor,
          photo: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateMentor = (mentor) => {
    const errors = {};

    if (!mentor.name || mentor.name.trim() === "") {
      errors.name = "Name is required";
    }

    if (!mentor.email || mentor.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mentor.email)) {
      errors.email = "Invalid email format";
    }

    if (!mentor.phone || mentor.phone.trim() === "") {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(mentor.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }

    return errors;
  };

  const handleBlockMentor = async (mentorId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:5001/api/mentor/blockMentor/${mentorId}`,
      { isBlocked: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.error === false) {
      setReload(!reload);
      Swal.fire("Blocked!", "Mentor has been blocked.", "success");
    }
  };

  const handleUnblockMentor = async (mentorId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:5001/api/mentor/unblockMentor/${mentorId}`,
      { isBlocked: false },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.error === false) {
      setReload(!reload);
      Swal.fire("Unblocked!", "Mentor has been unblocked.", "success");
    }
  };

  const handleSelectMentor = (mentorId) => {
    setSelectedMentors((prevSelectedMentors) => {
      if (prevSelectedMentors.includes(mentorId)) {
        return prevSelectedMentors.filter((id) => id !== mentorId);
      } else {
        return [...prevSelectedMentors, mentorId];
      }
    });
  };

  const handleDeleteSelectedMentors = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire(
          "Error",
          "No authentication token found. Please log in.",
          "error"
        );
        return;
      }

      if (!selectedMentors || selectedMentors.length === 0) {
        Swal.fire("Error", "No mentors selected for deletion.", "error");
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:5001/api/mentor/deleteMentors`,
          { mentorIds: selectedMentors },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.error === false) {
          setSelectedMentors([]);
          setReload((prev) => !prev);
          Swal.fire(
            "Deleted!",
            "Selected mentors have been deleted.",
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            "Something went wrong. Mentors not deleted.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Failed to delete mentors. Please try again later.",
          "error"
        );
      }
    }
  };

  const handleSelectAllMentors = (isChecked) => {
    if (isChecked) {
      setSelectedMentors(filteredMentors.map((mentor) => mentor._id));
    } else {
      setSelectedMentors([]);
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    const nameMatches = mentor.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const emailMatches = mentor.email
      .toLowerCase()
      .includes(search.toLowerCase());
    const statusMatches = statusFilter ? mentor.status === statusFilter : true;

    return (nameMatches || emailMatches) && statusMatches;
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <SidebarNavbar />

      <div style={{ flex: 1, marginLeft: "250px" }}>
        <div style={{ padding: "20px" }}>
          <h2 className="text-center mb-4">Our Mentors</h2>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                as="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
                <option value="3">Pending</option>
              </Form.Control>
            </Col>
          </Row>

          {selectedMentors.length > 0 && (
            <Button
              variant="danger"
              onClick={handleDeleteSelectedMentors}
              style={{ marginBottom: "20px" }}
            >
              Delete Selected Mentors
            </Button>
          )}

          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAllMentors(e.target.checked)}
                    checked={
                      filteredMentors.length > 0 &&
                      filteredMentors.every((mentor) =>
                        selectedMentors.includes(mentor._id)
                      )
                    }
                  />
                </th>
                <th scope="col">Profile</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Status</th>
                <th scope="col">Joined Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor) => (
                <tr key={mentor._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMentors.includes(mentor._id)}
                      onChange={() => handleSelectMentor(mentor._id)}
                    />
                  </td>
                  <td>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #ccc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f1f1f1",
                        cursor: "pointer",
                      }}
                      onClick={() => handleMentorClick(mentor)}
                    >
                      {mentor.photo ? (
                        <img
                          src={`http://localhost:5001/${mentor.photo}`}
                          alt={mentor.name}
                          className="img-fluid"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: "18px",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{mentor.name}</td>
                  <td>{mentor.email}</td>
                  <td>{mentor.phone}</td>
                  <td>
                    {mentor.status === "1" && (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Approved
                      </span>
                    )}
                    {mentor.status === "2" && (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Rejected
                      </span>
                    )}
                    {mentor.status === "3" && (
                      <span style={{ color: "blue", fontWeight: "bold" }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    {new Date(mentor.joinedDate).toLocaleDateString("en-GB")}
                  </td>

                  <td>
                    {mentor.status === "3" && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleApproveMentor(mentor._id)}
                          className="mx-1"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRejectMentor(mentor._id)}
                          className="mx-1"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {mentor.status !== "3" && mentor.status !== "2" && (
                      <>
                        <Button
                          variant="light"
                          onClick={() => handleMentorClick(mentor)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="dark"
                          onClick={() => handleDeleteMentor(mentor._id)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {mentor.status === "2" && (
                      <>
                        <Button
                          variant="light"
                          onClick={() => handleApproveMentor(mentor._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="dark"
                          onClick={() => handleDeleteMentor(mentor._id)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      {mentor.isBlocked ? (
                        <FaUnlockAlt
                          style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "green",
                          }}
                          onClick={() => handleUnblockMentor(mentor._id)}
                        />
                      ) : (
                        <FaBan
                          style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "red",
                          }}
                          onClick={() => handleBlockMentor(mentor._id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedMentor && (
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editing ? "Edit Mentor" : selectedMentor.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="text-center">
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      marginBottom: "20px",
                      border: "2px solid #ccc",
                      overflow: "hidden",
                      backgroundColor: "#f1f1f1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedMentor.photo || imagePreview ? (
                      <img
                        src={`http://localhost:5001/${
                          selectedMentor.photo || imagePreview
                        }`}
                        alt={selectedMentor.name}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                        className="img-fluid"
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: "32px",
                          color: "#333",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedMentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h5>
                    {editing ? "Edit Mentor Information" : selectedMentor.name}
                  </h5>
                </div>
                {editing ? (
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={editedMentor.name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={editedMentor.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={editedMentor.phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPhoto">
                      <Form.Label>Profile Photo</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        isInvalid={!!errors.photo}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.photo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                ) : (
                  <>
                    <p>
                      <strong>Email:</strong> {selectedMentor.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedMentor.phone}
                    </p>
                    <p>
                      <strong>Joined Date:</strong>{" "}
                      {new Date(selectedMentor.joinedDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
                {editing ? (
                  <Button variant="primary" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleEditMentor}>
                    Edit
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteMentor(selectedMentor._id)}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;
