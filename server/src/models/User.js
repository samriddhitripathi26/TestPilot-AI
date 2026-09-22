const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Developer'
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  preferences: {
    defaultLanguage: { type: String, default: 'javascript' },
    defaultFramework: { type: String, default: 'jest' },
    preferredModel: { type: String, default: 'gemini-1.5-flash' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
