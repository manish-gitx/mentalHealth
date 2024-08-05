const mongoose = require('mongoose');
require("dotenv").config();


mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  fullName: String,
  email: { type: String, sparse: true },
  lastInteraction: Date
});



// Remove any existing index on the email field
UserSchema.index({ email: 1 }, { unique: true, sparse: true, background: true });

const ConversationSchema = new mongoose.Schema({
  userId: String,
  messages: String
});

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  counselorId: Number,
  fullName: String,
  email: String,
  date: String,
  time: String,
  totalAmount: Number
});

const User = mongoose.model('ChatUser', UserSchema);
const Conversation = mongoose.model('Conversation', ConversationSchema);
const Booking = mongoose.model('Booking', BookingSchema);

// Function to ensure the correct index setup
async function setupIndexes() {
  try {
    await User.collection.dropIndex('email_1');
  } catch (error) {
    // Index doesn't exist, which is fine
  }
  await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true, background: true });
}

setupIndexes().catch(console.error);

module.exports = { User, Conversation, Booking };