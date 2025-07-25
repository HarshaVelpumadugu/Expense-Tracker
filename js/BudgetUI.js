import { Utils } from "./Utils.js";

export class BudgetUI {
  constructor() {}

  /**
   * Render budget tracker
   * @param {Object} budgets - All budgets object
   * @param {Array} currentMonthExpenses - Current month expenses
   */
  renderBudgetTracker(budgets, currentMonthExpenses) {
    const container = document.getElementById("budgetContainer");

    if (Object.keys(budgets).length === 0) {
      this.renderEmptyBudgetState(container);
      return;
    }

    const categorySpending =
      this.calculateCategorySpending(currentMonthExpenses);
    const budgetHTML = this.createBudgetListHTML(budgets, categorySpending);

    container.innerHTML = `<div class="budget-list">${budgetHTML}</div>`;
  }

  /**
   * Render empty budget state
   * @param {Element} container - Container element
   */
  renderEmptyBudgetState(container) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon"><i class="fas fa-bullseye"></i></div>
        <h3>No Budgets Set</h3>
        <p>Set up your monthly budget to track your spending goals</p>
        <button class="btn btn-primary" onclick="dashboard.openBudgetModal()">
          <i class="fas fa-plus"></i> Setup Budget
        </button>
      </div>
    `;
  }

  /**
   * Calculate spending by category for current month
   * @param {Array} expenses - Current month expenses
   * @returns {Object} Category spending object
   */
  calculateCategorySpending(expenses) {
    const categorySpending = {};
    expenses.forEach((expense) => {
      categorySpending[expense.category] =
        (categorySpending[expense.category] || 0) + expense.amount;
    });
    return categorySpending;
  }

  /**
   * Create budget list HTML
   * @param {Object} budgets - All budgets object
   * @param {Object} categorySpending - Category spending object
   * @returns {string} HTML string for budget list
   */
  createBudgetListHTML(budgets, categorySpending) {
    return Object.keys(budgets)
      .map((category) => {
        return this.createBudgetItemHTML(
          category,
          budgets[category],
          categorySpending[category] || 0
        );
      })
      .join("");
  }

  /**
   * Create individual budget item HTML
   * @param {string} category - Category name
   * @param {number} budgetAmount - Budget amount
   * @param {number} spent - Amount spent
   * @returns {string} HTML string for budget item
   */
  createBudgetItemHTML(category, budgetAmount, spent) {
    const percentage = (spent / budgetAmount) * 100;
    const remaining = Math.abs(budgetAmount - spent);
    const isOverBudget = spent > budgetAmount;
    const progressClass = this.getProgressClass(percentage);

    return `
      <div class="budget-item ${isOverBudget ? "over-budget" : ""}">
        <div class="budget-item-header">
          <div class="budget-info">
            <span class="budget-category">
              ${Utils.getCategoryIcon(category)} ${Utils.getCategoryName(
      category
    )}
            </span>
            <span class="budget-amount">₹${spent.toLocaleString()} / ₹${budgetAmount.toLocaleString()}</span>
          </div>
          <button class="btn-icon btn-delete" onclick="dashboard.deleteBudget('${category}')" title="Delete Budget">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${progressClass}" style="width: ${Math.min(
      percentage,
      100
    )}%"></div>
        </div>
        <div class="budget-details">
          <span class="${isOverBudget ? "over-budget-text" : "remaining-text"}">
            ${
              isOverBudget ? "Over budget by" : "Remaining"
            }: ₹${remaining.toLocaleString()}
          </span>
          <span class="budget-percentage">${percentage.toFixed(1)}%</span>
        </div>
      </div>
    `;
  }

  /**
   * Get progress bar CSS class based on percentage
   * @param {number} percentage - Percentage spent
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
   * Get budget form data
   * @returns {Object} Budget form data
   */
  getBudgetFormData() {
    return {
      category: document.getElementById("budgetCategory").value,
      amount: parseFloat(document.getElementById("budgetAmount").value),
    };
  }

  /**
   * Reset budget form
   */
  resetBudgetForm() {
    document.getElementById("budgetForm").reset();
  }

  /**
   * Display budget form errors
   * @param {Object} errors - Error object
   */
  displayBudgetErrors(errors) {
    // Clear previous errors
    document
      .querySelectorAll(".budget-error")
      .forEach((el) => (el.textContent = ""));

    // Display new errors
    Object.keys(errors).forEach((field) => {
      const errorElement = document.getElementById(field + "BudgetError");
      if (errorElement) {
        errorElement.textContent = errors[field];
      }
    });
  }

  /**
   * Clear budget form errors
   */
  clearBudgetErrors() {
    document
      .querySelectorAll(".budget-error")
      .forEach((el) => (el.textContent = ""));
  }

  /**
   * Show budget overview statistics
   * @param {Object} budgets - All budgets
   * @param {Array} currentMonthExpenses - Current month expenses
   */
  showBudgetOverview(budgets, currentMonthExpenses) {
    const totalBudget = Object.values(budgets).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const totalSpent = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const overallPercentage =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // You can add UI elements to display this overview if needed
    return {
      totalBudget,
      totalSpent,
      overallPercentage: Math.round(overallPercentage * 10) / 10,
      remaining: totalBudget - totalSpent,
    };
  }
}
