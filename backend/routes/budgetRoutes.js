const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getAllBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetSummary
} = require('../controllers/budgetController');

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/v1/budget - Get all budgets with optional month/year filter
router.get('/', getAllBudgets);

// GET /api/v1/budget/summary - Get budget summary for dashboard
router.get('/summary', getBudgetSummary);

// POST /api/v1/budget - Create a new budget
router.post('/', createBudget);

// PUT /api/v1/budget/:budgetId - Update a budget
router.put('/:budgetId', updateBudget);

// DELETE /api/v1/budget/:budgetId - Delete a budget
router.delete('/:budgetId', deleteBudget);

module.exports = router;
