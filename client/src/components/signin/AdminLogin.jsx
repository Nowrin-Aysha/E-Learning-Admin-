import React, { useEffect, useState } from 'react';
import FormElements from './FormElements';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../helper/helper';
import { Link } from 'react-router-dom'; 
const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const motionText = ['email', 'password'];

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleInputChange = (label, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLoginSubmit = async (e, formValues) => {
    e.preventDefault();

    const { email, password } = formValues;

    if (!email || !password) {
      toast.error('Both email and password are required.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading(<b>Logging in...</b>);

    try {
      const response = await loginAdmin(formValues);

      const successMessage = response.msg || 'Login successful!';

      const delay = new Promise(resolve => setTimeout(resolve, 1000));

      await Promise.all([response, delay]);

      toast.dismiss(loadingToastId);
      toast.success(<b>{successMessage}</b>, { duration: 2000 });

      localStorage.setItem("token", response.token);
      localStorage.setItem('role',response.role)
      localStorage.setItem('isSuperAdmin',response.isSuperAdmin)
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);

      toast.dismiss(loadingToastId);
      toast.error(<b>{error?.error || 'Could not login..!!'}</b>);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <FormElements
        motionText={motionText}
        buttonText={isSubmitting ? 'Logging in...' : 'Login'}
        handleSubmit={handleLoginSubmit}
        formType="login"
        handleInputChange={handleInputChange}
      />
      {/* Additional Navigation Links */}
      <div className="auth-links">
        
        <p>
          Are you a mentor? <Link to="/MentorLogin">Login as Mentor</Link>
        </p>
        <p>
          New to mentoring? <Link to="/MentorRegister">Register as Mentor</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
