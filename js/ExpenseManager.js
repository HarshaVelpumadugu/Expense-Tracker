import { Utils } from "./Utils.js";

export class ExpenseManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.expenses = this.storageManager.loadExpenses();
  }

  /**
   * Add a new expense
   * @param {Object} expenseData - Form data for the expense
   * @returns {Object} The created expense object
   */
  addExpense(expenseData) {
    const expense = {
      id: Date.now(),
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      date: expenseData.date,
      description: expenseData.description.trim(),
      paymentMethod: expenseData.paymentMethod,
      timestamp: new Date().toISOString(),
    };

    this.expenses.push(expense);
    this.storageManager.saveExpenses(this.expenses);
    return expense;
  }

  /**
   * Delete an expense by ID
   * @param {number} id - The expense ID to delete
   * @returns {boolean} True if deleted successfully
   */
  deleteExpense(id) {
    const initialLength = this.expenses.length;
    this.expenses = this.expenses.filter((expense) => expense.id !== id);

    if (this.expenses.length < initialLength) {
      this.storageManager.saveExpenses(this.expenses);
      return true;
    }
    return false;
  }

  /**
   * Get expense by ID
   * @param {number} id - The expense ID
   * @returns {Object|null} The expense object or null if not found
   */
  getExpenseById(id) {
    return this.expenses.find((exp) => exp.id === id) || null;
  }

  /**
   * Remove expense by ID (for editing)
   * @param {number} id - The expense ID to remove
   */
  removeExpenseById(id) {
    this.expenses = this.expenses.filter((exp) => exp.id !== id);
    this.storageManager.saveExpenses(this.expenses);
  }

  /**
   * Validate expense form data
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result with errors object
   */
  validateExpense(formData) {
    const errors = {};

    // Amount validation
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Please enter a valid amount";
    } else if (formData.amount > 999999) {
      errors.amount = "Amount cannot exceed ₹999,999";
    }

    // Category validation
    if (!formData.category) {
      errors.category = "Please select a category";
    }

    // Date validation
    if (!formData.date) {
      errors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        errors.date = "Date cannot be in the future";
      }
    }

    // Description validation
    if (!formData.description) {
      errors.description = "Please enter a description";
    } else if (formData.description.length < 3) {
      errors.description = "Description must be at least 3 characters";
    }

    // Payment method validation
    if (!formData.paymentMethod) {
      errors.paymentMethod = "Please select a payment method";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Get filtered expenses based on criteria
   * @param {Object} filters - Filter criteria
   * @param {Object} sorting - Sorting configuration
   * @returns {Array} Filtered and sorted expenses
   */
  getFilteredExpenses(filters = {}, sorting = {}) {
    let filtered = [...this.expenses];

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchTerm) ||
          expense.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (expense) => expense.category === filters.category
      );
    }

    // Payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(
        (expense) => expense.paymentMethod === filters.paymentMethod
      );
    }

    // Date range filter
    if (filters.fromDate) {
      filtered = filtered.filter((expense) => expense.date >= filters.fromDate);
    }

    if (filters.toDate) {
      filtered = filtered.filter((expense) => expense.date <= filters.toDate);
    }

    // Sort
    if (sorting.field) {
      filtered.sort((a, b) => {
        let aValue = a[sorting.field];
        let bValue = b[sorting.field];

        if (sorting.field === "amount") {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        } else if (sorting.field === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = aValue.toString().toLowerCase();
          bValue = bValue.toString().toLowerCase();
        }

        if (aValue < bValue) return sorting.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  /**
   * Get all expenses
   * @returns {Array} All expenses
   */
  getAllExpenses() {
    return this.expenses;
  }

  /**
   * Get expenses for current month
   * @returns {Array} Current month expenses
   */
  getCurrentMonthExpenses() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
  }
}
