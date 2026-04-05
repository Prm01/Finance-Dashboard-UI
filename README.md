# 💰 Finance Dashboard

A modern, production-ready Finance Dashboard built with MERN stack. Designed for personal finance management with role-based access control, real-time analytics, and a polished user experience.

---

## ✨ Key Features

### 📊 **Dashboard**
- **Summary Cards**: Total Balance, Income, Expenses, Transaction Count with period-over-period % change
- **Financial Overview**: 6-month income vs expenses trend chart with interactive tooltips
- **Spending Breakdown**: Category-wise expense distribution pie chart with percentages
- **Recent Transactions**: Quick preview of the last 5 transactions with categorization
- **Time Range Filter**: View data for custom periods (1M, 3M, 6M, 1Y, Overall)
- **Budget Progress**: Visual progress indicators for spending limits

### 💼 **Transactions Management**
- ✅ **View**: Browse all transactions with rich filtering and sorting
- ✅ **Search**: Real-time search by description (case-insensitive)
- ✅ **Filter**: By type (Income/Expense), category, and date range
- ✅ **Sort**: By date or amount (ascending/descending)
- ✅ **Export**: Download transactions as CSV
- ✅ **Pagination**: Adjustable rows per page (5-50)
- 🔒 **Admin Only**: Add, edit, delete transactions (Viewers are read-only)

### 💡 **Insights & Analytics**
- Top spending category with % share indicator
- 3-month period comparison (Income, Expenses, Net change)
- Auto-generated observations based on spending patterns
- Category breakdown with horizontal bar charts
- Trend analysis and spending recommendations

### 🎨 **User Experience**
- **Dark/Light Theme**: Toggle with persistent storage (localStorage)
- **Fully Responsive**: Mobile, tablet, and desktop layouts
- **Smooth Animations**: Framer Motion for page transitions, card hover effects, and micro-interactions
- **Loading States**: Skeleton screens during data fetching
- **Error Handling**: Graceful fallback to demo data with clear messaging
- **Empty States**: Helpful guidance when no data is available
- **Toast Notifications**: Success, error, and info feedback
- **Accessibility**: Proper contrast, clear buttons, semantic HTML

### 🔐 **Role-Based Access Control**

| Feature | Viewer | Admin |
|---------|--------|-------|
| View Dashboard | ✅ | ✅ |
| View Transactions | ✅ | ✅ |
| View Insights | ✅ | ✅ |
| Search & Filter | ✅ | ✅ |
| Export to CSV | ✅ | ✅ |
| Add Transaction | ❌ | ✅ |
| Edit Transaction | ❌ | ✅ |
| Delete Transaction | ❌ | ✅ |
| Dark/Light Mode | ✅ | ✅ |

**Viewer UI**: Cleaner, distraction-free interface focused on data consumption  
**Admin UI**: Full management capabilities with action buttons on every transaction

### 🤖 **AI Copilot (Financer)**
- Ask natural language questions about your finances
- Get AI-powered insights and recommendations
- Context-aware responses based on your data and selected time range

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite) - Fast, modern UI framework
- **Tailwind CSS** - Utility-first styling for rapid development
- **Framer Motion** - Smooth animations and page transitions
- **Recharts** - Interactive chart components
- **Lucide React** - Beautiful, consistent icons
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** + **Mongoose** - NoSQL database with schema validation
- **dotenv** - Environment configuration
- **CORS** - Cross-origin request handling

### Development Tools
- **Vite** - Lightning-fast build tool
- **ESLint** + **Prettier** - Code quality and formatting

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm v8+
- MongoDB running locally or MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd finance-dashboard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/finance-dashboard
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```

### Running Locally

**Terminal 1 - Backend**:
```bash
cd backend
npm start
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 Demo Credentials

### Login with Pre-configured Accounts

**Admin Account**
- Username: `admin`
- Password: `admin123`
- Permissions: Full access to all features

**Viewer Account**
- Username: `viewer`
- Password: `viewer123`
- Permissions: View-only access

### Sign Up

1. Click **"Register"** in the top navigation
2. Enter username (3-20 characters: a-z, 0-9, underscore)
3. Enter password (minimum 6 characters)
4. Choose role: **Admin** or **Viewer**
5. Click **Sign up**

Accounts are stored in localStorage for demo purposes.

---

## 📖 How to Use

### 🏠 Dashboard Page
**Key sections:**
- Summary cards showing key metrics and trends
- Interactive charts for visual analysis
- Recent transaction preview
- Time range selector for different viewing periods

**Tips:**
- Hover over charts for detailed information
- Click time range buttons to filter data
- Toggle dark mode in top-right corner
- Use search bar to filter transactions

### 💳 Transactions Page

**As Viewer (Read-Only):**
- View all transactions
- Search by description
- Filter by type or category
- Sort by date or amount
- Export to CSV

**As Admin (All above + Management):**
1. Click **"+ Add Transaction"**
   - Fill: Date, Amount, Type, Category, Description
   - Click Save → Success notification
2. Edit: Click ✏️ icon on any row
3. Delete: Click 🗑️ icon, confirm deletion
4. Export: Click "Export CSV" button

### 💡 Insights Page
- Top spending categories
- Monthly comparisons
- Spending observations
- Category breakdown charts

### 🔐 Authentication
**Sign In:**
1. Click "Sign in" in top navigation
2. Select demo account or enter credentials
3. Click "Sign in"

**Sign Out:**
1. Click user avatar (top-right)
2. Click "Sign out"
3. Continue browsing as guest

### 🌙 Theme Toggle
Click the Sun/Moon icon in top-right corner to switch themes. Your preference is saved.

---

## 📂 Project Structure

```
finance-dashboard/
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Page shell components
│   │   │   │   ├── TopBar.jsx      # Header
│   │   │   │   ├── UserDropdown.jsx # Auth menu
│   │   │   │   ├── Sidebar.jsx     # Navigation
│   │   │   │   └── MainLayout.jsx  # App container
│   │   │   ├── dashboard/          # Dashboard components
│   │   │   ├── transactions/       # Transaction management
│   │   │   ├── insights/           # Analytics
│   │   │   ├── copilot/            # AI Assistant
│   │   │   └── shared/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── context/                # Global state (AppContext)
│   │   ├── utils/                  # Helper functions
│   │   ├── api/                    # API configuration
│   │   ├── constants/              # App constants & mock data
│   │   ├── App.jsx                 # Main component
│   │   └── main.jsx                # Entry point
│   └── package.json
│
├── backend/                        # Express.js API
│   ├── controllers/                # Route handlers
│   ├── models/                     # Mongoose schemas
│   ├── routes/                     # API endpoints
│   ├── middleware/                 # Custom middleware
│   ├── config/                     # Database config
│   ├── seed/                       # Seed data
│   ├── server.js                   # Express app
│   └── package.json
│
└── README.md
```

---

## 🎨 Design Highlights

### Color System
**Light Mode**: Soft neutrals with teal/lime accents  
**Dark Mode**: Deep grays with vibrant teal/lime highlights

### Responsive Breakpoints
- **Mobile**: < 640px (full-width cards, vertical stack)
- **Tablet**: 640-1024px (2-column layout)
- **Desktop**: >= 1024px (3-column asymmetric layout)

### UI Components
- Cards with subtle shadows and hover effects
- Gradient text for headings
- Role badges for clear permission indication
- Loading skeletons matching component shapes
- Empty states with helpful guidance

---

## 🎬 Animations & Interactions

### Entry Animations
- Page load: Fade in + upward slide
- Cards: Staggered entrance (80ms delays)
- Charts: Smooth render (500-900ms)

### Hover Effects
- Cards: Lift with shadow increase
- Buttons: Scale 1.05 + brightness
- Rows: Left border accent + highlight

### Transitions
- Theme: Instant with smooth color changes
- Dropdowns: Scale in/out (150ms)
- Modals: Backdrop blur + zoom

---

## 🌐 Deployment

### Deploy to Render

1. **Backend**
   - Push to GitHub
   - Create Render Web Service from `backend/`
   - Set environment variables:
     ```
     PORT=4000
     MONGODB_URI=<your-mongodb-url>
     NODE_ENV=production
     ```

2. **Frontend**
   - Build: `npm run build`
   - Create Render Static Site from `frontend/dist/`
   - Set environment:
     ```
     VITE_BACKEND_URL=<your-backend-url>
     ```

3. **Database**
   - Use MongoDB Atlas free tier or paid plan

### Alternative Platforms
- **Vercel**: Frontend only
- **Netlify**: Frontend only
- **Heroku**: Full-stack apps
- **AWS**: Complete infrastructure

---

## 🧪 Testing Scenarios

### Test as Viewer
1. Login as `viewer` / `viewer123`
2. Verify "Add Transaction" button is hidden
3. Verify Edit/Delete icons are hidden
4. Verify you can view and filter data

### Test as Admin
1. Login as `admin` / `admin123`
2. Verify action buttons are visible
3. Try adding a transaction
4. Edit and delete a transaction

### Test Responsiveness
- Desktop (1024px+): Full layout
- Tablet (640-1024px): 2-column layout
- Mobile (< 640px): Vertical stack

### Test Dark Mode
- Toggle theme and verify colors are correct
- Check contrast in both modes
- Verify theme persists after reload

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend offline message | Ensure backend is running: `npm start` in `backend/` folder |
| Theme toggle not working | Check if localStorage is enabled in browser settings |
| Transactions not saving | Verify MongoDB connection string in `.env` |
| Build errors | Clear `node_modules` and `package-lock.json`, then reinstall |
| CORS errors | Verify CORS configuration in backend/server.js |
| API calls failing | Check that backend URL is correct in frontend/.env |

---

## 📋 Future Roadmap

### Phase 2
- [ ] JWT authentication with secure sessions
- [ ] Persistent user accounts in database
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Multi-currency support

### Phase 3
- [ ] Budget goals and alerts
- [ ] Recurring transaction templates
- [ ] Advanced report generation (PDF)
- [ ] Expense forecasting with ML
- [ ] Mobile app (React Native)

### Phase 4
- [ ] Shared family accounts
- [ ] Bank API integration
- [ ] Tax reporting tools
- [ ] Investment tracking
- [ ] Real-time stock integration

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - Use freely for personal or commercial projects

---

## 👏 Acknowledgments

- **Framer Motion** - Exceptional animation library
- **Recharts** - Great charting solution
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Community** - Fantastic ecosystem

---

## 💬 Support & Issues

- Check [Issues](../../issues) for similar problems
- Create new issue with:
  - Clear description of problem
  - Steps to reproduce
  - Screenshots/error logs
  - Your environment (OS, Node version, browser)

---

**Happy budgeting! 💸**

*Built with ❤️ using React, Node.js, and MongoDB*
