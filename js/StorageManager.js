export class StorageManager {
  constructor() {
    this.expensesKey = "expenses";
    this.budgetsKey = "budgets";
  }

  /**
   * Load expenses from localStorage
   * @returns {Array} Array of expense objects
   */
  loadExpenses() {
    try {
      const expenses = localStorage.getItem(this.expensesKey);
      return expenses ? JSON.parse(expenses) : [];
    } catch (error) {
      console.error("Error loading expenses:", error);
      return [];
    }
  }

  /**
   * Save expenses to localStorage
   * @param {Array} expenses - Array of expense objects
   */
  saveExpenses(expenses) {
    try {
      localStorage.setItem(this.expensesKey, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  }

  /**
   * Load budgets from localStorage
   * @returns {Object} Budget object with category keys
   */
  loadBudgets() {
    try {
      const budgets = localStorage.getItem(this.budgetsKey);
      return budgets ? JSON.parse(budgets) : {};
    } catch (error) {
      console.error("Error loading budgets:", error);
      return {};
    }
  }

  /**
   * Save budgets to localStorage
   * @param {Object} budgets - Budget object with category keys
   */
  saveBudgets(budgets) {
    try {
      localStorage.setItem(this.budgetsKey, JSON.stringify(budgets));
    } catch (error) {
      console.error("Error saving budgets:", error);
    }
  }

  /**
   * Clear all stored data
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.expensesKey);
      localStorage.removeItem(this.budgetsKey);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }
}
