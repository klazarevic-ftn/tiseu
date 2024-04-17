const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['ADMIN', 'CIVIL', 'PROSECUTOR', ], 
    default: 'CIVIL' 
  },
  configured: {
    type: Boolean,
    default: false
  },
  /////???
  // password: {
  //   type: String,
  //   required: true,
  // },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  UPIN: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  address: {
    streetAddress: {
      type: String,
    },
    aptNumber: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    }
  },
  phone: {
    type: String,
  },
  specialization: {
    type: String,
  },
  licenseNumber: {
    type: Number,
  },
});

const User = mongoose.model('User', userSchema, 'users-auth0');

module.exports = User;
