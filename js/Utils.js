export class Utils {
  /**
   * Get category icon emoji
   * @param {string} category - Category name
   * @returns {string} Emoji icon
   */
  static getCategoryIcon(category) {
    const icons = {
      food: "🍕",
      transport: "🚗",
      entertainment: "🎬",
      shopping: "🛍️",
      bills: "💡",
      others: "📋",
    };
    return icons[category] || "📋";
  }

  /**
   * Get formatted category name
   * @param {string} category - Category key
   * @returns {string} Formatted category name
   */
  static getCategoryName(category) {
    const names = {
      food: "Food",
      transport: "Transport",
      entertainment: "Entertainment",
      shopping: "Shopping",
      bills: "Bills",
      others: "Others",
    };
    return names[category] || "Others";
  }

  /**
   * Format date string to readable format
   * @param {string} dateString - Date string in YYYY-MM-DD format
   * @returns {string} Formatted date string
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency symbol (default: ₹)
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount, currency = "₹") {
    return `${currency}${amount.toLocaleString()}`;
  }

  /**
   * Calculate unique days from expenses array
   * @param {Array} expenses - Array of expense objects
   * @returns {number} Number of unique days
   */
  static getUniqueDays(expenses) {
    const uniqueDates = new Set(expenses.map((exp) => exp.date));
    return Math.max(uniqueDates.size, 1);
  }

  /**
   * Get top spending category
   * @param {Array} expenses - Array of expense objects
   * @returns {string} Top category name
   */
  static getTopCategory(expenses) {
    if (expenses.length === 0) return "-";

    const categoryTotals = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    return this.getCategoryName(topCategory);
  }

  /**
   * Calculate payment method ratio
   * @param {Array} expenses - Array of expense objects
   * @returns {string} Payment ratio string (Cash% : Card%)
   */
  static getPaymentRatio(expenses) {
    if (expenses.length === 0) return "-";

    const cashCount = expenses.filter(
      (exp) => exp.paymentMethod === "cash"
    ).length;
    const cardCount = expenses.length - cashCount;

    if (cashCount === 0) return "0% : 100%";
    if (cardCount === 0) return "100% : 0%";

    const cashPercent = Math.round((cashCount / expenses.length) * 100);
    const cardPercent = 100 - cashPercent;

    return `${cashPercent}% : ${cardPercent}%`;
  }

  /**
   * Calculate total expenses amount
   * @param {Array} expenses - Array of expense objects
   * @returns {number} Total amount
   */
  static getTotalExpenses(expenses) {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  /**
   * Calculate average daily spending
   * @param {Array} expenses - Array of expense objects
   * @returns {number} Average daily amount
   */
  static getAverageDaily(expenses) {
    if (expenses.length === 0) return 0;
    const total = this.getTotalExpenses(expenses);
    const uniqueDays = this.getUniqueDays(expenses);
    return total / uniqueDays;
  }

  /**
   * Get expenses for current month
   * @param {Array} expenses - Array of expense objects
   * @returns {Array} Current month expenses
   */
  static getCurrentMonthExpenses(expenses) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
  }

  /**
   * Get expenses for a specific date range
   * @param {Array} expenses - Array of expense objects
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Array} Filtered expenses
   */
  static getExpensesByDateRange(expenses, startDate, endDate) {
    return expenses.filter((expense) => {
      return expense.date >= startDate && expense.date <= endDate;
    });
  }

  /**
   * Group expenses by category
   * @param {Array} expenses - Array of expense objects
   * @returns {Object} Expenses grouped by category
   */
  static groupExpensesByCategory(expenses) {
    const grouped = {};
    expenses.forEach((expense) => {
      if (!grouped[expense.category]) {
        grouped[expense.category] = [];
      }
      grouped[expense.category].push(expense);
    });
    return grouped;
  }

  /**
   * Calculate category totals
   * @param {Array} expenses - Array of expense objects
   * @returns {Object} Category totals object
   */
  static getCategoryTotals(expenses) {
    const totals = {};
    expenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  }

  /**
   * Get today's date in YYYY-MM-DD format
   * @returns {string} Today's date
   */
  static getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }

  /**
   * Validate date is not in future
   * @param {string} dateString - Date string to validate
   * @returns {boolean} True if valid (not in future)
   */
  static isValidDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selectedDate <= today;
  }

  /**
   * Generate unique ID based on timestamp
   * @returns {number} Unique ID
   */
  static generateId() {
    return Date.now();
  }

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if object is empty
   * @param {Object} obj - Object to check
   * @returns {boolean} True if empty
   */
  static isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  /**
   * Capitalize first letter of string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Format number with thousand separators
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  static formatNumber(num) {
    return num.toLocaleString();
  }

  /**
   * Calculate percentage
   * @param {number} part - Part value
   * @param {number} total - Total value
   * @returns {number} Percentage (0-100)
   */
  static calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100 * 10) / 10;
  }
}
