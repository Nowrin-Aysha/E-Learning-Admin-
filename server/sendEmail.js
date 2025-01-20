import nodemailer from 'nodemailer';

export async function sendAdminCreationEmail(admin) {
    console.log(admin,'sdnm');
    
  if (!admin.email) {
    console.error("Admin email is missing or undefined");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: admin.email,
    subject: 'Admin Creation Confirmation',
    text: `Hello ${admin.name},\n\nYour admin account has been created successfully!`,
  };

  console.log("Sending email with options:", mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin creation email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
