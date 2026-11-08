# FINANCifyME 💰

**FINANCifyME** is a fullstack personal finance and expense tracking application built to manage budgets, track daily income and expenses in Indian Rupee (INR ₹), analyze 12-month spending trends, and receive AI-driven financial insights.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Vite)
* **Tailwind CSS** & UI components
* **Lucide React** (Icons)
* **Axios** (API Requests)

### Backend
* **Node.js** & **Express.js**
* **PostgreSQL** (Database)
* **`pg` (node-postgres)** (Database Client)
* **Bcrypt.js** (Password Hashing)
* **JSON Web Tokens (JWT)** (Authentication)
* **Google Gemini API / GCP** (AI Insights & Analytics)

---

## ✨ Key Features

* 📊 **Expense & Income Tracking**: Log daily granular transactions across customized categories (Food, Transportation, Shopping, Groceries, Rent, Utilities, Healthcare, Travel).
* 🤖 **AI-Powered Financial Insights**: Leverage Google Gemini to analyze spending habits, suggest savings strategies, and highlight budget anomalies.
* 🎯 **Monthly Budgeting**: Set category-specific budget limits and track actual vs. projected spend in real-time.
* 📈 **12-Month Historical Trends**: Visualize bi-weekly salaries, subscriptions, seasonal spend spikes, and recurring bills over a full 12-month timeline.
* 🇮🇳 **Optimized for INR (₹)**: Pre-configured for Indian standard pricing, popular Indian vendors (*Blinkit, Zepto, BigBasket, DMart*), transportation modes (*Metro, Auto*), and streaming plans (*Netflix, Spotify, YouTube Premium*).
* ⚡ **One-Click Data Seeding**: Wipe and re-seed 12 months of synthetic transaction data with a single command.

---

## 📁 Repository Structure

```text
FINANCifyME/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   │   └── seed.js        # 12-Month INR database seeding script
│   ├── utils/
│   │   └── defaultCategories.js
│   ├── db.js              # PostgreSQL pool connection
│   ├── server.js          # Express app entry point
│   └── package.json
│
├── frontend/              # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore             # Configured to exclude .env and node_modules
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** database (Local, Supabase, or Neon)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/hasankf/FINANCifyME.git
cd FINANCifyME
```
### Step 2: Setting up the Backend
```bash
cd backend
npm install

PORT=5000
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/financifyme
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

```
### Step 3 (optional): Seed the database with a 12month realistic data 

```
npm run seed
npm start
```

### Step 4: Setting up the Frontend
```
cd frontend
npm install

VITE_API_BASE_URL=http://localhost:5000/api

npm run dev
```

## 🔑 Demo Login Credentials

Once the seed script (`npm run seed`) has been executed, you can immediately log into the application using:

* **Email:** `hasan@gmail.com`
* **Password:** `h12345`
* **Deployment Link: ** `https://finan-cify-me.vercel.app/login`
---

## 🔐 Security Note

* Never commit your `.env` file or GCP/Gemini API keys to Git.
* Always ensure `.env` and `node_modules` are included in your `.gitignore` file before pushing updates.

---

## 👨‍💻 Author

* **Hasan Kamaal** - [@hasankf](https://github.com/hasankf)
