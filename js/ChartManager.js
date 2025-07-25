import { Utils } from "./Utils.js";

export class ChartManager {
  constructor() {
    this.categoryChart = null;
  }

  /**
   * Initialize the category chart
   */
  initializeChart() {
    const ctx = document.getElementById("categoryChart").getContext("2d");

    this.categoryChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
      },
    });
  }

  /**
   * Update chart with new expense data
   * @param {Array} expenses - Array of expense objects
   */
  updateChart(expenses) {
    if (!this.categoryChart || !expenses) return;

    const categoryTotals = this.calculateCategoryTotals(expenses);
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    this.categoryChart.data.labels = labels;
    this.categoryChart.data.datasets[0].data = data;
    this.categoryChart.update();
  }

  /**
   * Calculate totals for each category
   * @param {Array} expenses - Array of expense objects
   * @returns {Object} Category totals object
   */
  calculateCategoryTotals(expenses) {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const categoryName = Utils.getCategoryName(expense.category);
      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + expense.amount;
    });

    return categoryTotals;
  }

  /**
   * Destroy the chart instance
   */
  destroyChart() {
    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.categoryChart = null;
    }
  }

  /**
   * Check if chart is initialized
   * @returns {boolean} True if chart exists
   */
  isInitialized() {
    return this.categoryChart !== null;
  }

  /**
   * Resize chart (useful for responsive behavior)
   */
  resizeChart() {
    if (this.categoryChart) {
      this.categoryChart.resize();
    }
  }
}
