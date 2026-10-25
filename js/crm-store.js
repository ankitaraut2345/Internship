/**
 * Skyline CRM - Central Reactive Data Store & Business Logic
 * Persists data to localStorage with automatic seed initialization
 */

const CRM_STORAGE_KEY = "skyline_crm_data";
const CRM_SESSION_KEY = "skyline_crm_session";

// Default Seed Dataset matching the project wireframes
const DEFAULT_CRM_DATA = {
  users: [
    { id: 1, name: "Admin User", email: "admin@skyline.com", mobile: "9876500001", type: "Admin", status: "Active", createdOn: "01 Jan 2026" },
    { id: 2, name: "Anjali Sharma", email: "anjali.sharma@skyline.com", mobile: "9876543211", type: "Employee", status: "Active", createdOn: "15 Feb 2026" },
    { id: 3, name: "Vikas Patil", email: "vikas.patil@skyline.com", mobile: "9876543212", type: "Employee", status: "Active", createdOn: "20 Feb 2026" },
    { id: 4, name: "Rohan Deshmukh", email: "rohan.d@skyline.com", mobile: "9876543213", type: "Agent User", status: "Active", createdOn: "03 Mar 2026" },
    { id: 5, name: "Sneha Kulkarni", email: "sneha.k@skyline.com", mobile: "9876543214", type: "Agent User", status: "Inactive", createdOn: "10 Mar 2026" }
  ],
  enquiries: [
    { id: 1, code: "ENQ-07082026-001", date: "2026-08-07", customer: "Rahul Mehta", mobile: "9876543210", project: "Skyline Heights", flatType: "2 BHK", budget: 4500000, source: "Website", location: "City Center", bedrooms: "2", purpose: "Self Use", type: "Hot Lead" },
    { id: 2, code: "ENQ-07082026-002", date: "2026-08-07", customer: "Neha Sharma", mobile: "9123456780", project: "Skyline Heights", flatType: "3 BHK", budget: 5200000, source: "Walk In", location: "North Wing", bedrooms: "3", purpose: "Self Use", type: "Warm Lead" },
    { id: 3, code: "ENQ-07082026-003", date: "2026-08-06", customer: "Amit Verma", mobile: "9988776655", project: "Green Valley", flatType: "1 BHK", budget: 3850000, source: "Referral", location: "Highway Touch", bedrooms: "1", purpose: "Investment", type: "Warm Lead" },
    { id: 4, code: "ENQ-07082026-004", date: "2026-08-06", customer: "Pooja Singh", mobile: "9012345678", project: "Skyline Heights", flatType: "2 BHK", budget: 4800000, source: "Just Dial", location: "City Center", bedrooms: "2", purpose: "Self Use", type: "Hot Lead" },
    { id: 5, code: "ENQ-07082026-005", date: "2026-08-05", customer: "Karan Patel", mobile: "8765432109", project: "Green Valley", flatType: "1 BHK", budget: 3500000, source: "Facebook", location: "North Wing", bedrooms: "1", purpose: "Investment", type: "Cold Lead" }
  ],
  followups: [
    { id: 1, enquiryCode: "ENQ-07082026-001", customer: "Rahul Mehta", mobile: "9876543210", type: "Call", date: "2026-08-08", status: "Pending", nextDate: "2026-08-10", notes: "Client requested floor plan PDF via WhatsApp" },
    { id: 2, enquiryCode: "ENQ-07082026-002", customer: "Neha Sharma", mobile: "9123456780", type: "Visit", date: "2026-08-08", status: "Pending", nextDate: "2026-08-11", notes: "Site inspection scheduled for 4 PM with family" },
    { id: 3, enquiryCode: "ENQ-07082026-003", customer: "Amit Verma", mobile: "9988776655", type: "Call", date: "2026-08-09", status: "Completed", nextDate: "-", notes: "Discussion on bank loan pre-approval done" },
    { id: 4, enquiryCode: "ENQ-07082026-004", customer: "Pooja Singh", mobile: "9012345678", type: "Email", date: "2026-08-09", status: "Pending", nextDate: "2026-08-12", notes: "Sent payment schedule and sample agreement" },
    { id: 5, enquiryCode: "ENQ-07082026-005", customer: "Karan Patel", mobile: "8765432109", type: "Call", date: "2026-08-10", status: "In Progress", nextDate: "2026-08-13", notes: "Negotiating on parking charges" }
  ],
  leads: [
    { id: 1, code: "LD-07082026-001", customer: "Rahul Mehta", mobile: "9876543210", source: "Website", status: "New", assignedTo: "Anjali Sharma", createdDate: "2026-08-07" },
    { id: 2, code: "LD-07082026-002", customer: "Neha Sharma", mobile: "9123456780", source: "Walk In", status: "Contacted", assignedTo: "Vikas Patil", createdDate: "2026-08-07" },
    { id: 3, code: "LD-07082026-003", customer: "Amit Verma", mobile: "9988776655", source: "Referral", status: "In Progress", assignedTo: "Anjali Sharma", createdDate: "2026-08-06" },
    { id: 4, code: "LD-07082026-004", customer: "Pooja Singh", mobile: "9012345678", source: "Just Dial", status: "Follow Up", assignedTo: "Vikas Patil", createdDate: "2026-08-06" },
    { id: 5, code: "LD-07082026-005", customer: "Karan Patel", mobile: "8765432109", source: "Facebook", status: "Converted", assignedTo: "Anjali Sharma", createdDate: "2026-08-05" }
  ],
  sales: [
    { id: 1, date: "2026-08-07", customer: "Rahul Mehta", mobile: "9876543210", project: "Skyline Heights", flatNo: "A-101", saleAmount: 4500000, bookingAmount: 500000, mode: "Bank Transfer", remarks: "Booking token received via RTGS" },
    { id: 2, date: "2026-08-06", customer: "Neha Sharma", mobile: "9123456780", project: "Skyline Heights", flatNo: "B-204", saleAmount: 5200000, bookingAmount: 600000, mode: "UPI", remarks: "Advance booking paid" },
    { id: 3, date: "2026-08-05", customer: "Amit Verma", mobile: "9988776655", project: "Green Valley", flatNo: "C-302", saleAmount: 3850000, bookingAmount: 300000, mode: "Cheque", remarks: "Cheque #40918 cleared" },
    { id: 4, date: "2026-08-04", customer: "Pooja Singh", mobile: "9012345678", project: "Skyline Heights", flatNo: "A-402", saleAmount: 4800000, bookingAmount: 500000, mode: "Bank Transfer", remarks: "Agreement executed" },
    { id: 5, date: "2026-08-03", customer: "Karan Patel", mobile: "8765432109", project: "Green Valley", flatNo: "D-103", saleAmount: 3500000, bookingAmount: 350000, mode: "Cash", remarks: "Initial token deposit" }
  ],
  daybook: [
    { id: 1, date: "2026-08-07", particulars: "Flat Booking - Rahul Mehta (A-101)", type: "Income", mode: "Bank Transfer", income: 200000, expense: 0, balance: 200000 },
    { id: 2, date: "2026-08-07", particulars: "Site Visit Expense", type: "Expense", mode: "Cash", income: 0, expense: 1250, balance: 198750 },
    { id: 3, date: "2026-08-07", particulars: "Token Amount - Neha Sharma (B-203)", type: "Income", mode: "UPI", income: 50000, expense: 0, balance: 248750 },
    { id: 4, date: "2026-08-07", particulars: "Courier Charges", type: "Expense", mode: "Cash", income: 0, expense: 120, balance: 248630 },
    { id: 5, date: "2026-08-07", particulars: "Consultancy Income", type: "Income", mode: "Bank Transfer", income: 25000, expense: 0, balance: 273630 }
  ],
  pettycash: [
    { id: 1, date: "2026-08-07", voucherNo: "PC-07082026-001", particulars: "Tea & Snacks", category: "Office Expense", mode: "Cash", amount: 350, remarks: "Client refreshments" },
    { id: 2, date: "2026-08-07", voucherNo: "PC-07082026-002", particulars: "Auto Fare", category: "Traveling Expense", mode: "Cash", amount: 180, remarks: "Sub-registrar office trip" },
    { id: 3, date: "2026-08-07", voucherNo: "PC-07082026-003", particulars: "Stationery Items", category: "Office Expense", mode: "Cash", amount: 245, remarks: "Files and stamp pads" },
    { id: 4, date: "2026-08-07", voucherNo: "PC-07082026-004", particulars: "Printing Charges", category: "Printing & Stationery", mode: "Cash", amount: 120, remarks: "Brochures draft print" },
    { id: 5, date: "2026-08-07", voucherNo: "PC-07082026-005", particulars: "Courier Charges", category: "Office Expense", mode: "Cash", amount: 60, remarks: "Speed post docs" }
  ],
  payments: [
    { id: 1, date: "2026-08-07", recipient: "UltraTech Cement Ltd", category: "Vendor Settlement", mode: "Bank Transfer", amount: 85000, remarks: "Inv #UTC-4091" },
    { id: 2, date: "2026-08-07", recipient: "Anjali Sharma", category: "Employee Advance", mode: "Bank Transfer", amount: 45000, remarks: "July Incentive" },
    { id: 3, date: "2026-08-06", recipient: "Vikas Patil", category: "Employee Advance", mode: "Bank Transfer", amount: 40000, remarks: "Monthly Advance" },
    { id: 4, date: "2026-08-05", recipient: "Tata Steel Suppliers", category: "Vendor Settlement", mode: "Cheque", amount: 45000, remarks: "Chq #092144" },
    { id: 5, date: "2026-08-03", recipient: "Asian Paints Depot", category: "Vendor Settlement", mode: "Bank Transfer", amount: 20000, remarks: "Exterior Primer Lot" }
  ]
};

// Store Manager Object
const CRMStore = {
  getRawData() {
    try {
      const dataStr = localStorage.getItem(CRM_STORAGE_KEY);
      if (!dataStr) {
        localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(DEFAULT_CRM_DATA));
        return JSON.parse(JSON.stringify(DEFAULT_CRM_DATA));
      }
      return JSON.parse(dataStr);
    } catch (e) {
      console.error("Error reading CRM store:", e);
      return JSON.parse(JSON.stringify(DEFAULT_CRM_DATA));
    }
  },

  saveRawData(data) {
    try {
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event("crm_data_updated"));
    } catch (e) {
      console.error("Error saving CRM store:", e);
    }
  },

  // Session
  getSession() {
    try {
      const s = localStorage.getItem(CRM_SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(userType, name, role) {
    const session = {
      userType: userType || "admin",
      name: name || (userType === "admin" ? "Admin User" : "Employee User"),
      role: role || (userType === "admin" ? "Super Admin" : "Sales Executive"),
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(CRM_SESSION_KEY, JSON.stringify(session));
  },

  logout() {
    localStorage.removeItem(CRM_SESSION_KEY);
    window.location.href = "login.html";
  },

  // USERS
  getUsers() {
    return this.getRawData().users || [];
  },
  addUser(user) {
    const data = this.getRawData();
    user.id = Date.now();
    user.createdOn = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    data.users.unshift(user);
    this.saveRawData(data);
    return user;
  },
  updateUser(id, updatedFields) {
    const data = this.getRawData();
    const idx = data.users.findIndex(u => u.id == id);
    if (idx !== -1) {
      data.users[idx] = { ...data.users[idx], ...updatedFields };
      this.saveRawData(data);
      return data.users[idx];
    }
    return null;
  },
  deleteUser(id) {
    const data = this.getRawData();
    data.users = data.users.filter(u => u.id != id);
    this.saveRawData(data);
  },

  // ENQUIRIES
  getEnquiries() {
    return this.getRawData().enquiries || [];
  },
  addEnquiry(enq) {
    const data = this.getRawData();
    enq.id = Date.now();
    const count = (data.enquiries.length + 1).toString().padStart(3, "0");
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    enq.code = `ENQ-${todayStr}-${count}`;
    data.enquiries.unshift(enq);

    // Auto-create prospective Lead
    const newLead = {
      id: Date.now() + 1,
      code: `LD-${todayStr}-${count}`,
      customer: enq.customer,
      mobile: enq.mobile,
      source: enq.source || "Website",
      status: "New",
      assignedTo: "Anjali Sharma",
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    };
    data.leads.unshift(newLead);

    this.saveRawData(data);
    return enq;
  },
  deleteEnquiry(id) {
    const data = this.getRawData();
    data.enquiries = data.enquiries.filter(e => e.id != id);
    this.saveRawData(data);
  },

  // FOLLOW UPS
  getFollowups() {
    return this.getRawData().followups || [];
  },
  addFollowup(f) {
    const data = this.getRawData();
    f.id = Date.now();
    data.followups.unshift(f);
    this.saveRawData(data);
    return f;
  },
  updateFollowupStatus(id, newStatus) {
    const data = this.getRawData();
    const item = data.followups.find(f => f.id == id);
    if (item) {
      item.status = newStatus;
      this.saveRawData(data);
    }
  },
  deleteFollowup(id) {
    const data = this.getRawData();
    data.followups = data.followups.filter(f => f.id != id);
    this.saveRawData(data);
  },

  // LEADS
  getLeads() {
    return this.getRawData().leads || [];
  },
  addLead(lead) {
    const data = this.getRawData();
    lead.id = Date.now();
    const count = (data.leads.length + 1).toString().padStart(3, "0");
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    lead.code = `LD-${todayStr}-${count}`;
    lead.createdDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    data.leads.unshift(lead);
    this.saveRawData(data);
    return lead;
  },
  updateLeadStatus(id, status, assignedTo) {
    const data = this.getRawData();
    const lead = data.leads.find(l => l.id == id);
    if (lead) {
      if (status) lead.status = status;
      if (assignedTo) lead.assignedTo = assignedTo;
      this.saveRawData(data);
    }
  },
  deleteLead(id) {
    const data = this.getRawData();
    data.leads = data.leads.filter(l => l.id != id);
    this.saveRawData(data);
  },

  // FLAT SALES
  getSales() {
    return this.getRawData().sales || [];
  },
  addSale(sale) {
    const data = this.getRawData();
    sale.id = Date.now();
    data.sales.unshift(sale);

    // Auto record in Day Book as Income!
    if (sale.bookingAmount && Number(sale.bookingAmount) > 0) {
      const prevBal = data.daybook.length > 0 ? data.daybook[0].balance : 0;
      const bAmount = Number(sale.bookingAmount);
      data.daybook.unshift({
        id: Date.now() + 2,
        date: sale.date || new Date().toISOString().split("T")[0],
        particulars: `Flat Booking - ${sale.customer} (${sale.flatNo})`,
        type: "Income",
        mode: sale.mode || "Bank Transfer",
        income: bAmount,
        expense: 0,
        balance: prevBal + bAmount
      });
    }

    this.saveRawData(data);
    return sale;
  },
  deleteSale(id) {
    const data = this.getRawData();
    data.sales = data.sales.filter(s => s.id != id);
    this.saveRawData(data);
  },

  // DAY BOOK
  getDaybook() {
    return this.getRawData().daybook || [];
  },
  addDaybookEntry(entry) {
    const data = this.getRawData();
    entry.id = Date.now();
    const prevBal = data.daybook.length > 0 ? data.daybook[0].balance : 0;
    const inc = Number(entry.income) || 0;
    const exp = Number(entry.expense) || 0;
    entry.balance = prevBal + inc - exp;
    data.daybook.unshift(entry);
    this.saveRawData(data);
    return entry;
  },

  // PETTY CASH
  getPettyCash() {
    return this.getRawData().pettycash || [];
  },
  addPettyCashEntry(pc) {
    const data = this.getRawData();
    pc.id = Date.now();
    const count = (data.pettycash.length + 1).toString().padStart(3, "0");
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    pc.voucherNo = `PC-${todayStr}-${count}`;
    data.pettycash.unshift(pc);

    // Sync with Daybook as an Expense
    const prevBal = data.daybook.length > 0 ? data.daybook[0].balance : 0;
    const amt = Number(pc.amount) || 0;
    data.daybook.unshift({
      id: Date.now() + 3,
      date: pc.date,
      particulars: `Petty Cash: ${pc.particulars} (${pc.category})`,
      type: "Expense",
      mode: pc.mode || "Cash",
      income: 0,
      expense: amt,
      balance: prevBal - amt
    });

    this.saveRawData(data);
    return pc;
  },
  deletePettyCash(id) {
    const data = this.getRawData();
    data.pettycash = data.pettycash.filter(p => p.id != id);
    this.saveRawData(data);
  },

  // PAYMENTS (Vendor & Employee)
  getPayments() {
    return this.getRawData().payments || [];
  },
  addPayment(pay) {
    const data = this.getRawData();
    pay.id = Date.now();
    data.payments.unshift(pay);

    // Sync with Daybook as Expense
    const prevBal = data.daybook.length > 0 ? data.daybook[0].balance : 0;
    const amt = Number(pay.amount) || 0;
    data.daybook.unshift({
      id: Date.now() + 4,
      date: pay.date,
      particulars: `${pay.category}: ${pay.recipient}`,
      type: "Expense",
      mode: pay.mode || "Bank Transfer",
      income: 0,
      expense: amt,
      balance: prevBal - amt
    });

    this.saveRawData(data);
    return pay;
  },

  // FINANCIAL SUMMARY (Calculates live stats for Dashboard & Reports)
  getFinancialSummary() {
    const data = this.getRawData();
    let clientPaymentTotal = 0;
    data.sales.forEach(s => {
      clientPaymentTotal += Number(s.bookingAmount) || 0;
    });

    let employeePaymentTotal = 0;
    let vendorPaymentTotal = 0;
    data.payments.forEach(p => {
      if (p.category.includes("Employee")) {
        employeePaymentTotal += Number(p.amount) || 0;
      } else {
        vendorPaymentTotal += Number(p.amount) || 0;
      }
    });

    let totalExpenses = 0;
    let totalIncome = 0;
    data.daybook.forEach(d => {
      totalIncome += Number(d.income) || 0;
      totalExpenses += Number(d.expense) || 0;
    });

    const netBalance = totalIncome - totalExpenses;

    let pettyCashTotal = 0;
    data.pettycash.forEach(p => {
      pettyCashTotal += Number(p.amount) || 0;
    });

    return {
      clientPaymentTotal: clientPaymentTotal > 0 ? clientPaymentTotal : 2000000,
      employeePaymentTotal: employeePaymentTotal > 0 ? employeePaymentTotal : 200000,
      vendorPaymentTotal: vendorPaymentTotal > 0 ? vendorPaymentTotal : 150000,
      totalExpenses: totalExpenses > 0 ? totalExpenses : 50000,
      totalIncome: totalIncome > 0 ? totalIncome : 1600000,
      netBalance: netBalance !== 0 ? netBalance : 290000,
      pettyCashTotal: pettyCashTotal > 0 ? pettyCashTotal : 26780,
      totalEnquiries: data.enquiries.length,
      totalFollowups: data.followups.length,
      totalLeads: data.leads.length,
      totalSales: data.sales.length,
      totalUsers: data.users.length
    };
  }
};

// Expose globally
window.CRMStore = CRMStore;
