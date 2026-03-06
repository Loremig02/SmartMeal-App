# 🍽️ SmartMeal

> **Intelligent home pantry management and food waste reduction**

SmartMeal is a full-stack web application that combines digital pantry management with generative AI. The **Smart Chef** module analyzes ingredients close to their expiration date and generates personalized recipes in real time, shifting food waste management from reactive to proactive.

Developed as a Bachelor's thesis in Computer Engineering and Automation at **Politecnico di Bari** (A.Y. 2024/2025).

---

## 📸 Screenshots

| Dashboard | Dispensa |
|:---------:|:--------:|
| ![Dashboard](./docs/screenshots/dashboard_SmartMeal.png) | ![Dispensa](./docs/screenshots/dispensa_SmartMeal.png) |

| Smart Chef | Email Notification |
|:----------:|:-----------------:|
| ![SmartChef](./docs/screenshots/smartChef_ricetta_generata.png) | ![Email](./docs/screenshots/email_notifica.png) |

---

## ✨ Features

- **📦 Pantry management** — Digital inventory with tracking of name, category, quantity and expiration date
- **⏰ Expiration monitoring** — Automatic freshness status (Fresh / Expiring Soon / Expired) with color-coded badges
- **📧 Proactive email notifications** — Daily scheduled job (9:00 AM) sending summary emails for critical items
- **🤖 Smart Chef (AI)** — Personalized recipe generation via Google Gemini, prioritizing ingredients closest to expiration
- **📊 Dashboard & Statistics** — Real-time KPIs on consumption vs waste, weekly trends and personal metrics
- **🔐 Secure authentication** — JWT system with short-lived access token (15min) + refresh token (7d) and bcrypt password hashing

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)

### Database & Cloud
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?logo=supabase&logoColor=white)

### AI & External Services
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email_API-000000)

---

## 🏗️ Architecture

SmartMeal follows a **Three-Tier Architecture** with clear separation between layers:

```
+---------------------------------------------------------+
|                    CLIENT (Browser)                     |
|         React SPA - Context API - React Router         |
+---------------------------+-----------------------------+
                            | HTTP / REST API
+---------------------------v-----------------------------+
|                   SERVER (Node.js)                      |
|    Express - JWT Auth - Zod Validation - node-cron     |
|              Google Gemini - Resend Email               |
+---------------------------+-----------------------------+
                            | Prisma ORM
+---------------------------v-----------------------------+
|              DATABASE (PostgreSQL / Supabase)           |
|           User - Food - Recipe - ConsumptionLog        |
+---------------------------------------------------------+
```

### Project structure

```
smartmeal/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Dashboard, Pantry, SmartChef, Recipes
│       ├── context/          # AppContext (global state management)
│       ├── services/         # API call layer (axios)
│       └── utils/            # Utility functions
│
└── server/                   # Node.js + Express backend
    ├── routes/               # REST endpoints
    ├── controllers/          # HTTP request handlers
    ├── services/             # Business logic (AI, email)
    ├── middlewares/          # JWT auth, Zod validation
    ├── jobs/                 # Scheduled tasks (notifications)
    └── prisma/               # Database schema
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- A PostgreSQL instance (or a free Supabase account)
- A Google Gemini API key
- A Resend account for email delivery

### 1. Clone the repository

```bash
git clone https://github.com/Loremig02/SmartMeal-App.git
cd SmartMeal-App
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Fill in `server/.env` with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/smartmeal"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Server
PORT=3000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"

# Resend (Email)
RESEND_API_KEY="your-resend-api-key"
RESEND_EMAIL_FROM="onboarding@resend.dev"

# Notification schedule (cron format)
NOTIFICATION_SCHEDULE="0 9 * * *"
```

### 3. Install dependencies and run

```bash
# Backend
cd server
npm install
npx prisma migrate dev
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📊 Performance

All performance targets were met during the validation phase:

| Operation | Avg. Response Time | Target |
|-----------|:-----------------:|:------:|
| Login | 267 ms | < 500 ms ✅ |
| Load pantry list | 174 ms | < 500 ms ✅ |
| Load dashboard | 274 ms | < 500 ms ✅ |
| Create food item | 89 ms | < 500 ms ✅ |
| Delete food item | 324 ms | < 500 ms ✅ |
| AI recipe generation | 26.2 s | < 30 s ✅ |
| Email notification job | 1.41 s | — ✅ |

---

## 🧪 Testing

15 functional test scenarios executed with a 100% pass rate:

```
✓ TF-01  New user registration
✓ TF-02  Login with valid credentials
✓ TF-03  Login with invalid credentials
✓ TF-04  Add food item to pantry
✓ TF-05  Edit food item
✓ TF-06  Remove item (Consumed)
✓ TF-07  Remove item (Wasted)
✓ TF-08  Freshness status: Fresh
✓ TF-09  Freshness status: Expiring Soon
✓ TF-10  Freshness status: Expired
✓ TF-11  AI recipe generation
✓ TF-12  Save recipe
✓ TF-13  Automatic token refresh
✓ TF-14  Logout
✓ TF-15  Access protected route → redirect to login

15/15 passed
```

---

## 🤖 How Smart Chef Works

The AI module follows a 4-step pipeline:

```
1. SELECTION   → Identify critical items (expiring / expired)
                 sorted by urgency, up to 5 priority ingredients

2. PROMPTING   → Dynamically build the prompt with:
                 • Role: "culinary assistant specialized in reducing food waste"
                 • Ingredient list with days remaining until expiration
                 • Constraints: use all provided ingredients, no extra shopping
                 • Expected output: structured JSON

3. GENERATION  → Call Google Gemini 2.5 Flash API
                 → Response: title, ingredients, steps, anti-waste note

4. VALIDATION  → JSON syntax check
                 → Verify priority ingredients are present (threshold: 80%)
                 → In testing: ingredient usage rate = 100%
```

---

## 🌍 Motivation

According to the **UNEP Food Waste Index Report 2024**, 1.05 billion tonnes of food were wasted globally in 2022, with **60% occurring in private households**. In Italy alone, the average family loses around **290 EUR/year** in unconsumed products.

SmartMeal addresses this by shifting from a *reactive* approach (notifying about expiration) to a *proactive* one (suggesting a solution), filling a clear gap in the current app landscape:

| App | Pantry | Expiration | Notifications | AI Recipes | Anti-waste logic |
|-----|:------:|:----------:|:-------------:|:----------:|:----------------:|
| No Waste | ✅ | ✅ | ⚠️ alert only | ❌ | ❌ |
| SuperCook | ⚠️ manual | ❌ | ❌ | ✅ | ❌ no time factor |
| GialloZafferano | ❌ | ❌ | ❌ | ✅ | ❌ |
| **SmartMeal** | ✅ | ✅ | ✅ | ✅ AI | ✅ **integrated** |

---

## 🔭 Future Development

- [ ] OCR receipt scanning for automatic food item insertion
- [ ] Barcode scanner to add products via product code
- [ ] Web Push Notifications for real-time mobile alerts
- [ ] Progressive Web App (PWA) for installation and offline access
- [ ] Shared pantry between household members
- [ ] IoT integration with smart fridges for automatic tracking
- [ ] Voice assistant support (Alexa / Google Assistant)

---

## 👨‍💻 Author

**Lorenzo Mignone**
B.Sc. Computer Engineering and Automation — Politecnico di Bari (2025)
Supervisor: Prof. Marina Mongiello

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin)](https://www.linkedin.com/in/lorenzo-mignone-6129aa3b4/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?logo=github)](https://github.com/Loremig02)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
