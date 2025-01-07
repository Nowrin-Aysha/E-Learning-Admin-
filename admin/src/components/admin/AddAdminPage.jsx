import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; 
import axios from 'axios';

const AddAdmin = () => {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    photo: null,
  });
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isSuperAdmin = JSON.parse(localStorage.getItem('isSuperAdmin')); 
  
  useEffect(() => {
    if (token) {
      if (role === 'admin' && isSuperAdmin === true) {
        navigate('/add-admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
  }, [token, role, isSuperAdmin]); 
  
  

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAdminData({
        ...adminData,
        photo: file,
      });
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!adminData.name) newErrors.name = "Please enter name.";
    if (!adminData.email) {
      newErrors.email = "Please enter email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!adminData.phone) {
      newErrors.phone = "Please enter phone number.";
    } else if (!/^\d{10}$/.test(adminData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!adminData.password) {
      newErrors.password = "Password is required.";
    } else if (adminData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('name', adminData.name);
      formData.append('email', adminData.email);
      formData.append('phone', adminData.phone);
      formData.append('password', adminData.password);
      formData.append('photo', adminData.photo);

      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5001/api/admin/addadmin', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setShowModal(true);
          setAdminData({ name: '', email: '', phone: '', password: '', photo: null });

          setTimeout(() => {
            setShowModal(false);
            navigate('/admins');
          }, 3000);
        }
      } catch (error) {
        console.error('Error adding admin:', error);
        if (error.response) {
          setErrors({ submit: error.response.data.message || "An error occurred while adding the admin." });
        } else if (error.request) {
          setErrors({ submit: "No response from server. Please try again later." });
        } else {
          setErrors({ submit: "Unexpected error. Please try again later." });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh', padding: '0', width: '100vw' }}>
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Add Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={adminData.name}
              onChange={handleInputChange}
              placeholder="Enter admin's name"
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={adminData.email}
              onChange={handleInputChange}
              placeholder="Enter admin's email"
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={adminData.phone}
              onChange={handleInputChange}
              placeholder="Enter admin's phone number"
            />
            {errors.phone && <small className="text-danger">{errors.phone}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={adminData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="photo" className="form-label">Upload Photo (Optional)</label>
            <input
              type="file"
              className="form-control"
              id="photo"
              name="photo"
              onChange={handlePhotoUpload}
            />
          </div>

          {adminData.photo && (
            <div className="mb-3">
              <img src={URL.createObjectURL(adminData.photo)} alt="Admin Preview" className="img-fluid" />
            </div>
          )}

          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ backgroundColor: '#001f3d' }}
            disabled={loading}
          >
            {loading ? 'Adding Admin...' : 'Add Now'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center text-success">
            <FaCheckCircle size={50} />
            <br />
            Admin Added Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4>{adminData.name}</h4>
          <p>The admin has been successfully added to the system.</p>
          <p>Thank you for your submission!</p>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button
            variant="success"
            onClick={() => setShowModal(false)}
            style={{ borderRadius: '50px', padding: '10px 20px' }}
          >
            <strong>Close</strong>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAdmin;
