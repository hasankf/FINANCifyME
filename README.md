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

🚀 Getting Started
Prerequisites
Node.js (v18+ recommended)
PostgreSQL database running locally or hosted (e.g., Supabase, Neon, Render)
1. Clone the Repository
git clone [https://github.com/hasankf/FINANCifyME.git](https://github.com/hasankf/FINANCifyME.git)
cd FINANCifyME

2. Backend Setup
cd backend
npm install

Create a .env file inside the backend/ directory:
PORT=5000
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/financifyme
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

Run database setup & seed demo data:
npm run seed

Start the backend server:
npm start
# or for development
npm run dev

3. Frontend Setup
In a new terminal window:
cd frontend
npm install

Create a .env file inside the frontend/ directory:
VITE_API_BASE_URL=http://localhost:5000/api

Start the frontend development server:
npm run dev

🔑 Demo Login Credentials
Once the seed script (npm run seed) has been executed, you can immediately log into the application using:
Email: hasan@gmail.com
Password: h12345
🔐 Security Note
Never commit your .env file or GCP/Gemini API keys to Git.
Always ensure .env and node_modules are included in your .gitignore file before pushing updates.
👨‍💻 Author

Hasan Kamaal - @hasankf
