const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON requests

// Configure Nodemailer using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arthikumari269@gmail.com', // Your Gmail address
    pass: 'taip gsbl lixq fmws'     // Use App Password if 2FA is enabled
  }
});

// API to store user data by sending it to email
app.post('/store-user-data', async (req, res) => {
  const { email, uid } = req.body;

  if (!email || !uid) {
    return res.status(400).json({ success: false, message: 'Missing required data' });
  }

  const mailOptions = {
    from: 'arthikumari269@gmail.com',
    to: 'arthikumari269@gmail.com', // Send it to yourself
    subject: 'New User Data',
    text: `User Email: ${email}\nUser UID: ${uid}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('User data sent to email!');
    res.json({ success: true, message: 'User data sent to your email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
