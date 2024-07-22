const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoanSchema = new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    term: {
        type: Number,
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'biweekly'],
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paid', 'defaulted', 'overdue'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);
