const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    term: {
        type: Number,
        required: true,
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'overdue', 'paid'],
        default: 'active',
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
