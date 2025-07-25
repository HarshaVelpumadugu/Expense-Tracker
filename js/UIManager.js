import { Utils } from "./Utils.js";

export class UIManager {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.sortField = "date";
    this.sortDirection = "desc";
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners(dashboard) {
    this.setupFormEventListeners(dashboard);
    this.setupFilterEventListeners(dashboard);
    this.setupModalEventListeners();
    this.setupKeyboardShortcuts();
    this.setupTabEventListeners();
    this.setupOverlayEventListeners();
  }

  /**
   * Setup form event listeners
   */
  setupFormEventListeners(dashboard) {
    // Expense form submission
    document.getElementById("expenseForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.hideExpenseOverlay();
      dashboard.addExpense();
      // Form submission will be handled by the main dashboard
    });

    // Budget form submission
    document.getElementById("budgetForm").addEventListener("submit", (e) => {
      e.preventDefault();
      dashboard.saveBudget();
      // Form submission will be handled by the main dashboard
    });
  }

  /**
   * Setup filter event listeners
   */
  setupFilterEventListeners() {
    // Real-time search
    document.getElementById("searchInput").addEventListener("input", () => {
      dashboard.applyFilters();
      // Filter change will be handled by the main dashboard
    });

    // Filter changes
    const filterIds = ["categoryFilter", "paymentFilter", "fromDate", "toDate"];
    filterIds.forEach((id) => {
      document.getElementById(id).addEventListener("change", () => {
        dashboard.applyFilters();
        // Filter change will be handled by the main dashboard
      });
    });
  }

  /**
   * Setup modal event listeners
   */
  setupModalEventListeners() {
    window.addEventListener("click", (e) => {
      const modal = document.getElementById("budgetModal");
      if (e.target === modal) {
        this.closeBudgetModal();
      }
    });
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeBudgetModal();
        this.hideExpenseOverlay();
      }
    });
  }

  /**
   * Setup tab event listeners
   */
  setupTabEventListeners() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        this.switchTab(target, btn);
      });
    });
  }

  /**
   * Setup overlay event listeners
   */
  setupOverlayEventListeners() {
    const addExpenseBtn = document.querySelector(".add-expense-btn");
    const closeExpenseFormBtn = document.getElementById("closeExpenseFormBtn");

    if (addExpenseBtn) {
      addExpenseBtn.addEventListener("click", () => {
        this.showExpenseOverlay();
      });
    }

    if (closeExpenseFormBtn) {
      closeExpenseFormBtn.addEventListener("click", () => {
        this.hideExpenseOverlay();
      });
    }

    const budgetBtn = document.querySelector(".budget-btn");
    const expBtn = document.querySelector(".exp-btn");

    if (budgetBtn) {
      budgetBtn.addEventListener("click", () => {
        document.querySelector(".filters").classList.add("hidden");
      });
    }

    if (expBtn) {
      expBtn.addEventListener("click", () => {
        document.querySelector(".filters").classList.remove("hidden");
      });
    }
  }

  /**
   * Switch between tabs
   * @param {string} target - Target tab ID
   * @param {Element} btnElement - Button element that was clicked
   */
  switchTab(target, btnElement) {
    // Toggle active class on buttons
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btnElement.classList.add("active");

    // Toggle tab visibility
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.add("hidden");
    });
    document.getElementById(target).classList.remove("hidden");
  }

  /**
   * Show expense overlay
   */
  showExpenseOverlay() {
    const expenseOverlay = document.getElementById("expenseOverlay");
    const mainContent = document.querySelector(".container");

    expenseOverlay.classList.remove("hidden");
    mainContent.classList.add("blur");
  }

  /**
   * Hide expense overlay
   */
  hideExpenseOverlay() {
    const expenseOverlay = document.getElementById("expenseOverlay");
    const mainContent = document.querySelector(".container");

    expenseOverlay.classList.add("hidden");
    mainContent.classList.remove("blur");
  }

  /**
   * Set default date to today
   */
  setDefaultDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;
  }

  /**
   * Reset expense form
   */
  resetExpenseForm() {
    document.getElementById("expenseForm").reset();
    this.setDefaultDate();
    this.clearFormErrors();
  }

  /**
   * Clear form error messages
   */
  clearFormErrors() {
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
  }

  /**
   * Display form errors
   * @param {Object} errors - Error object with field names as keys
   */
  displayFormErrors(errors) {
    this.clearFormErrors();
    Object.keys(errors).forEach((field) => {
      const errorElement = document.getElementById(field + "Error");
      if (errorElement) {
        errorElement.textContent = errors[field];
      }
    });
  }

  /**
   * Open budget modal
   */
  openBudgetModal() {
    setTimeout(() => {
      document.getElementById("budgetModal").classList.add("show");
    }, 10);
  }

  /**
   * Close budget modal
   */
  closeBudgetModal() {
    const modal = document.getElementById("budgetModal");
    modal.classList.remove("show");
    // Reset form after animation completes
    setTimeout(() => {
      document.getElementById("budgetForm").reset();
    }, 300);
  }

  /**
   * Update dashboard statistics
   * @param {Object} stats - Statistics object
   */
  updateDashboardStats(stats) {
    document.getElementById(
      "totalExpenses"
    ).textContent = `₹${stats.totalExpenses.toLocaleString()}`;
    document.getElementById(
      "avgDaily"
    ).textContent = `₹${stats.avgDaily.toLocaleString()}`;
    document.getElementById("topCategory").textContent = stats.topCategory;
    document.getElementById("paymentRatio").textContent = stats.paymentRatio;
    document.getElementById("expenseCount").textContent = stats.expenseCount;
  }

  /**
   * Render expense table
   * @param {Array} expenses - Array of expense objects to display
   * @param {number} totalItems - Total number of filtered items
   */
  renderExpenseTable(expenses, totalItems) {
    const tbody = document.getElementById("expenseTableBody");

    if (expenses.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 2rem;">
            <div class="empty-state">
              <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
              <p>No expenses found</p>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = expenses
        .map((expense) => this.createExpenseRow(expense))
        .join("");
    }

    this.renderPagination(totalItems);
  }

  /**
   * Create HTML for expense table row
   * @param {Object} expense - Expense object
   * @returns {string} HTML string for the row
   */
  createExpenseRow(expense) {
    return `
      <tr>
        <td>${Utils.formatDate(expense.date)}</td>
        <td>${expense.description}</td>
        <td>
          <span class="category-badge category-${expense.category}">
            ${Utils.getCategoryIcon(expense.category)} ${Utils.getCategoryName(
      expense.category
    )}
          </span>
        </td>
        <td class="amount">₹${expense.amount.toLocaleString()}</td>
        <td>
          <span class="payment-badge payment-${expense.paymentMethod}">
            ${expense.paymentMethod === "cash" ? "💰" : "💳"} ${
      expense.paymentMethod.charAt(0).toUpperCase() +
      expense.paymentMethod.slice(1)
    }
          </span>
        </td>
        <td class="actions">
          <button class="btn-icon btn-edit" onclick="dashboard.editExpense(${
            expense.id
          })" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-delete" onclick="dashboard.deleteExpense(${
            expense.id
          })" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }

  /**
   * Render pagination controls
   * @param {number} totalItems - Total number of items
   */
  renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const paginationContainer = document.getElementById("pagination");

    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let paginationHTML = this.createPaginationHTML(totalPages);
    paginationContainer.innerHTML = paginationHTML;
  }

  /**
   * Create pagination HTML
   * @param {number} totalPages - Total number of pages
   * @returns {string} HTML string for pagination
   */
  createPaginationHTML(totalPages) {
    let html = "";

    // Previous button
    html += `
      <button class="btn-page ${this.currentPage === 1 ? "disabled" : ""}" 
              onclick="dashboard.changePage(${this.currentPage - 1})" 
              ${this.currentPage === 1 ? "disabled" : ""}>
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        html += `
          <button class="btn-page ${i === this.currentPage ? "active" : ""}" 
                  onclick="dashboard.changePage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += '<span class="pagination-dots">...</span>';
      }
    }

    // Next button
    html += `
      <button class="btn-page ${
        this.currentPage === totalPages ? "disabled" : ""
      }" 
              onclick="dashboard.changePage(${this.currentPage + 1})" 
              ${this.currentPage === totalPages ? "disabled" : ""}>
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    return html;
  }

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, info)
   */
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon =
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "exclamation-circle"
        : "info-circle";

    toast.innerHTML = `
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    `;

    const container = document.getElementById("toastContainer");
    container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("show"), 100);

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
  }

  /**
   * Update sort icons in table headers
   */
  updateSortIcons() {
    // Reset all sort icons
    document.querySelectorAll("th i.fas").forEach((icon) => {
      icon.className = "fas fa-sort";
    });

    // Update current sort field icon
    const currentHeader = document.querySelector(
      `th[onclick="sortTable('${this.sortField}')"] i`
    );
    if (currentHeader) {
      currentHeader.className = `fas fa-sort-${
        this.sortDirection === "asc" ? "up" : "down"
      }`;
    }
  }

  /**
   * Change current page
   * @param {number} page - Page number to navigate to
   */
  changePage(page) {
    this.currentPage = page;
  }

  /**
   * Reset current page to 1
   */
  resetPagination() {
    this.currentPage = 1;
  }

  /**
   * Get current page
   * @returns {number} Current page number
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * Get items per page
   * @returns {number} Items per page
   */
  getItemsPerPage() {
    return this.itemsPerPage;
  }

  /**
   * Get sort configuration
   * @returns {Object} Sort configuration
   */
  getSortConfig() {
    return {
      field: this.sortField,
      direction: this.sortDirection,
    };
  }

  /**
   * Update sort configuration
   * @param {string} field - Field to sort by
   */
  updateSort(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortField = field;
      this.sortDirection = "asc";
    }
  }

  /**
   * Get filter values from form inputs
   * @returns {Object} Filter values
   */
  getFilterValues() {
    return {
      searchTerm: document.getElementById("searchInput").value.toLowerCase(),
      category: document.getElementById("categoryFilter").value,
      paymentMethod: document.getElementById("paymentFilter").value,
      fromDate: document.getElementById("fromDate").value,
      toDate: document.getElementById("toDate").value,
    };
  }

  /**
   * Clear all filter inputs
   */
  clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("paymentFilter").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
  }
}
