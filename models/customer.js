const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
      },
      lastName: {
        type: String,
        required: true,
        trim: true
      },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: new Date
    }


});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;