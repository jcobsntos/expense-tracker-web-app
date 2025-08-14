const xlsx = require("xlsx");
const Income = require("../models/Income");

// add income user
exports.addIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, source, amount, date } = req.body;

        //validate required fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newIncome = new Income({
            userId,
            icon,   
            source,
            amount,
            date: new Date(date) // ensure date is a Date object
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// get all income for user
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// delete income by id
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// download income data as Excel file
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        // Convert income data to Excel format
        const data = incomes.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
            
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download('income_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};