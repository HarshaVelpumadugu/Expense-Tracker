export class BudgetManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.budgets = this.storageManager.loadBudgets();
  }

  /**
   * Save a budget for a category
   * @param {string} category - The category name
   * @param {number} amount - The budget amount
   * @returns {boolean} True if saved successfully
   */
  saveBudget(category, amount) {
    if (!category || !amount || amount <= 0) {
      return false;
    }

    this.budgets[category] = amount;
    this.storageManager.saveBudgets(this.budgets);
    return true;
  }

  /**
   * Delete a budget for a category
   * @param {string} category - The category name
   * @returns {boolean} True if deleted successfully
   */
  deleteBudget(category) {
    if (this.budgets[category]) {
      delete this.budgets[category];
      this.storageManager.saveBudgets(this.budgets);
      return true;
    }
    return false;
  }

  /**
   * Get budget for a specific category
   * @param {string} category - The category name
   * @returns {number|null} The budget amount or null if not found
   */
  getBudget(category) {
    return this.budgets[category] || null;
  }

  /**
   * Get all budgets
   * @returns {Object} All budgets object
   */
  getAllBudgets() {
    return this.budgets;
  }

  /**
   * Check if any budgets are set
   * @returns {boolean} True if budgets exist
   */
  hasBudgets() {
    return Object.keys(this.budgets).length > 0;
  }

  /**
   * Calculate budget status for a category
   * @param {string} category - The category name
   * @param {number} spent - Amount spent in the category
   * @returns {Object} Budget status information
   */
  getBudgetStatus(category, spent) {
    const budgetAmount = this.budgets[category];

    if (!budgetAmount) {
      return null;
    }

    const percentage = (spent / budgetAmount) * 100;
    const remaining = budgetAmount - spent;
    const isOverBudget = spent > budgetAmount;

    let status = "good";
    if (percentage >= 90) {
      status = "danger";
    } else if (percentage >= 70) {
      status = "warning";
    }

    return {
      budgetAmount,
      spent,
      percentage: Math.round(percentage * 10) / 10,
      remaining: Math.abs(remaining),
      isOverBudget,
      status,
    };
  }

  /**
   * Get budget progress class for styling
   * @param {number} percentage - The percentage spent
   * @returns {string} CSS class name
   */
  getProgressClass(percentage) {
    if (percentage < 70) {
      return "progress-success";
    } else if (percentage >= 70 && percentage <= 90) {
      return "progress-warning";
    } else {
      return "progress-danger";
    }
  }

  /**
   * Validate budget data
   * @param {string} category - The category name
   * @param {number} amount - The budget amount
   * @returns {Object} Validation result
   */
  validateBudget(category, amount) {
    const errors = {};

    if (!category) {
      errors.category = "Please select a category";
    }

    if (!amount || amount <= 0) {
      errors.amount = "Please enter a valid amount";
    } else if (amount > 9999999) {
      errors.amount = "Budget amount cannot exceed ₹99,99,999";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
