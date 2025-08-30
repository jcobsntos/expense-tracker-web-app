const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    budgetAmount: {
        type: Number,
        required: true,
        min: 0
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    spentAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create compound index for unique budget per user, category, month, year
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

// Virtual for remaining budget
budgetSchema.virtual('remainingAmount').get(function() {
    return Math.max(0, this.budgetAmount - this.spentAmount);
});

// Virtual for budget utilization percentage
budgetSchema.virtual('utilizationPercentage').get(function() {
    return this.budgetAmount > 0 ? Math.min(100, (this.spentAmount / this.budgetAmount) * 100) : 0;
});

// Virtual for budget status
budgetSchema.virtual('status').get(function() {
    const percentage = this.utilizationPercentage;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'moderate';
    return 'good';
});

// Ensure virtual fields are serialized
budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Budget', budgetSchema);
