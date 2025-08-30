import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import Input from '../../components/Inputs/Input';
import Modal from '../../components/Modal';

const Budget = () => {
  const { user } = useContext(UserContext);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    budgetAmount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const expenseCategories = [
    'Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 
    'Healthcare', 'Education', 'Travel', 'Utilities', 'Other'
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/v1/budget', {
        params: { month: currentMonth, year: currentYear }
      });
      setBudgets(response.data);
    } catch (err) {
      setError('Failed to fetch budgets');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await axiosInstance.put(`/api/v1/budget/${editingBudget._id}`, {
          budgetAmount: parseFloat(formData.budgetAmount)
        });
      } else {
        await axiosInstance.post('/api/v1/budget', {
          ...formData,
          budgetAmount: parseFloat(formData.budgetAmount)
        });
      }
      
      fetchBudgets();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axiosInstance.delete(`/api/v1/budget/${budgetId}`);
        fetchBudgets();
      } catch (err) {
        setError('Failed to delete budget');
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      budgetAmount: budget.budgetAmount.toString(),
      month: budget.month,
      year: budget.year
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      budgetAmount: '',
      month: currentMonth,
      year: currentYear
    });
    setEditingBudget(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'exceeded': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'exceeded': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout activeMenu="Budget">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
            <p className="text-gray-600">
              Track and manage your monthly budgets by category
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openModal}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
          >
            <FaPlus />
            Add Budget
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : budgets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FaChartLine className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Budgets Set
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first budget to start tracking your spending
            </p>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all"
            >
              Create Budget
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <motion.div
                key={budget._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {budget.category}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {months.find(m => m.value === budget.month)?.label} {budget.year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Spent</span>
                    <span className="text-gray-600">
                      ₱{budget.spentAmount.toLocaleString()} / ₱{budget.budgetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getProgressColor(budget.status)} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">
                      {budget.utilizationPercentage.toFixed(1)}% used
                    </span>
                    <span className="text-gray-500">
                      ₱{budget.remainingAmount.toLocaleString()} left
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                    {budget.status === 'exceeded' && <FaExclamationTriangle className="inline mr-1" />}
                    {budget.status === 'good' && <FaCheckCircle className="inline mr-1" />}
                    {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Budget Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingBudget && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Input
                label="Budget Amount"
                type="number"
                value={formData.budgetAmount}
                onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                placeholder="Enter budget amount"
                required
              />

              {!editingBudget && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    placeholder="Year"
                    required
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all"
                >
                  {editingBudget ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
