# 🏢 Skyline CRM - Enterprise Real Estate & Property Management Suite

A state-of-the-art, responsive, full-featured Real Estate CRM and Financial Accounting web application built with **HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.3, Bootstrap Icons, and MySQL**.

Designed according to the **Anvistar ITS Java Full Stack Web Development Training Blueprint & UI/UX Wireframe Guidelines**.

---

## 🚀 Live Demo & Access

The project is currently hosted and running locally:
* **Root URL**: `http://localhost:5500/` (automatically redirects to `login.html`)
* **Login Portal**: `http://localhost:5500/login.html`
* **Admin Dashboard**: `http://localhost:5500/admin-dashboard.html`
* **Employee Dashboard**: `http://localhost:5500/employee-dashboard.html`

### 🔑 Demo Credentials:
| Role | User Type | Landing Page | Description |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `Admin` | `admin-dashboard.html` | Organization-wide KPIs, User CRUD & Master Display directories |
| **Employee** | `Employee` | `employee-dashboard.html` | Sales transactions, follow-ups, petty cash & day book operations |
| **Agent Partner** | `Agent User` | `employee-dashboard.html` | External property broker & lead registration |

---

## 📁 System Architecture & Page Directory

### 1. Authentication & System Root
* [`index.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/index.html) - Entry point with smart session-aware redirection.
* [`login.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/login.html) - Glassmorphic login card with role selector and password visibility toggle.

### 2. Dashboards
* [`admin-dashboard.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/admin-dashboard.html) - Navy blue executive theme, live dynamic KPI cards, and 10 quick action shortcuts.
* [`employee-dashboard.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/employee-dashboard.html) - Royal purple operational theme with daily activity shortcuts.

### 3. User Management Module (Admin)
* [`add-user.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/add-user.html) - Add new Admin, Employee, or Agent User accounts.
* [`display-user.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-user.html) - Filterable directory of all system users.
* [`update-user.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/update-user.html) - Interactive form that auto-populates upon selecting any user.
* [`remove-user.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/remove-user.html) - Safe deletion table with confirmation modal.

### 4. Sales & CRM Operations Module
* [`enquiry.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/enquiry.html) - Prospective buyer inquiry registration with auto-generated code (`ENQ-YYYYMMDD-XXX`) and auto-lead creation.
* [`followup.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/followup.html) - Client follow-up schedule manager with interactive "+ Schedule Follow Up" modal, multi-criteria filters, and one-click "Mark Completed" toggles.
* [`lead.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/lead.html) - Sales pipeline with interactive "+ Add Lead" modal, executive assignment, and one-click stage advancement (`New` → `Contacted` → `In Progress` → `Converted`).
* [`flat-sale.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/flat-sale.html) - Property booking and unit sales registration. **Booking tokens automatically post to the Day Book as Income!**

### 5. Accounts & Finance Module
* [`daybook.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/daybook.html) - Double-entry daily accounting journal with running balance recalculations, "+ Add Entry" modal, and color-coded Income/Expense pills.
* [`pettycash.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/pettycash.html) - Daily office expense voucher logger with auto-incrementing voucher numbers (`PC-YYYYMMDD-XXX`). **Auto-syncs into the Day Book as an Expense!**
* [`employee-payment.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/employee-payment.html) - Dedicated employee salary and payroll advance disbursement tracker.
* [`vendor-payment.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/vendor-payment.html) - Dedicated supplier and contractor settlement tracker.
* [`payments.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/payments.html) - Side-by-side dual payment entry hub.
* [`reports.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/reports.html) - Executive financial audit statement with cityscape hero banner, 6 real-time financial stat cards, and clean print stylesheet (`window.print()`).

### 6. Super Admin "Display Data of All" Master Files
*Mandated by Page 7 of the Project Blueprint:*
* [`display-enquiry.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-enquiry.html) - Master directory of all enquiries across all branches.
* [`display-followup.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-followup.html) - Master schedule of all client follow-ups.
* [`display-lead.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-lead.html) - Master pipeline of all leads.
* [`display-flatsale.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-flatsale.html) - Master sales contracts and booking records.
* [`display-daybook.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-daybook.html) - Master financial day book journal.
* [`display-pettycash.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-pettycash.html) - Master petty cash voucher log.
* [`display-payments.html`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/display-payments.html) - Master vendor & employee disbursement ledger.

---

## 🔄 Reactive Data Store & Synchronization (`js/crm-store.js`)

The application features a central reactive data store persisting data to the browser's `localStorage` (`skyline_crm_data` and `skyline_crm_session`):
1. **Auto-Seed Initialization**: If the browser's cache is empty, `CRMStore` pre-seeds rich demonstration data matching the UI wireframes.
2. **Cross-Module Accounting Synchronization**:
   * Recording a Flat Sale booking amount **automatically logs an Income entry** into the Day Book and recalculates the balance.
   * Creating a Petty Cash voucher **automatically logs an Expense entry** into the Day Book.
   * Issuing an Employee or Vendor Payment **automatically logs an Expense entry** into the Day Book.
   * Dashboard KPI cards and Reports automatically compute real-time totals using `CRMStore.getFinancialSummary()`.
3. **Session Management**: Automatically tracks whether the active user is an Admin, Employee, or Agent.

---

## 🗄️ MySQL Database Backend (`skyline_crm.sql`)

The accompanying SQL file [`skyline_crm.sql`](file:///c:/Users/91969/OneDrive/Pictures/Desktop/project%202/skyline_crm.sql) includes:
* `CREATE DATABASE skyline_crm;`
* Complete DDL schemas with primary keys, foreign constraints, auto-increments, timestamps, and indexes for:
  - `users`
  - `projects`
  - `enquiries`
  - `leads`
  - `followups`
  - `flat_sales`
  - `daybook`
  - `petty_cash`
  - `payments`
* Matching SQL `INSERT` statements with demo data.
* Helpful SQL Views: `view_financial_summary`, `view_active_leads`, `view_pending_followups`.

---

## 🎨 UI/UX Design System (`css/style.css`)

* **Typography**: Google Font `Plus Jakarta Sans` (weights 300 to 800).
* **Color Schemes**:
  - `theme-admin`: Deep Navy (`#0f172a`), Royal Blue accents (`#2563eb`).
  - `theme-employee`: Slate Indigo (`#1e1b4b`), Vibrant Purple accents (`#7c3aed`).
  - `theme-green`: Emerald Slate (`#064e3b`), Mint Green accents (`#10b981`).
* **Visual Polish**: Elevated cards with soft shadows, glassmorphic headers, pill status badges (`.badge-active`, `.badge-pending`, `.badge-hot`, `.badge-converted`), responsive off-canvas drawer for mobile and tablets.
* **Print Ready**: Dedicated `@media print` rules for generating clean invoices and audit reports without page elements.
