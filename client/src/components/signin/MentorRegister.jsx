import React, { useEffect, useState } from 'react';
import FormElements from './FormElements';
import { registerMentor } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';  

const Register = () => {
  const navigate = useNavigate();
  const motionText = ['email', 'name', 'phone', 'password', 'confirmPassword'];
  const [loading, setLoading] = useState(false);  // Add loading state to handle loading state
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e, formValues) => {
    e.preventDefault();

    setLoading(true); // Show loading state while the request is in progress
    const loadingToastId = toast.loading(<b>Creating...</b>);

    try {
      const response = await registerMentor(formValues);
      const successMessage = response.msg || 'Registered successfully!';

      toast.dismiss(loadingToastId);

      toast.success(<b>{successMessage}</b>, { duration: 2000 });

      // Redirect to OTP validation page
      navigate('/validate-otp', { state: { email: formValues.email } });  // Pass email to OTP page

    } catch (error) {
      console.error('Error during registration:', error);

      toast.dismiss(loadingToastId);

      toast.error(<b>{error.error || 'Could not register..!!'}</b>);
    } finally {
      setLoading(false); // Hide loading state once the request completes
    }
  };

  return (
    <>
      <Toaster />
      <FormElements
        motionText={motionText}
        buttonText={loading ? 'Registering...' : 'Register'}  // Update button text based on loading state
        additionalText='Already have an account ?'
        linkText='Login'
        urlLogin='/'
        handleSubmit={(e, formValues) => handleSubmit(e, formValues)}
      />

      <div className="d-flex justify-content-between mt-3">
        <p className="mb-0">
          <Link to="/mentorLogin" className="text-decoration-none">Login as Mentor</Link>
        </p>
        <p className="mb-0">
          <Link to="/" className="text-decoration-none">Admin Login</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
