<p align="center">
  <img src="https://img.icons8.com/fluency/96/warehouse.png" alt="Smart IMS Logo" width="80" />
</p>

<h1 align="center">MultiKitchen Co. — Smart IMS Backend</h1>

<p align="center">
  <strong>Industrial-grade Inventory Management System for modern kitchen operations</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/express-5.x-000000?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/prisma-7.x-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/postgres-16-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-data-model">Data Model</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## ✨ Overview

The **Smart IMS Backend** is the RESTful API powering the MultiKitchen Co. inventory ecosystem. It handles everything from real-time stock tracking and automated report generation (PDF & Excel) to role-based access control, service bookings, customer reviews, and internal team communication — all secured with stateless JWT authentication.

---

## 🧩 Key Features

| Feature | Description |
| :--- | :--- |
| 📦 **Inventory CRUD** | Create, read, update, and delete inventory items with barcode support and brand categorization |
| 📊 **Smart Reports** | Generate stock, daily, and monthly reports — export to PDF or Excel with branded templates |
| 🔐 **JWT Authentication** | Stateless auth with short-lived access tokens (30 min) and long-lived refresh tokens (7 days) |
| 👥 **Role-Based Access** | Granular permissions for `ADMIN` and `OWNER` roles across all endpoints |
| 📉 **Low Stock Alerts** | Automatic detection of items falling below configurable minimum quantity thresholds |
| 🔄 **Batch Operations** | Issue or receive stock in bulk with a single API call |
| 🗓️ **Booking System** | Public-facing service booking management with status tracking |
| ⭐ **Review System** | Collect and moderate customer reviews with ratings |
| 💬 **Chat / Inquiries** | Message system for guest inquiries with admin reply functionality |
| 🏷️ **Brand Management** | Organize items under brand categories for streamlined inventory |
| 🗄️ **Backup Logging** | Track database backup events and history |

---

## 🛠 Tech Stack

```
Runtime        →  Node.js 22.x (ES Modules)
Framework      →  Express 5
ORM            →  Prisma 7 (PostgreSQL adapter)
Database       →  PostgreSQL
Auth           →  jsonwebtoken + bcryptjs
Reports        →  jspdf / jspdf-autotable / exceljs
File Uploads   →  multer
Language       →  JavaScript (with TypeScript compilation)
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
| :--- | :--- |
| [Node.js](https://nodejs.org/) | `>= 22.x` |
| [npm](https://www.npmjs.com/) | `>= 10.x` |
| [PostgreSQL](https://www.postgresql.org/) | `>= 14` |

### 1 — Clone & Install

```bash
git clone https://github.com/Sachintha-Prabashana/multikitchen-backend.git
cd multikitchen-backend
npm install
```

### 2 — Configure Environment

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/multikitchen?schema=public"
JWT_SECRET="your_jwt_secret_here"
REFRESH_TOKEN_SECRET="your_refresh_token_secret_here"
```

### 3 — Set Up Database

```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# (Optional) Seed initial admin & owner accounts
npm run seed
```

> **Default seed accounts:**
> | Role | Email | Password |
> | :--- | :--- | :--- |
> | Owner | `owner@example.com` | `owner123` |
> | Admin | `admin@example.com` | `admin123` |

### 4 — Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/login` | ✗ | — | Authenticate and receive tokens |
| `POST` | `/register` | ✓ | Admin / Owner | Register a new user |
| `POST` | `/refresh` | ✗ | — | Refresh an expired access token |
| `PUT` | `/profile` | ✓ | Any | Update own profile |

### Items — `/api/items`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | ✓ | Any | List all inventory items |
| `POST` | `/` | ✓ | Admin | Add a new item |
| `PUT` | `/:id` | ✓ | Admin | Update an item |
| `DELETE` | `/:id` | ✓ | Admin | Delete an item |

### Stock — `/api/stock`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/issue` | ✓ | Any | Issue stock for a single item |
| `POST` | `/issue/batch` | ✓ | Any | Batch issue stock |
| `POST` | `/receive` | ✓ | Any | Receive stock for a single item |
| `POST` | `/receive/batch` | ✓ | Any | Batch receive stock |
| `GET` | `/history` | ✓ | Any | View transaction history |
| `GET` | `/low` | ✓ | Any | List items below minimum stock |

### Reports — `/api/reports`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/stock` | ✓ | Any | Current stock report |
| `GET` | `/daily` | ✓ | Any | Daily transaction report |
| `GET` | `/monthly` | ✓ | Admin | Monthly summary report |
| `GET` | `/summary` | ✓ | Any | Aggregated analytics summary |
| `GET` | `/export` | ✓ | Any | Export stock report (Excel) |
| `POST` | `/issue-slip` | ✓ | Any | Generate issue slip (PDF) |

### Users — `/api/users`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | ✓ | Admin / Owner | List all users |
| `PUT` | `/:id` | ✓ | Admin / Owner | Update user role |
| `DELETE` | `/:id` | ✓ | Admin / Owner | Remove a user |

### Brands — `/api/brands`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | ✓ | Any | List all brands |
| `POST` | `/` | ✓ | Admin | Create a brand |

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/` | ✗ | — | Create a new booking (public) |
| `GET` | `/` | ✗ | — | List all bookings |

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | ✗ | — | List approved reviews |
| `POST` | `/` | ✗ | — | Submit a new review |

### Chat — `/api/chat`

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/send` | ✗ | — | Send a guest message |
| `GET` | `/messages` | ✓ | Any | Retrieve all messages |
| `POST` | `/reply/:id` | ✓ | Admin | Reply to a message |

---

## 🗄 Data Model

```mermaid
erDiagram
    User ||--o{ Transaction : creates
    User ||--o{ BackupLog : performs
    Item ||--o{ Transaction : tracks
    Brand ||--o{ Item : categorizes

    User {
        int user_id PK
        string name
        string email UK
        string password
        enum role
        datetime created_at
    }

    Item {
        int item_id PK
        string item_name
        string barcode UK
        float buying_price
        float selling_price
        int quantity
        int min_quantity
        int brand_id FK
    }

    Brand {
        int id PK
        string name UK
        datetime created_at
    }

    Transaction {
        int transaction_id PK
        int item_id FK
        enum type
        int quantity
        datetime date
        int user_id FK
        string worker_name
    }

    Report {
        int report_id PK
        string report_type
        int generated_by
        datetime date
    }

    BackupLog {
        int backup_id PK
        datetime date
        string file_path
        int user_id FK
    }

    Message {
        int message_id PK
        string sender_name
        string message
        string reply
        string status
        datetime created_at
    }

    Booking {
        int booking_id PK
        string name
        string email
        string phone
        string service
        datetime date_time
        string status
    }

    Review {
        int review_id PK
        string name
        int rating
        string comment
        string avatar
        string status
    }
```

---

## 📂 Project Structure

```
backend/
├── prisma/
│   ├── migrations/          # Database migration history
│   ├── schema.prisma        # Prisma data model definition
│   └── seed.js              # Database seeding script
├── src/
│   ├── controllers/         # Request handlers (business logic)
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── stockController.js
│   │   ├── reportController.js
│   │   ├── userController.js
│   │   ├── brandController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── chatController.js
│   │   └── backupController.js
│   ├── routes/              # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── userRoutes.js
│   │   ├── brandRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── chatRoutes.js
│   │   └── backupRoutes.js
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.js    # JWT verification & role guards
│   │   └── errorMiddleware.js   # Global error handler
│   ├── services/            # Service layer (data access)
│   ├── lib/                 # Shared libraries (Prisma client)
│   ├── utils/               # Utility functions (JWT, response handlers)
│   └── index.js             # Application entry point
├── .env                     # Environment variables (not committed)
├── .gitignore
├── Procfile                 # Heroku process definition
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server with hot-reload (nodemon) |
| `npm run build` | Generate Prisma client + compile TypeScript to `dist/` |
| `npm start` | Run the production build from `dist/` |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npm run prisma:migrate` | Apply pending database migrations |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |
| `npm run seed` | Seed the database with initial data |

---

## 🚢 Deployment

This project is production-ready for **Heroku** and similar PaaS providers.

### Heroku

```bash
# Login to Heroku CLI
heroku login

# Create app & add PostgreSQL
heroku create multikitchen-backend
heroku addons:create heroku-postgresql:essential-0

# Set environment variables
heroku config:set JWT_SECRET="your_secret"
heroku config:set REFRESH_TOKEN_SECRET="your_refresh_secret"

# Deploy
git push heroku main
```

The `heroku-postbuild` script automatically runs `npm run build` (Prisma generate + TypeScript compile) on each deploy.

### CORS Configuration

The API is configured to accept requests from:
- `https://multikitchen-frontend.vercel.app` — Production frontend
- `http://localhost:3000` — Local development

Update the `origin` array in `src/index.js` to add additional allowed origins.

---

## 🔒 Authentication Flow

```
┌──────────┐      POST /api/auth/login       ┌──────────┐
│  Client  │ ──────────────────────────────► │  Server  │
│          │ ◄────────────────────────────── │          │
│          │   { accessToken, refreshToken } │          │
│          │                                 │          │
│          │   GET /api/items                │          │
│          │   Authorization: Bearer <token> │          │
│          │ ──────────────────────────────► │          │
│          │ ◄────────────────────────────── │          │
│          │         { items: [...] }        │          │
│          │                                 │          │
│          │   POST /api/auth/refresh        │          │
│          │   { refreshToken }              │          │
│          │ ──────────────────────────────► │          │
│          │ ◄────────────────────────────── │          │
│          │   { newAccessToken }            │          │
└──────────┘                                 └──────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m "feat: add amazing feature"`
4. Push to the branch — `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See [LICENSE](LICENSE) for more information.

---

<p align="center">
  Built with ❤️ by the <strong>MultiKitchen Co.</strong> team
</p>
