const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// Get all budgets for the authenticated user
exports.getAllBudgets = async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const currentMonth = month || currentDate.getMonth() + 1;
        const currentYear = year || currentDate.getFullYear();

        const budgets = await Budget.find({
            userId: req.user._id,
            month: currentMonth,
            year: currentYear,
            isActive: true
        }).sort({ category: 1 });

        // Update spent amounts based on actual expenses
        for (let budget of budgets) {
            const expenses = await Expense.aggregate([
                {
                    $match: {
                        userId: req.user._id,
                        category: budget.category,
                        $expr: {
                            $and: [
                                { $eq: [{ $month: "$date" }, parseInt(currentMonth)] },
                                { $eq: [{ $year: "$date" }, parseInt(currentYear)] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const spentAmount = expenses.length > 0 ? expenses[0].total : 0;
            budget.spentAmount = spentAmount;
            await budget.save();
        }

        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budgets', error: error.message });
    }
};

// Create a new budget
exports.createBudget = async (req, res) => {
    try {
        const { category, budgetAmount, month, year } = req.body;

        if (!category || !budgetAmount || !month || !year) {
            return res.status(400).json({ message: 'Category, budget amount, month, and year are required' });
        }

        // Check if budget already exists for this category, month, and year
        const existingBudget = await Budget.findOne({
            userId: req.user._id,
            category,
            month,
            year,
            isActive: true
        });

        if (existingBudget) {
            return res.status(400).json({ 
                message: `Budget for ${category} in ${month}/${year} already exists` 
            });
        }

        // Calculate spent amount for this category and period
        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    category: category,
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$date" }, parseInt(month)] },
                            { $eq: [{ $year: "$date" }, parseInt(year)] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const spentAmount = expenses.length > 0 ? expenses[0].total : 0;

        const budget = new Budget({
            userId: req.user._id,
            category,
            budgetAmount,
            month,
            year,
            spentAmount
        });

        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Budget for this category and period already exists' });
        }
        res.status(500).json({ message: 'Error creating budget', error: error.message });
    }
};

// Update an existing budget
exports.updateBudget = async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { budgetAmount } = req.body;

        if (!budgetAmount) {
            return res.status(400).json({ message: 'Budget amount is required' });
        }

        const budget = await Budget.findOne({
            _id: budgetId,
            userId: req.user._id,
            isActive: true
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        budget.budgetAmount = budgetAmount;
        await budget.save();

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Error updating budget', error: error.message });
    }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
    try {
        const { budgetId } = req.params;

        const budget = await Budget.findOne({
            _id: budgetId,
            userId: req.user._id,
            isActive: true
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        budget.isActive = false;
        await budget.save();

        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting budget', error: error.message });
    }
};

// Get budget summary for dashboard
exports.getBudgetSummary = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const budgets = await Budget.find({
            userId: req.user._id,
            month: currentMonth,
            year: currentYear,
            isActive: true
        });

        // Update spent amounts
        for (let budget of budgets) {
            const expenses = await Expense.aggregate([
                {
                    $match: {
                        userId: req.user._id,
                        category: budget.category,
                        $expr: {
                            $and: [
                                { $eq: [{ $month: "$date" }, currentMonth] },
                                { $eq: [{ $year: "$date" }, currentYear] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const spentAmount = expenses.length > 0 ? expenses[0].total : 0;
            budget.spentAmount = spentAmount;
            await budget.save();
        }

        const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgetAmount, 0);
        const totalSpent = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
        const totalRemaining = totalBudget - totalSpent;

        const budgetsByStatus = {
            good: budgets.filter(b => b.status === 'good').length,
            moderate: budgets.filter(b => b.status === 'moderate').length,
            warning: budgets.filter(b => b.status === 'warning').length,
            exceeded: budgets.filter(b => b.status === 'exceeded').length
        };

        res.status(200).json({
            totalBudgets: budgets.length,
            totalBudget,
            totalSpent,
            totalRemaining,
            utilizationPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
            budgetsByStatus,
            budgets: budgets.slice(0, 5) // Return top 5 budgets for quick view
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budget summary', error: error.message });
    }
};
