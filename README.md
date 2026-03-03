# Database Architecture: Real Property Tax Monitoring System
**Municipality of Sta. Rita, Samar**

## Overview
This document serves as the primary technical reference for the Real Property Tax Monitoring System schema. We follow a modular database design to ensure data integrity and auditability.



---

## 1. Schema Classification
To keep our queries organized, we categorize all tables into four functional tiers. 

### A. Reference Tables (The "Lookup" Layer)
These contain static data that drives system calculations and UI dropdowns.
* `barangays`: Administrative divisions of Sta. Rita.
* `smv_schedule`: The authoritative source for land market values.
* `assessment_level_schedule`: Percentage multipliers for assessed values.
* `depreciation_schedule`: Rules for structural value decay.
* `payment_channels_ref` & `document_types_ref`: Standardized list for receipts and documents.

### B. Junction Tables (The "Relationship" Layer)
These manage many-to-many relationships, specifically regarding access control.
* `role_permissions`: Links specific system roles to actionable permissions.
* `user_role_assignments`: Bridges users to their functional roles (e.g., Collector, Assessor).

### C. Master Tables (The "Entities" Layer)
These are our core "Nouns." They are the foundational records for all other operations.
* `taxpayers`: The central identity profile for property owners.
* `properties`: The physical land parcel records (identified by PIN).
* `tax_declarations` (TD): The legal snapshot of a property at a given time. **Crucial:** Everything related to tax usually traces back to a TD.
* `buildings`: Sub-entities attached to property records.

### D. Transaction Tables (The "Activity" Layer)
These form the ledger. They record the movement of money and legal statuses.
* `billing_schedules`: Yearly tax configurations and rates.
* `assessments_billing`: The specific annual tax bill issued to a property.
* `payments`: The official audit trail of collected taxes (OR generation).
* `voided_receipts`: Log of cancelled payments.
* `delinquencies`: Tracking for unpaid bills.
* `reassessments`: Audit trail for valuation changes.



---

## 2. Terminology Cheat Sheet
Use these terms when writing SQL queries or discussing the system with the team to avoid ambiguity:

| Term | Context | Definition |
| :--- | :--- | :--- |
| **TD** | Tax Declaration | The primary document used to tie an owner to a specific property value. |
| **PIN** | Property Index Number | A unique alphanumeric code for land parcels. *Note: Never use this as a primary key for logic; use the UUID/BigInt `id`.* |
| **ARP** | Assessment Roll Property | Reference number found within `tax_declarations`. |
| **SMV** | Schedule of Market Values | The "price list" for land, set by municipal ordinance. |
| **OR** | Official Receipt | A finalized record in the `payments` table. |
| **SEF** | Special Education Fund | A tax component calculation defined in `billing_schedules`. |

---

## 3. Critical Developer Guidelines

### The "Service Role" Warning
Our project architecture uses the **Supabase Service-Role key** for all database operations via the Next.js API routes.

* **What this means:** We bypass **Row Level Security (RLS)** entirely.
* **The Danger:** The database will not stop you from deleting or updating rows unintentionally because RLS policies are not enforcing row-level logic.
* **Best Practice:** **Always write and test your `SELECT` queries before running `UPDATE` or `DELETE`.** Ensure your `WHERE` clauses are explicit and validated.

### Handling Joins
When querying data, keep the hierarchical flow in mind:
1.  Query the Master (e.g., `tax_declarations`).
2.  Join to the Transaction (e.g., `assessments_billing`).
3.  Filter by Reference (e.g., `barangays` or `payment_channels_ref`).

*Example:* To find all payments for a specific taxpayer, start with `taxpayers` -> `tax_declarations` -> `payments`.