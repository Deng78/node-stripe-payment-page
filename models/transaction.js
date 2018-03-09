const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    customerID: {
        type: String,
        unique: true,
        required: true,
      },
      product: {
        type: String,
        required: true,
        trim: true
      },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    },

});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;