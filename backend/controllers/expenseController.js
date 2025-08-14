const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// add expense user
exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, category, amount, date } = req.body;

        //validate required fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newExpense = new Expense ({
            userId,
            icon,   
            category,
            amount,
            date: new Date(date) // ensure date is a Date object
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// get all Expense for user
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// delete Expense by id
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// download Expense data as Excel file
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Convert Expense data to Excel format
        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date
            
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download('expense_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};