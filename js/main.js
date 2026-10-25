/**
 * Skyline CRM - Main Application Script
 * Enhanced with Toast Notifications, Live Dashboard KPI updates & Session Management
 */

// Toggle mobile sidebar
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.classList.toggle("show");
  }
}

// Close sidebar on click outside on mobile
document.addEventListener("click", function (e) {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".btn-sidebar-toggle");
  if (
    sidebar &&
    sidebar.classList.contains("show") &&
    !sidebar.contains(e.target) &&
    toggleBtn &&
    !toggleBtn.contains(e.target)
  ) {
    sidebar.classList.remove("show");
  }
});

// Format today's date dynamically
function getFormattedCurrentDate() {
  const now = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' };
  const formatted = now.toLocaleDateString('en-GB', options);
  return formatted.replace(',', ' ·');
}

// Modern Toast Notification System
function showToast(message, type = "success") {
  let toastContainer = document.getElementById("crmToastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "crmToastContainer";
    toastContainer.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  const isSuccess = type === "success";
  const icon = isSuccess ? "bi-check-circle-fill text-success" : (type === "danger" ? "bi-trash-fill text-danger" : "bi-info-circle-fill text-primary");
  const borderCol = isSuccess ? "#10b981" : (type === "danger" ? "#ef4444" : "#2563eb");

  toast.style.cssText = `
    background: #ffffff;
    color: #0f172a;
    border-radius: 14px;
    padding: 12px 18px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
    border-left: 4px solid ${borderCol};
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.88rem;
    font-weight: 600;
    min-width: 280px;
    max-width: 380px;
    animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  toast.innerHTML = `
    <i class="bi ${icon} fs-5"></i>
    <div class="flex-grow-1">${message}</div>
    <button type="button" class="btn-close ms-2" style="font-size:0.7rem;"></button>
  `;

  toast.querySelector(".btn-close").onclick = () => toast.remove();
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Add animation keyframe to document
if (!document.getElementById("toastKeyframes")) {
  const style = document.createElement("style");
  style.id = "toastKeyframes";
  style.textContent = `
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// Update live dates & bind dashboard numbers
document.addEventListener("DOMContentLoaded", function () {
  // Live dates
  const dateElements = document.querySelectorAll(".live-date");
  const formattedDate = getFormattedCurrentDate();
  dateElements.forEach(el => {
    el.innerHTML = `<i class="bi bi-calendar3 me-1"></i> ${formattedDate}`;
  });

  // Table real-time search binding
  const searchInputs = document.querySelectorAll(".table-search-input, .topbar-search input");
  searchInputs.forEach(input => {
    input.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      const tables = document.querySelectorAll("table tbody");
      tables.forEach(tbody => {
        const rows = tbody.querySelectorAll("tr");
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? "" : "none";
        });
      });
    });
  });

  // Set default current date on all date pickers
  const todayDateStr = new Date().toISOString().split("T")[0];
  const datePickers = document.querySelectorAll("input[type='date']");
  datePickers.forEach(picker => {
    if (!picker.value) {
      picker.value = todayDateStr;
    }
  });

  // Sync session in topbar
  if (window.CRMStore) {
    const session = CRMStore.getSession();
    const userNames = document.querySelectorAll(".topbar-user .fw-bold, .sidebar .profile .name");
    userNames.forEach(el => el.textContent = session.name);
    
    const userRoles = document.querySelectorAll(".topbar-user small, .sidebar .profile .role");
    userRoles.forEach(el => {
      if (el.classList.contains("role")) {
        el.innerHTML = `<span class="dot"></span>${session.role}`;
      } else {
        el.textContent = session.role;
      }
    });

    // Update Dashboard KPI cards dynamically if on dashboard
    updateDashboardKPIs();
  }
});

// Update KPI cards on dashboards and reports
function updateDashboardKPIs() {
  if (!window.CRMStore) return;
  const summary = CRMStore.getFinancialSummary();

  // Enquiries
  const enqEl = document.querySelector(".card-blue .value");
  if (enqEl) enqEl.textContent = summary.totalEnquiries;

  // Followups
  const folEl = document.querySelector(".card-green .value");
  if (folEl) folEl.textContent = summary.totalFollowups;

  // Leads
  const leadEl = document.querySelector(".card-purple .value");
  if (leadEl) leadEl.textContent = summary.totalLeads;

  // Day Book
  const dayEl = document.querySelector(".card-orange .value");
  if (dayEl) dayEl.textContent = `₹${summary.netBalance.toLocaleString('en-IN')}`;

  // Petty Cash
  const pcEl = document.querySelector(".card-teal .value");
  if (pcEl) pcEl.textContent = `₹${summary.pettyCashTotal.toLocaleString('en-IN')}`;

  // Sidebar badges
  const enqBadge = document.querySelector(".sidebar a[href*='enquiry'] .nav-badge");
  if (enqBadge) enqBadge.textContent = summary.totalEnquiries;

  const leadBadge = document.querySelector(".sidebar a[href*='lead'] .nav-badge");
  if (leadBadge) leadBadge.textContent = summary.totalLeads;

  const folBadge = document.querySelector(".sidebar a[href*='followup'] .nav-badge");
  if (folBadge) folBadge.textContent = summary.totalFollowups;
}

// Re-render when data updates
window.addEventListener("crm_data_updated", updateDashboardKPIs);

// Modern Logout Modal Trigger
function showLogoutModal() {
  let modalEl = document.getElementById("logoutModal");
  if (!modalEl) {
    const modalHtml = `
      <div class="modal fade modal-logout" id="logoutModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 420px;">
          <div class="modal-content text-center p-4">
            <div class="modal-logout-icon">
              <i class="bi bi-box-arrow-right"></i>
            </div>
            <h4 class="fw-bold text-dark mb-1">Logout</h4>
            <div class="text-muted small mb-4">
              Are you sure you want to logout?<br>You will be logged out of Skyline CRM.
            </div>
            <div class="d-flex justify-content-center gap-3">
              <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i> Cancel
              </button>
              <button type="button" class="btn btn-primary px-4" onclick="CRMStore ? CRMStore.logout() : window.location.href='login.html'">
                <i class="bi bi-check2 me-1"></i> Yes, Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    modalEl = document.getElementById("logoutModal");
  }
  
  if (window.bootstrap && window.bootstrap.Modal) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  } else {
    if (confirm("Are you sure you want to logout of Skyline CRM?")) {
      if (window.CRMStore) CRMStore.logout();
      else window.location.href = "login.html";
    }
  }
}

// Hook logout links
document.addEventListener("DOMContentLoaded", function() {
  const logoutLinks = document.querySelectorAll(".logout-link, a[href='login.html']");
  logoutLinks.forEach(link => {
    if (!window.location.pathname.endsWith("login.html")) {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        showLogoutModal();
      });
    }
  });
});
