# 🎯 Mini Job Application Tracker

A clean, modern full-stack web app for tracking job applications across stages —
with **table** and **kanban** views, search, filters, pagination, and a polished
red-themed UI.

Built with **Next.js**, **NestJS**, **GraphQL (code-first)**, **Prisma**, and
**PostgreSQL**.

---

## ✨ Features

- **Two views** — switch between a paginated **Table** and a **Kanban board**
  grouped by stage with a segmented control.
- **Full CRUD** — add, edit, view, and delete applications.
- **Inline stage updates** — change an application's stage straight from a kanban
  card, with optimistic UI.
- **Search & filter** — by company / job title, stage, and job type, with a
  one-click _Clear filters_.
- **Pagination** — server-side `page` / `limit` for the table view.
- **Validation** — both frontend (instant feedback) and backend
  (`class-validator`).
- **Polished UX** — loading skeletons, empty states, form errors, confirmation
  dialog before delete, and toast notifications.
- **Responsive** — works on desktop and mobile.

### Stages

`Pending` · `Shortlisted` · `Interviewed` · `Hired` · `Rejected` · `Auto Delete`

### Status colors

| Status      | Color           |
| ----------- | --------------- |
| Pending     | Amber / neutral |
| Shortlisted | Indigo          |
| Interviewed | Orange          |
| Hired       | Emerald (green) |
| Rejected    | Red             |
| Auto Delete | Gray / dark     |

---

## 🧱 Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| API client | Apollo Client · react-hot-toast                     |
| Backend    | NestJS 10 · GraphQL (Apollo Driver, code-first)     |
| ORM        | Prisma 5                                            |
| Database   | PostgreSQL 16                                        |
| Validation | class-validator · class-transformer                 |

---

## 📸 Screenshots

> _Add screenshots here._

| Table view              | Kanban view               |
| ----------------------- | ------------------------- |
| _screenshots/table.png_ | _screenshots/kanban.png_  |

| Add / Edit form        | Detail view               |
| ---------------------- | ------------------------- |
| _screenshots/form.png_ | _screenshots/detail.png_  |

---

## 📁 Project Structure

```
job-app-tracker/
├── docker-compose.yml          # PostgreSQL service
├── backend/                    # NestJS + GraphQL + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma       # snake_case DB mapping
│   │   ├── migrations/         # SQL migration
│   │   └── seed.ts             # sample data for every stage
│   └── src/
│       ├── main.ts             # CORS + global ValidationPipe
│       ├── app.module.ts       # GraphQL + Apollo driver
│       ├── prisma/             # PrismaService + module
│       └── applications/       # module, resolver, service, DTOs, enums, tests
└── frontend/                   # Next.js dashboard
    └── src/
        ├── app/applications/   # list, new, [id], [id]/edit routes
        ├── components/         # Table, Kanban, Card, Form, Filters, badges…
        ├── lib/                # Apollo client + GraphQL documents
        └── types/              # shared TS types
```

---

## ✅ Prerequisites

- **Node.js** 18+ and npm
- **Docker** + Docker Compose (for PostgreSQL) — or your own local PostgreSQL

---

## 🔐 Environment Variables

### `backend/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_tracker?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV=development
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:3001/graphql"
```

Copy the provided examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

---

## 🚀 Getting Started

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env

# Generate Prisma client + apply the migration
npm run prisma:generate
npm run prisma:deploy        # or: npm run prisma:migrate (dev)

# Seed sample applications (one for every stage)
npm run db:seed

# Run the API in watch mode
npm run start:dev
```

The GraphQL API is now available at **http://localhost:3001/graphql**
(Apollo Sandbox is enabled in development).

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3000** — you'll be redirected to `/applications`.

---

## 🗄️ Database Migrations

```bash
cd backend

# Apply existing migrations (production / CI)
npm run prisma:deploy

# Create + apply a new migration during development
npm run prisma:migrate

# Inspect data visually
npm run prisma:studio
```

The Prisma schema uses **snake_case** database columns (`company_name`,
`job_title`, `job_type`, `applied_date`, `created_at`, `updated_at`) mapped to
**camelCase** fields in GraphQL and the frontend.

---

## 🔌 GraphQL API

**Endpoint:** `http://localhost:3001/graphql`

### Queries

```graphql
query Applications($filter: ApplicationFilterInput) {
  applications(filter: $filter) {
    data {
      id
      companyName
      jobTitle
      jobType
      status
      appliedDate
      notes
      createdAt
      updatedAt
    }
    meta {
      total
      page
      limit
      totalPages
    }
  }
}
```

Variables:

```json
{
  "filter": {
    "search": "google",
    "status": "PENDING",
    "jobType": "INTERNSHIP",
    "page": 1,
    "limit": 10
  }
}
```

```graphql
query Application($id: String!) {
  application(id: $id) {
    id
    companyName
    jobTitle
    status
    notes
    createdAt
    updatedAt
  }
}
```

### Mutations

```graphql
mutation CreateApplication($input: CreateApplicationInput!) {
  createApplication(input: $input) {
    id
    companyName
    jobTitle
    jobType
    status
    appliedDate
    notes
  }
}
```

Variables:

```json
{
  "input": {
    "companyName": "InternSathi",
    "jobTitle": "Full Stack Intern",
    "jobType": "INTERNSHIP",
    "status": "PENDING",
    "appliedDate": "2026-06-19T00:00:00.000Z",
    "notes": "Submitted assignment."
  }
}
```

```graphql
mutation UpdateApplication($id: String!, $input: UpdateApplicationInput!) {
  updateApplication(id: $id, input: $input) {
    id
    companyName
    jobTitle
    status
    updatedAt
  }
}
```

```graphql
mutation DeleteApplication($id: String!) {
  deleteApplication(id: $id)
}
```

---

## 🧪 Tests

A unit test for `ApplicationsService` (pagination, not-found handling, delete) is
included and does not block the app from running.

```bash
cd backend
npm test
```

---

## 🛠️ Available Scripts

### Backend

| Script                    | Description                          |
| ------------------------- | ------------------------------------ |
| `npm run start:dev`       | Run the API in watch mode            |
| `npm run build`           | Compile to `dist/`                   |
| `npm run prisma:generate` | Generate the Prisma client           |
| `npm run prisma:deploy`   | Apply migrations (non-interactive)   |
| `npm run prisma:migrate`  | Create + apply a migration (dev)     |
| `npm run db:seed`         | Seed sample data                     |
| `npm test`                | Run unit tests                       |

### Frontend

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Production build         |
| `npm start`     | Run the production build |

---

## 🔭 Future Improvements

- Drag-and-drop between kanban columns (currently a stage dropdown).
- Authentication and per-user applications.
- Sorting by column in the table view.
- GraphQL code generation for end-to-end typed operations.
- File attachments (resumes, job descriptions) per application.
- Bulk actions and CSV export.
- Automatic purge job for the **Auto Delete** stage.

---

## 📝 Notes

- CORS is enabled for the configured `CORS_ORIGIN`.
- A global `ValidationPipe` enforces input validation on every mutation.
- `application(id)` throws a proper `NotFoundException` for invalid IDs.
- The UI handles empty lists, no search results, failed requests, and validation
  errors gracefully.
