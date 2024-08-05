const { User, Conversation, Booking } = require('../database/db');
const nodemailer = require('nodemailer');
require("dotenv").config();

const counselors = [
  { id: 1, name: "Dr. Emily Johnson", experience: 10, phoneNumber: "+1234567890", pricePerHour: 100 },
  { id: 2, name: "Dr. Michael Chen", experience: 15, phoneNumber: "+1987654321", pricePerHour: 120 },
  { id: 3, name: "Dr. Sarah Williams", experience: 8, phoneNumber: "+1122334455", pricePerHour: 90 },
  { id: 4, name: "Dr. David Thompson", experience: 12, phoneNumber: "+1555666777", pricePerHour: 110 },
];

async function getCounselors() {
  return counselors;
}

async function bookCounselor(counselorId, fullName, email, date, time) {
  const counselor = counselors.find(c => c.id === counselorId);
  if (!counselor) {
    throw new Error('Counselor not found');
  }

  const bookingId = Math.random().toString(36).substr(2, 9);
  const booking = {
    bookingId,
    counselorId,
    fullName,
    email,
    date,
    time,
    totalAmount: counselor.pricePerHour
  };

  await Booking.create(booking);
  await sendConfirmationEmail(email, fullName, booking, counselor);

  return booking;
}

async function sendConfirmationEmail(email, fullName, bookingData, counselor) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Counseling Session Confirmation',
    html: `
      <h1>Counseling Session Confirmation</h1>
      <p>Dear ${fullName},</p>
      <p>Your counseling session has been booked. Here are the details:</p>
      <ul>
        <li>Booking ID: ${bookingData.bookingId}</li>
        <li>Counselor: ${counselor.name}</li>
        <li>Date: ${bookingData.date}</li>
        <li>Time: ${bookingData.time}</li>
        <li>Total Price: $${counselor.pricePerHour}</li>
      </ul>
      <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
      <p>We look forward to supporting you in your mental wellness journey!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

module.exports = {
  getCounselors,
  bookCounselor
};