import nodemailer from 'nodemailer';

export async function sendAdminCreationEmail(admin,password) {
  if (!admin || !admin.email || !admin.name) {
    console.error("Admin email or name is missing or undefined");
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
    subject: 'Admin Account Creation Confirmation',
    text: `
      Hello ${admin.name},

      Congratulations! Your admin account has been created successfully.

      Here are your login credentials:

      Email: ${admin.email}
      Password: ${password}

      Please make sure to change your password after logging in for security purposes.

      If you have any questions or need assistance, feel free to contact support.

      Welcome aboard, and we look forward to working with you!

      Best regards,
      The Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin creation email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
