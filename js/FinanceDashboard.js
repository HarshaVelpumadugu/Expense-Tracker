import { ExpenseManager } from "./ExpenseManager.js";
import { BudgetManager } from "./BudgetManager.js";
import { ChartManager } from "./ChartManager.js";
import { UIManager } from "./UIManager.js";
import { BudgetUI } from "./BudgetUI.js";
import { Utils } from "./Utils.js";
import { StorageManager } from "./StorageManager.js";

export class FinanceDashboard {
  constructor() {
    // Initialize all managers
    this.storageManager = new StorageManager();
    this.expenseManager = new ExpenseManager(this.storageManager);
    this.budgetManager = new BudgetManager(this.storageManager);
    this.chartManager = new ChartManager();
    this.uiManager = new UIManager();
    this.budgetUI = new BudgetUI();

    // Initialize the dashboard
    this.init();
  }

  /**
   * Initialize the dashboard
   */
  init() {
    this.uiManager.setupEventListeners(this);
    this.uiManager.setDefaultDate();
    this.updateDashboard();
    this.renderExpenseTable();
    this.renderBudgetTracker();
    this.initializeChart();
  }

  /**
   * Add a new expense
   */
  addExpense() {
    const formData = this.getExpenseFormData();
    const validation = this.expenseManager.validateExpense(formData);

    if (!validation.isValid) {
      this.uiManager.displayFormErrors(validation.errors);
      return;
    }

    const expense = this.expenseManager.addExpense(formData);
    this.updateDashboard();
    this.renderExpenseTable();
    this.renderBudgetTracker();
    this.updateChart();
    this.uiManager.resetExpenseForm();
    this.uiManager.showToast("Expense added successfully!", "success");
  }

  /**
   * Delete an expense
   * @param {number} id - Expense ID to delete
   */
  deleteExpense(id) {
    if (confirm("Are you sure you want to delete this expense?")) {
      const deleted = this.expenseManager.deleteExpense(id);
      if (deleted) {
        this.updateDashboard();
        this.renderExpenseTable();
        this.renderBudgetTracker();
        this.updateChart();
        this.uiManager.showToast("Expense deleted successfully!", "success");
      }
    }
  }

  /**
   * Edit an expense
   * @param {number} id - Expense ID to edit
   */
  editExpense(id) {
    const expense = this.expenseManager.getExpenseById(id);
    if (expense) {
      this.populateExpenseForm(expense);
      this.expenseManager.removeExpenseById(id);
      this.updateDashboard();
      this.renderExpenseTable();
      this.renderBudgetTracker();
      this.updateChart();
      this.uiManager.showExpenseOverlay();
      document.getElementById("amount").focus();
      this.uiManager.showToast("Expense loaded for editing", "info");
    }
  }

  /**
   * Save budget
   */
  saveBudget() {
    const budgetData = this.budgetUI.getBudgetFormData();
    const validation = this.budgetManager.validateBudget(
      budgetData.category,
      budgetData.amount
    );

    if (!validation.isValid) {
      this.budgetUI.displayBudgetErrors(validation.errors);
      return;
    }

    const saved = this.budgetManager.saveBudget(
      budgetData.category,
      budgetData.amount
    );
    if (saved) {
      this.renderBudgetTracker();
      this.uiManager.closeBudgetModal();
      this.uiManager.showToast("Budget saved successfully!", "success");
    } else {
      this.uiManager.showToast("Please fill all fields correctly", "error");
    }
  }

  /**
   * Delete budget
   * @param {string} category - Category to delete budget for
   */
  deleteBudget(category) {
    if (confirm("Are you sure you want to delete this budget?")) {
      const deleted = this.budgetManager.deleteBudget(category);
      if (deleted) {
        this.renderBudgetTracker();
        this.uiManager.showToast("Budget deleted successfully!", "success");
      }
    }
  }

  /**
   * Open budget modal
   */
  openBudgetModal() {
    this.uiManager.openBudgetModal();
  }

  /**
   * Close budget modal
   */
  closeBudgetModal() {
    this.uiManager.closeBudgetModal();
  }

  /**
   * Update dashboard statistics
   */
  updateDashboard() {
    const expenses = this.expenseManager.getAllExpenses();
    const stats = {
      totalExpenses: Utils.getTotalExpenses(expenses),
      avgDaily: Utils.getAverageDaily(expenses),
      topCategory: Utils.getTopCategory(expenses),
      paymentRatio: Utils.getPaymentRatio(expenses),
      expenseCount: expenses.length,
    };

    this.uiManager.updateDashboardStats(stats);
  }

  /**
   * Render expense table
   */
  renderExpenseTable() {
    const filters = this.uiManager.getFilterValues();
    const sorting = this.uiManager.getSortConfig();
    const filteredExpenses = this.expenseManager.getFilteredExpenses(
      filters,
      sorting
    );

    const startIndex =
      (this.uiManager.getCurrentPage() - 1) * this.uiManager.getItemsPerPage();
    const endIndex = startIndex + this.uiManager.getItemsPerPage();
    const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

    this.uiManager.renderExpenseTable(
      paginatedExpenses,
      filteredExpenses.length
    );
  }

  /**
   * Render budget tracker
   */
  renderBudgetTracker() {
    const budgets = this.budgetManager.getAllBudgets();
    const currentMonthExpenses = this.expenseManager.getCurrentMonthExpenses();
    this.budgetUI.renderBudgetTracker(budgets, currentMonthExpenses);
  }

  /**
   * Initialize chart
   */
  initializeChart() {
    this.chartManager.initializeChart();
    this.updateChart();
  }

  /**
   * Update chart with current data
   */
  updateChart() {
    const expenses = this.expenseManager.getAllExpenses();
    this.chartManager.updateChart(expenses);
  }

  /**
   * Apply filters to expense table
   */
  applyFilters() {
    this.uiManager.resetPagination();
    this.renderExpenseTable();
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.uiManager.clearFilters();
    this.applyFilters();
  }

  /**
   * Sort table by field
   * @param {string} field - Field to sort by
   */
  sortTable(field) {
    this.uiManager.updateSort(field);
    this.renderExpenseTable();
    this.uiManager.updateSortIcons();
  }

  /**
   * Change page
   * @param {number} page - Page number to navigate to
   */
  changePage(page) {
    const filters = this.uiManager.getFilterValues();
    const sorting = this.uiManager.getSortConfig();
    const filteredExpenses = this.expenseManager.getFilteredExpenses(
      filters,
      sorting
    );
    const totalPages = Math.ceil(
      filteredExpenses.length / this.uiManager.getItemsPerPage()
    );

    if (page >= 1 && page <= totalPages) {
      this.uiManager.changePage(page);
      this.renderExpenseTable();
    }
  }

  /**
   * Get expense form data
   * @returns {Object} Form data object
   */
  getExpenseFormData() {
    return {
      amount: document.getElementById("amount").value,
      category: document.getElementById("category").value,
      date: document.getElementById("date").value,
      description: document.getElementById("description").value.trim(),
      paymentMethod: document.querySelector(
        'input[name="paymentMethod"]:checked'
      )?.value,
    };
  }

  /**
   * Populate expense form with data for editing
   * @param {Object} expense - Expense object to populate form with
   */
  populateExpenseForm(expense) {
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("date").value = expense.date;
    document.getElementById("description").value = expense.description;

    const paymentMethodRadio = document.querySelector(
      `input[name="paymentMethod"][value="${expense.paymentMethod}"]`
    );
    if (paymentMethodRadio) {
      paymentMethodRadio.checked = true;
    }
  }
}
