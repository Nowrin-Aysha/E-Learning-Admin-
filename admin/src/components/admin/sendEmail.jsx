import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// Function to send a verification email
export async function sendVerificationEmail(admin) {
  const verificationToken = uuidv4(); // Generate a unique verification token

  // Configure the email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // Your email address
      pass: 'your-email-password',   // Your email password
    },
  });

  // Create email content
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: admin.email,
    subject: 'Please verify your email address',
    text: `Click the link below to verify your email address:
      http://localhost:5001/api/admin/verify-email/${verificationToken}`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
