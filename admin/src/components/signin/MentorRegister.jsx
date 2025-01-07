import React, { useEffect } from 'react';
import FormElements from './FormElements';
import { registerMentor } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';  

const Register = () => {
  const navigate = useNavigate();
  const motionText = ['email', 'name','phone', 'password', 'confirmPassword'];
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e, formValues) => {
    e.preventDefault();

    const loadingToastId = toast.loading(<b>Creating...</b>);

    try {
      const response = await registerMentor(formValues);
      const successMessage = response.msg ? response.msg : 'Registered successfully!';

      const delay = new Promise((resolve) => setTimeout(resolve, 1000));

      await Promise.all([response, delay]);

      toast.dismiss(loadingToastId);

      toast.success(<b>{successMessage}</b>, {
        duration: 2000,
      });

      setTimeout(() => {
        navigate('/mentorLogin');
      }, 1000);

    
    } catch (error) {
      console.error('Error during registration:', error);

      toast.dismiss(loadingToastId);

      toast.error(<b>{error.error || 'Could not register..!!'}</b>);
    }
  };

  return (
    <>
      <Toaster />
      <FormElements
        motionText={motionText}
        buttonText='Register'
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
