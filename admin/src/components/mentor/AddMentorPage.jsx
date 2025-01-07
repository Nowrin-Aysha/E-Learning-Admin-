import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';



const AddMentor = () => {
  const [mentorData, setMentorData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    photo: null,
  });

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  
  useEffect(() => {
    if (token) {
      if (role === 'admin') {
        navigate('/add-mentor');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
  }, [token, role]); 

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMentorData({
      ...mentorData,
      [name]: value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setMentorData({
        ...mentorData,
        photo: file,
      });
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!mentorData.name) newErrors.name = "Please enter name.";
    if (!mentorData.email) {
      newErrors.email = "Please enter email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mentorData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!mentorData.phone) {
      newErrors.phone = "Please enter phone number.";
    } else if (!/^\d{10}$/.test(mentorData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!mentorData.password) {
      newErrors.password = "Password is required.";
    } else if (mentorData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(mentorData.password)) {
      newErrors.password = "Password should contain at least one special character.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', mentorData.name);
        formData.append('email', mentorData.email);
        formData.append('phone', mentorData.phone);
        formData.append('password', mentorData.password);
        formData.append('photo', mentorData.photo);

        const response = await axios.post('http://localhost:5001/api/mentor/addmentor', formData, {
        
          
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
console.log(response);

        if (response.data.error === 'Email already in use. Please use a unique email.') {
          setErrors({ email: 'Email is already registered.' });
          setLoading(false);
        } else if (response.data.error === 'Phone number already in use. Please use a unique phone number.') {
          setErrors({ phone: 'Phone number is already registered.' });
          setLoading(false);
        } else if (response.status === 200) {
          setShowModal(true);
          setMentorData({ name: '', email: '', phone: '', password: '', photo: null });

          setTimeout(() => {
            setShowModal(false);
            navigate('/mentors');
          }, 3000);
        }
      } catch (error) {
        console.log("nnnnnnnnnnnnnnnnnnnn");
        console.log(error.response.data.error);
        
        
        console.error('Error adding mentor:', error);

        if (error.response) {
          setErrors({ submit: error.response.data.error || "Something went wrong!" });
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
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="text-center mb-4">Add Mentor</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={mentorData.name}
              onChange={handleInputChange}
              placeholder="Enter mentor's name"
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
              value={mentorData.email}
              onChange={handleInputChange}
              placeholder="Enter mentor's email"
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
              value={mentorData.phone}
              onChange={handleInputChange}
              placeholder="Enter mentor's phone number"
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
              value={mentorData.password}
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

          {mentorData.photo && (
            <div className="mb-3 d-flex justify-content-center">
              <img
                src={URL.createObjectURL(mentorData.photo)}
                alt="Mentor Preview"
                className="img-fluid rounded"
                style={{
                  maxHeight: '200px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
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
            {loading ? 'Adding Mentor...' : 'Add Now'}
          </button>
        </form>
      </div>

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
            Mentor Added Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4>{mentorData.name}</h4>
          <p>The mentor has been successfully added to the system.</p>
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

export default AddMentor;
