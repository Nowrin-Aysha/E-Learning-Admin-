import React, { useState } from 'react';
import { motion } from 'framer-motion';


// const rubber = () => {
//   return {
//     transform: [
//       'scale3d(1,1,1)',
//       'scale3d(1.4,.55,1)',
//       'scale3d(.75,1.25,1)',
//       'scale3d(1.25,.85,1)',
//       'scale3d(.9,1.05,1)',
//       'scale3d(1,1,1)',
//     ],
//   };
// };

const FormElements = ({ motionText, buttonText, handleSubmit }) => {
  const [formValues, setFormValues] = useState({});

  
  const handleInputChange = (label, value) => {
    console.log(formValues);
    
    setFormValues((prevValues) => ({ ...prevValues, [label]: value }));
  };

  return (
    <>
      <style>
        {`
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(45deg, #001f3d, #00bcd4);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .form-container {
            background-color: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
          }

          .form-container h2 {
            font-size: 2rem;
            font-weight: bold;
            color: #001f3d;
            margin-bottom: 20px;
          }

          .form-container p {
            font-size: 1rem;
            color: #555;
            margin-bottom: 30px;
          }

          label {
            font-size: 1rem;
            font-weight: 500;
            color: #333;
            display: block;
            margin-bottom: 8px;
          }

          input {
            width: 100%;
            padding: 12px;
            font-size: 1rem;
            border-radius: 8px;
            border: 2px solid #00bcd4;
            margin-bottom: 15px;
            outline: none;
            transition: all 0.3s ease;
            background-color: #1e2a47; /* Dark blue background for the input */
            color: white; /* White text color */
          }

          input:focus {
            border-color: #3498db;
            box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
          }

          button {
            width: 100%;
            padding: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            background-color: #00bcd4;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          button:hover {
            background-color: #3498db;
          }

          .form-container .register-link {
            font-size: 0.9rem;
            color: #00bcd4;
            display: block;
            margin-top: 15px;
            text-decoration: none;
          }

          .form-container .register-link:hover {
            color: #3498db;
          }

          .additional-text {
            font-size: 0.9rem;
            color: #555;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
            margin-top: 20px;
          }
          
          .additional-text a {
            font-weight: bold;
            color: #00bcd4;
            text-decoration: none;
          }

          .additional-text a:hover {
            color: #3498db;
          }

        `}
      </style>

      <form className="form-container" onSubmit={(e) => handleSubmit(e, formValues)}>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Login
        </motion.h2>

        <p>Enter your credentials to log in</p>

        {motionText.map((label, index) => (
          <div key={index} className="input-group">
            <motion.label
              whileHover={{ scale: 1.1, color: '#3498db' }}
              transition={{ duration: 0.3 }}
            >
              {label}
            </motion.label>
            <motion.input
              type={label.toLowerCase().includes('password') ? 'password' : 'text'}
              whileHover={{
                scale: 1.05,
                borderColor: '#3498db',
                boxShadow: '0 0 10px rgba(52, 152, 219, 0.4)',
              }}
              transition={{ duration: 0.3 }}
              onChange={(e) => handleInputChange(label, e.target.value)}
            />
          </div>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {buttonText}
        </motion.button>
      </form>
    </>
  );
};

export default FormElements;
