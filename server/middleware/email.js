const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const verificationCodes = {};

//generate a random 6 digit code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

//send verification email
const sendVerificationEmail = async (email, username) => {
  const code = generateVerificationCode();

  //store verification code with expiry (5 minutes)
  verificationCodes[username] = {
    code,
    expiry: Date.now() + 5 * 60 * 1000
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Login Verification Code',
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Login Verification Code</h2>
      <p>Hi <strong>${username}</strong>,</p>
      <p>Your verification code is:</p>
      <div style="font-size: 20px; font-weight: bold; color: #ff6600; background: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">
        ${code}
      </div>
      <p style="color: #777; font-size: 14px;">This code will expire in <strong>5 minutes</strong>.</p>
    </div>
  `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification code sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send verification email');
  }
};

//verify the code entered by the user
const verifyCode = (username, code) => {
  const storedData = verificationCodes[username];

  if (!storedData) {
    return false;
  }

  //Check expiry time
  if (Date.now() > storedData.expiry) {
    delete verificationCodes[username];
    return false;
  }

  if (storedData.code === code) {
    delete verificationCodes[username];
    return true;
  }

  return false;
};

console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('Email User:', process.env.EMAIL_USER);
console.log('JWT Secret:', process.env.JWT_SECRET);

module.exports = { sendVerificationEmail, verifyCode };
