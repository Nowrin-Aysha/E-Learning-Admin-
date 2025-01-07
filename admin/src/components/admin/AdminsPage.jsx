import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarNavbar from "../signin/dashboard/SidebarNavbar";
import { useNavigate } from "react-router-dom";
import { FaBan, FaUnlockAlt } from "react-icons/fa";

const AdminsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState({});
  const [superAdmin, setSuperAdmin] = useState(false);
  const [mentor, setMentor] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isSuperAdmin = JSON.parse(localStorage.getItem("isSuperAdmin"));

  useEffect(() => {
    if (token) {
      if (role === "admin" && isSuperAdmin === true) {
        navigate("/admins");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/");
    }
  }, [token, role, isSuperAdmin]);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("data"));
    setSuperAdmin(data.isSuperAdmin);
    setMentor(data.isMentor);
    setUser({
      name: data.name,
      email: data.email,
      role: data.role,
      profilePicture: data.profilePicture,
    });

    const fetchAdmins = async () => {
      const response = await axios.get("http://localhost:5001/api/admin/getAdmins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data.data);
    };
    fetchAdmins();
  }, [reload]);

  const handleAdminClick = (admin) => {
    setSelectedAdmin(admin);
    setEditedAdmin({ ...admin });
    setImagePreview(admin.photo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(false);
    setSelectedAdmin(null);
    setEditedAdmin(null);
    setImagePreview(null);
  };

  const handleDeleteAdmin = (adminId) => {
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
          `http://localhost:5001/api/admin/deleteAdmin/${adminId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.error === false) {
          Swal.fire("Deleted!", "Your admin has been deleted.", "success");
          setReload(!reload);
        }
        handleCloseModal();
      }
    });
  };

  const handleEditAdmin = () => {
    setEditing(true);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", editedAdmin.name);
    formData.append("email", editedAdmin.email);
    formData.append("phone", editedAdmin.phone);
    formData.append("password", editedAdmin.password);
    formData.append("photo", editedAdmin.photo);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/admin/updateAdmin/${selectedAdmin._id}`,
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
        Swal.fire("Success!", "Admin details updated successfully.", "success");
        handleCloseModal();
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "There was an error updating the admin details.",
        "error"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAdmin({
      ...editedAdmin,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedAdmin({
          ...editedAdmin,
          photo: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const handleBlockAdmin = async (adminId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:5001/api/admin/blockAdmin/${adminId}`,
      { isBlocked: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.error === false) {
      setReload(!reload);
      Swal.fire("Blocked!", "Admin has been blocked.", "success");
    }
  };

  const handleUnblockAdmin = async (adminId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:5001/api/admin/unblockAdmin/${adminId}`,
      { isBlocked: false },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.error === false) {
      setReload(!reload);
      Swal.fire("Unblocked!", "Admin has been unblocked.", "success");
    }
  };

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins((prevSelectedAdmins) => {
      if (prevSelectedAdmins.includes(adminId)) {
        return prevSelectedAdmins.filter((id) => id !== adminId);
      } else {
        return [...prevSelectedAdmins, adminId];
      }
    });
  };

  const handleDeleteSelectedAdmins = async () => {
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

      if (!selectedAdmins || selectedAdmins.length === 0) {
        Swal.fire("Error", "No admins selected for deletion.", "error");
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:5001/api/admin/deleteAdmins`,
          { adminIds: selectedAdmins },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.error === false) {
          setSelectedAdmins([]);
          setReload((prev) => !prev);
          Swal.fire(
            "Deleted!",
            "Selected admins have been deleted.",
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            "Something went wrong. Admins not deleted.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Failed to delete admins. Please try again later.",
          "error"
        );
      }
    }
  };

  const handleSelectAllAdmins = (isChecked) => {
    if (isChecked) {
      setSelectedAdmins(filteredAdmins.map((admin) => admin._id));
    } else {
      setSelectedAdmins([]);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const nameMatches = admin.name.toLowerCase().includes(search.toLowerCase());
    const emailMatches = admin.email
      .toLowerCase()
      .includes(search.toLowerCase());
    const statusMatches = statusFilter ? mentor.status === statusFilter : true;

    return (nameMatches || emailMatches) && statusMatches;
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <SidebarNavbar superAdmin={true} />

      <div style={{ flex: 1, marginLeft: "250px" }}>
        <div style={{ padding: "20px" }}>
          <h2 className="text-center mb-4">Our Admins</h2>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
          </Row>

          {selectedAdmins.length > 0 && (
            <Button
              variant="danger"
              onClick={() =>
                selectedAdmins.forEach(async (adminId) => {
                  await handleDeleteAdmin(adminId);
                })
              }
              style={{ marginBottom: "20px" }}
            >
              Delete Selected Admins
            </Button>
          )}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAllAdmins(e.target.checked)}
                    checked={admins.length > 0 && admins.every((admin) => selectedAdmins.includes(admin._id))}
                  />
                </th>
                <th scope="col">Profile</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Joined Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins
                .filter((admin) => admin.name.toLowerCase().includes(search.toLowerCase()) || admin.email.toLowerCase().includes(search.toLowerCase()))
                .map((admin) => (
                  <tr key={admin._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedAdmins.includes(admin._id)}
                        onChange={() => handleSelectAdmin(admin._id)}
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
                        onClick={() => handleAdminClick(admin)}
                      >
                        {admin.photo ? (
                          <img
                            src={`http://localhost:5001/${admin.photo}`}
                            alt={admin.name}
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
                            {admin.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phone}</td>
                    <td>{new Date(admin.joinedDate).toLocaleDateString("en-GB")}</td>
                    <td>
                      <Button
                        variant="light"
                        onClick={() => handleAdminClick(admin)}
                        className="mx-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="dark"
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="ml-2"
                      >
                        Delete
                      </Button>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        {admin.isBlocked ? (
                          <FaUnlockAlt
                            style={{
                              cursor: "pointer",
                              fontSize: "20px",
                              color: "green",
                            }}
                            onClick={() => handleUnblockAdmin(admin._id)}
                          />
                        ) : (
                          <FaBan
                            style={{
                              cursor: "pointer",
                              fontSize: "20px",
                              color: "red",
                            }}
                            onClick={() => handleBlockAdmin(admin._id)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {selectedAdmin && (
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editing ? "Edit Admin" : selectedAdmin.name}
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
                    {selectedAdmin.photo || imagePreview ? (
                      <img
                        src={`http://localhost:5001/${
                          selectedAdmin.photo || imagePreview
                        }`}
                        alt={selectedAdmin.name}
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
                        {selectedAdmin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h5>
                    {editing ? "Edit Admin Information" : selectedAdmin.name}
                  </h5>
                </div>
                {editing ? (
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={editedAdmin.name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={editedAdmin.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={editedAdmin.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formPhoto">
                      <Form.Label>Profile Photo</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                  </Form>
                ) : (
                  <>
                    <p>
                      <strong>Email:</strong> {selectedAdmin.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedAdmin.phone}
                    </p>
                    <p>
                      <strong>Joined Date:</strong>{" "}
                      {new Date(selectedAdmin.joinedDate).toLocaleDateString(
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
                  <Button variant="primary" onClick={handleEditAdmin}>
                    Edit
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteAdmin(selectedAdmin._id)}
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

export default AdminsPage;
