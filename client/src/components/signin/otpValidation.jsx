import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

const OtpValidation = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // Get email passed from Register page

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/mentor/validateOTP', { email, otp });
      toast.success(response.data.msg);

      // Redirect to login after successful OTP validation
      navigate('/mentorLogin');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to validate OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        height: "100vh",
         width: "100vw",
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%', // Take full width of the screen
          maxWidth: '400px', // Set a maximum width (optional)
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ color: '#003366', marginBottom: 2 }}>
          Enter OTP
        </Typography>

        <TextField
          label="Enter OTP"
          variant="outlined"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleOtpSubmit}
          disabled={loading}
          sx={{
            backgroundColor: '#003366',
            color: 'white',
            '&:hover': {
              backgroundColor: '#00509e',
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Validate OTP'}
        </Button>
      </Box>
    </Box>
  );
};

export default OtpValidation;
