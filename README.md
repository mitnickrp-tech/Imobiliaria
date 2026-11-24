# Property & Rental Management Dashboard

> Portfolio project demonstrating a full-stack workflow for rental-property administration, monthly statements and owner-side cash-flow tracking.

A web application concept for organizing properties, tenants, rental agreements, agency statements and recurring expenses in one interface. The project combines a React/TypeScript frontend with a PHP API and a MySQL relational schema.

## Product scope

- Property and rental-contract registration
- Tenant and owner records
- Monthly rental statements and net-transfer tracking
- Management-fee and expense organization
- Owner cash-flow overview
- Role-oriented access flow for administrator/manager and property owner
- SQL schema, sample queries and synthetic seed data

## Architecture

```text
React + TypeScript UI
        |
        | HTTP / JSON
        v
PHP REST endpoints
        |
        | PDO / prepared statements
        v
      MySQL
```

## Technology

| Layer | Stack |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | PHP 8, PDO |
| Database | MySQL 8 |
| Data model | Relational schema, foreign keys, indexes and reporting queries |

## Repository structure

- `src/` — application interface and domain components
- `backend_php/` — PHP endpoints and database connection
- `database/schema.sql` — relational database structure
- `database/seeds.sql` — fictional demonstration data
- `database/queries.sql` — example reporting queries

## Run locally

### Requirements

- Node.js 18+
- PHP 8.1+
- MySQL 8+
- A local PHP server, XAMPP or Laragon

### Database

Create a local database and import the scripts:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seeds.sql
```

Configure database connection variables in the local PHP environment. Do not place production credentials in source files.

### Frontend

```bash
npm install
npm run dev
```

Use the local URL printed by Vite. Confirm the API base URL and PHP server configuration for your environment before testing end-to-end flows.

## Demo data and security

- Seed records are intended for local demonstration only.
- Any demo login values present in seed scripts must never be reused in production.
- Change or remove sample credentials before exposing a deployment publicly.
- Configure CORS for the exact frontend origin in a real deployment; wildcard CORS is not a production default.
- Never use real tenant, owner, bank-account or property data in a public demo.

## Project status

This repository is a portfolio demonstration. It is not presented as a certified property-management product or a production-ready deployment.

## License

No open-source license is currently provided. All rights are reserved unless permission is granted separately.
