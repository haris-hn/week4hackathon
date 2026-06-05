const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  profilePic: {
    type: String,
    default: ''
  },
  subscription: {
    plan: {
      type: String,
      enum: ['none', 'basic', 'standard', 'premium'],
      default: 'none'
    },
    isActive: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    isFreeTrial: { type: Boolean, default: false },
    freeTrialUsed: { type: Boolean, default: false }
  },
  cardDetails: {
    last4Digits: String,
    cardHolder: String,
    expiryDate: String
  }
}, { timestamps: true });

// ✅ FIXED - next() hatao, async/await directly use karo
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);