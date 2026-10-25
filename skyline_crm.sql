-- ==============================================================================
-- SKYLINE CRM - ENTERPRISE REAL ESTATE MANAGEMENT SYSTEM
-- MySQL Database DDL & Seed Script for Java Full Stack (JSP / Servlet / JDBC / Spring)
-- Designed for: Skyline Real Estate Management
-- ==============================================================================

DROP DATABASE IF EXISTS `skyline_crm`;
CREATE DATABASE `skyline_crm` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skyline_crm`;

-- ------------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION TABLE
-- Supports: Admin, Employee, Agent User roles with password hash and status
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL DEFAULT '$2a$10$e7q9eEcm6qKq1t2lR8vS0OGz3uGk9x2oVpB', -- Default: 'admin123'
  `mobile` VARCHAR(20) NOT NULL,
  `type` ENUM('Admin', 'Employee', 'Agent User') NOT NULL DEFAULT 'Employee',
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_type (`type`),
  INDEX idx_users_status (`status`)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- Master project catalog (Skyline Heights, Green Valley, Sunrise Residency)
-- ------------------------------------------------------------------------------
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `total_units` INT NOT NULL DEFAULT 100,
  `available_units` INT NOT NULL DEFAULT 65,
  `base_price` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('Active', 'Upcoming', 'Completed') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 3. ENQUIRIES TABLE
-- Client inquiry records logged by sales team
-- ------------------------------------------------------------------------------
CREATE TABLE `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `date` DATE NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150),
  `project_name` VARCHAR(150) NOT NULL,
  `flat_type` VARCHAR(50) NOT NULL, -- '1 BHK', '2 BHK', '3 BHK', 'Penthouse'
  `budget` DECIMAL(15, 2) NOT NULL,
  `source` VARCHAR(50) NOT NULL, -- 'Website', 'Walk In', 'Referral', 'Just Dial', 'Facebook'
  `location` VARCHAR(150),
  `bedrooms` VARCHAR(20),
  `purpose` ENUM('Self Use', 'Investment') DEFAULT 'Self Use',
  `lead_type` ENUM('Hot Lead', 'Warm Lead', 'Cold Lead') DEFAULT 'Warm Lead',
  `remarks` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_enquiry_date (`date`),
  INDEX idx_enquiry_customer (`customer_name`)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. LEADS PIPELINE TABLE
-- Prospective buyers with assignment to sales executives
-- ------------------------------------------------------------------------------
CREATE TABLE `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `source` VARCHAR(50) NOT NULL,
  `status` ENUM('New', 'Contacted', 'In Progress', 'Follow Up', 'Converted', 'Lost') DEFAULT 'New',
  `assigned_to` VARCHAR(100) NOT NULL,
  `created_date` DATE NOT NULL,
  `notes` TEXT,
  INDEX idx_leads_status (`status`),
  INDEX idx_leads_assigned (`assigned_to`)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. FOLLOW UPS TABLE
-- Scheduled interaction events (Call, Visit, WhatsApp, Email)
-- ------------------------------------------------------------------------------
CREATE TABLE `followups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `enquiry_code` VARCHAR(50),
  `customer_name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `type` ENUM('Call', 'Visit', 'Email', 'WhatsApp') NOT NULL DEFAULT 'Call',
  `followup_date` DATE NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  `next_followup_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_followup_status (`status`),
  INDEX idx_followup_date (`followup_date`)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 6. FLAT SALES TABLE
-- Property bookings and agreement records
-- ------------------------------------------------------------------------------
CREATE TABLE `flat_sales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `project_name` VARCHAR(150) NOT NULL,
  `flat_no` VARCHAR(50) NOT NULL,
  `sale_amount` DECIMAL(15, 2) NOT NULL,
  `booking_amount` DECIMAL(15, 2) NOT NULL,
  `payment_mode` VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
  `remarks` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sale_customer (`customer_name`),
  INDEX idx_sale_project (`project_name`)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 7. DAY BOOK JOURNAL TABLE
-- Double-entry accounting ledger of all incoming and outgoing funds
-- ------------------------------------------------------------------------------
CREATE TABLE `daybook` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NOT NULL,
  `particulars` VARCHAR(255) NOT NULL,
  `type` ENUM('Income', 'Expense') NOT NULL,
  `payment_mode` VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
  `income` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `expense` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_daybook_date (`date`),
  INDEX idx_daybook_type (`type`)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 8. PETTY CASH VOUCHERS TABLE
-- Office petty cash disbursement tracking
-- ------------------------------------------------------------------------------
CREATE TABLE `petty_cash` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `voucher_no` VARCHAR(50) NOT NULL UNIQUE,
  `date` DATE NOT NULL,
  `particulars` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL, -- 'Office Expense', 'Traveling Expense', 'Printing & Stationery'
  `payment_mode` VARCHAR(50) NOT NULL DEFAULT 'Cash',
  `amount` DECIMAL(12, 2) NOT NULL,
  `remarks` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_petty_voucher (`voucher_no`),
  INDEX idx_petty_category (`category`)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 9. PAYMENTS TABLE (Vendor Settlements & Employee Payroll Advances)
-- ------------------------------------------------------------------------------
CREATE TABLE `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NOT NULL,
  `recipient` VARCHAR(150) NOT NULL,
  `category` ENUM('Vendor Settlement', 'Employee Advance', 'Salary', 'Incentive') NOT NULL,
  `payment_mode` VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
  `amount` DECIMAL(15, 2) NOT NULL,
  `remarks` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_payment_category (`category`),
  INDEX idx_payment_recipient (`recipient`)
) ENGINE=InnoDB;


-- ==============================================================================
-- SEED DATA INSERTION (Matching Application State)
-- ==============================================================================

-- 1. Users
INSERT INTO `users` (`id`, `name`, `email`, `mobile`, `type`, `status`, `created_on`) VALUES
(1, 'Admin User', 'admin@skyline.com', '9876500001', 'Admin', 'Active', '2026-01-01 10:00:00'),
(2, 'Anjali Sharma', 'anjali.sharma@skyline.com', '9876543211', 'Employee', 'Active', '2026-02-15 11:30:00'),
(3, 'Vikas Patil', 'vikas.patil@skyline.com', '9876543212', 'Employee', 'Active', '2026-02-20 09:15:00'),
(4, 'Rohan Deshmukh', 'rohan.d@skyline.com', '9876543213', 'Agent User', 'Active', '2026-03-03 14:00:00'),
(5, 'Sneha Kulkarni', 'sneha.k@skyline.com', '9876543214', 'Agent User', 'Inactive', '2026-03-10 16:45:00');

-- 2. Projects
INSERT INTO `projects` (`code`, `name`, `location`, `total_units`, `available_units`, `base_price`) VALUES
('PRJ-001', 'Skyline Heights', 'City Center', 120, 42, 4500000.00),
('PRJ-002', 'Green Valley', 'North Wing / Highway', 90, 28, 3500000.00),
('PRJ-003', 'Sunrise Residency', 'South Corridor', 80, 55, 5200000.00);

-- 3. Enquiries
INSERT INTO `enquiries` (`code`, `date`, `customer_name`, `mobile`, `project_name`, `flat_type`, `budget`, `source`, `location`, `bedrooms`, `purpose`, `lead_type`, `remarks`) VALUES
('ENQ-07082026-001', '2026-08-07', 'Rahul Mehta', '9876543210', 'Skyline Heights', '2 BHK', 4500000.00, 'Website', 'City Center', '2', 'Self Use', 'Hot Lead', 'Looking for immediate possession unit with east facing balcony.'),
('ENQ-07082026-002', '2026-08-07', 'Neha Sharma', '9123456780', 'Skyline Heights', '3 BHK', 5200000.00, 'Walk In', 'North Wing', '3', 'Self Use', 'Warm Lead', 'Walked into site office with family; interested in 4th floor.'),
('ENQ-07082026-003', '2026-08-06', 'Amit Verma', '9988776655', 'Green Valley', '1 BHK', 3850000.00, 'Referral', 'Highway Touch', '1', 'Investment', 'Warm Lead', 'Seeking rental yield investment with easy bank loan approval.'),
('ENQ-07082026-004', '2026-08-06', 'Pooja Singh', '9012345678', 'Skyline Heights', '2 BHK', 4800000.00, 'Just Dial', 'City Center', '2', 'Self Use', 'Hot Lead', 'Pre-approved home loan from SBI; ready to give booking token.'),
('ENQ-07082026-005', '2026-08-05', 'Karan Patel', '8765432109', 'Green Valley', '1 BHK', 3500000.00, 'Facebook', 'North Wing', '1', 'Investment', 'Cold Lead', 'Expressed interest via social ad campaign.');

-- 4. Leads
INSERT INTO `leads` (`code`, `customer_name`, `mobile`, `source`, `status`, `assigned_to`, `created_date`, `notes`) VALUES
('LD-07082026-001', 'Rahul Mehta', '9876543210', 'Website', 'New', 'Anjali Sharma', '2026-08-07', 'Inquiry converted to high priority prospective buyer.'),
('LD-07082026-002', 'Neha Sharma', '9123456780', 'Walk In', 'Contacted', 'Vikas Patil', '2026-08-07', 'Shared master layout and pricing breakdown.'),
('LD-07082026-003', 'Amit Verma', '9988776655', 'Referral', 'In Progress', 'Anjali Sharma', '2026-08-06', 'Home loan eligibility check in progress with HDFC Bank.'),
('LD-07082026-004', 'Pooja Singh', '9012345678', 'Just Dial', 'Follow Up', 'Vikas Patil', '2026-08-06', 'Sample flat inspection scheduled.'),
('LD-07082026-005', 'Karan Patel', '8765432109', 'Facebook', 'Converted', 'Anjali Sharma', '2026-08-05', 'Booking confirmed and agreement executed.');

-- 5. Follow Ups
INSERT INTO `followups` (`enquiry_code`, `customer_name`, `mobile`, `type`, `followup_date`, `status`, `next_followup_date`, `notes`) VALUES
('ENQ-07082026-001', 'Rahul Mehta', '9876543210', 'Call', '2026-08-08', 'Pending', '2026-08-10', 'Client requested floor plan PDF via WhatsApp'),
('ENQ-07082026-002', 'Neha Sharma', '9123456780', 'Visit', '2026-08-08', 'Pending', '2026-08-11', 'Site inspection scheduled for 4 PM with family'),
('ENQ-07082026-003', 'Amit Verma', '9988776655', 'Call', '2026-08-09', 'Completed', NULL, 'Discussion on bank loan pre-approval done'),
('ENQ-07082026-004', 'Pooja Singh', '9012345678', 'Email', '2026-08-09', 'Pending', '2026-08-12', 'Sent payment schedule and sample agreement'),
('ENQ-07082026-005', 'Karan Patel', '8765432109', 'Call', '2026-08-10', 'In Progress', '2026-08-13', 'Negotiating on parking allotment charges');

-- 6. Flat Sales
INSERT INTO `flat_sales` (`date`, `customer_name`, `mobile`, `project_name`, `flat_no`, `sale_amount`, `booking_amount`, `payment_mode`, `remarks`) VALUES
('2026-08-07', 'Rahul Mehta', '9876543210', 'Skyline Heights', 'A-101', 4500000.00, 500000.00, 'Bank Transfer', 'Booking token received via RTGS UTR #291049281'),
('2026-08-06', 'Neha Sharma', '9123456780', 'Skyline Heights', 'B-204', 5200000.00, 600000.00, 'UPI', 'Advance booking token paid online'),
('2026-08-05', 'Amit Verma', '9988776655', 'Green Valley', 'C-302', 3850000.00, 300000.00, 'Cheque', 'Cheque #40918 cleared in HDFC account'),
('2026-08-04', 'Pooja Singh', '9012345678', 'Skyline Heights', 'A-402', 4800000.00, 500000.00, 'Bank Transfer', 'Agreement executed and stamp duty registered'),
('2026-08-03', 'Karan Patel', '8765432109', 'Green Valley', 'D-103', 3500000.00, 350000.00, 'Cash', 'Initial token deposit deposited in petty cash chest');

-- 7. Day Book Ledger
INSERT INTO `daybook` (`date`, `particulars`, `type`, `payment_mode`, `income`, `expense`, `balance`) VALUES
('2026-08-07', 'Flat Booking - Rahul Mehta (A-101)', 'Income', 'Bank Transfer', 200000.00, 0.00, 200000.00),
('2026-08-07', 'Site Visit Expense', 'Expense', 'Cash', 0.00, 1250.00, 198750.00),
('2026-08-07', 'Token Amount - Neha Sharma (B-203)', 'Income', 'UPI', 50000.00, 0.00, 248750.00),
('2026-08-07', 'Courier Charges', 'Expense', 'Cash', 0.00, 120.00, 248630.00),
('2026-08-07', 'Consultancy Income', 'Income', 'Bank Transfer', 25000.00, 0.00, 273630.00);

-- 8. Petty Cash
INSERT INTO `petty_cash` (`voucher_no`, `date`, `particulars`, `category`, `payment_mode`, `amount`, `remarks`) VALUES
('PC-07082026-001', '2026-08-07', 'Tea & Snacks', 'Office Expense', 'Cash', 350.00, 'Client refreshments on site'),
('PC-07082026-002', '2026-08-07', 'Auto Fare', 'Traveling Expense', 'Cash', 180.00, 'Sub-registrar office travel'),
('PC-07082026-003', '2026-08-07', 'Stationery Items', 'Office Expense', 'Cash', 245.00, 'Files, registers and stamp pads'),
('PC-07082026-004', '2026-08-07', 'Printing Charges', 'Printing & Stationery', 'Cash', 120.00, 'Brochures draft print copies'),
('PC-07082026-005', '2026-08-07', 'Courier Charges', 'Office Expense', 'Cash', 60.00, 'Speed post legal agreements');

-- 9. Payments
INSERT INTO `payments` (`date`, `recipient`, `category`, `payment_mode`, `amount`, `remarks`) VALUES
('2026-08-07', 'UltraTech Cement Ltd', 'Vendor Settlement', 'Bank Transfer', 85000.00, 'Invoice #UTC-4091 batch delivery'),
('2026-08-07', 'Anjali Sharma', 'Employee Advance', 'Bank Transfer', 45000.00, 'July performance incentive'),
('2026-08-06', 'Vikas Patil', 'Employee Advance', 'Bank Transfer', 40000.00, 'August monthly advance'),
('2026-08-05', 'Tata Steel Suppliers', 'Vendor Settlement', 'Cheque', 45000.00, 'Chq #092144 structural steel batch'),
('2026-08-03', 'Asian Paints Depot', 'Vendor Settlement', 'Bank Transfer', 20000.00, 'Exterior primer lot 14');

-- ------------------------------------------------------------------------------
-- HELPFUL VIEWS FOR REPORTING & JSP DASHBOARDS
-- ------------------------------------------------------------------------------

-- View: Consolidated Financial Summary
CREATE OR REPLACE VIEW `view_financial_summary` AS
SELECT
  (SELECT COALESCE(SUM(booking_amount), 0) FROM flat_sales) AS client_payment_total,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE category = 'Employee Advance') AS employee_payment_total,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE category = 'Vendor Settlement') AS vendor_payment_total,
  (SELECT COALESCE(SUM(expense), 0) FROM daybook) AS total_expenses,
  (SELECT COALESCE(SUM(income), 0) FROM daybook) AS total_income,
  ((SELECT COALESCE(SUM(income), 0) FROM daybook) - (SELECT COALESCE(SUM(expense), 0) FROM daybook)) AS net_operating_balance,
  (SELECT COALESCE(SUM(amount), 0) FROM petty_cash) AS petty_cash_total;

-- View: Active Pipeline Leads
CREATE OR REPLACE VIEW `view_active_leads` AS
SELECT 
  id, code, customer_name, mobile, source, status, assigned_to, created_date
FROM `leads`
WHERE status NOT IN ('Converted', 'Lost')
ORDER BY created_date DESC;

-- View: Pending Follow Ups
CREATE OR REPLACE VIEW `view_pending_followups` AS
SELECT 
  id, enquiry_code, customer_name, mobile, type, followup_date, status, next_followup_date, notes
FROM `followups`
WHERE status = 'Pending'
ORDER BY followup_date ASC;

-- ==============================================================================
-- END OF SCRIPT
-- ==============================================================================
