import { FinanceDashboard } from "/js/FinanceDashboard.js";

let dashboard;

document.addEventListener("DOMContentLoaded", function () {
  dashboard = new FinanceDashboard();
  window.dashboard = dashboard; // Expose globally
  window.openBudgetModal = function () {
    dashboard.openBudgetModal();
  };

  window.closeBudgetModal = function () {
    dashboard.closeBudgetModal();
  };

  window.clearFilters = function () {
    dashboard.clearFilters();
  };

  window.sortTable = function (field) {
    dashboard.sortTable(field);
  };
});
