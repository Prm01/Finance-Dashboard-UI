# Finance Dashboard (MERN)

A professional Finance Dashboard web application (MERN stack) with role-based Admin/Viewer UI, reusable charts (Recharts), and CRUD transaction management backed by MongoDB.

## Tech Stack

- Frontend: React.js (Vite) + Tailwind CSS
- State Management: React Context API + `useReducer`
- Charts: Recharts
- Icons: Lucide React
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- HTTP Client: Axios
- Optional frontend auth (Sign in / Register in the top bar; demo accounts stored in the browser)

## Core Features ✨

### 📊 Dashboard
- Summary cards: Total Balance, Total Income, Total Expenses, Transaction Count (with % change vs last month)
- Balance trend chart (Income vs Expenses) for the last 6 months
- Spending breakdown donut chart (expenses only) with category legend + slice percentages
- Recent transactions preview

### 💰 Transactions
- Full transaction list with Date, Amount, Category, Type
- **Search** by description (case-insensitive)
- **Advanced Filtering**:
  - By Type (All/Income/Expense)
  - By Category
  - Sort by Date or Amount (Asc/Desc)
- **Admin-only CRUD**:
  - `+ Add Transaction` button
  - Edit & Delete actions per row
  - Modal form with validation
  - Delete confirmation dialog
- **CSV Export** (download all transactions)
- Pagination (10 rows per page)

### 💡 Insights
- Top spending category with % share indicator
- Last 3 months comparison (Income, Expenses, Net)
- Auto-generated observations based on transaction data
- Category expense breakdown with horizontal bars

### 🎨 User Experience
- Dark/Light theme toggle (persisted to `localStorage`)
- Loading skeletons during API fetch
- Graceful error states (backend offline shows mock data)
- Toast notifications (success/error/info)
- Fully responsive (mobile, tablet, desktop)
- Empty states for no data scenarios

### ✨ Advanced Animations & Microinteractions
- **Staggered Card Entrance**: Summary cards animate in smoothly with staggered timing (0.1s delays)
- **Smart Card Hover**: Cards lift up on hover with dynamic shadow and glow effects
- **Icon Animations**: Summary card icons rotate and scale on hover (spring physics)
- **Value Animations**: Numbers count up to their final value with ease-out timing
- **Table Row Animations**: Transaction rows slide in from left with smooth opacity transitions
- **Row Hover Effects**: Rows highlight with left border accent on hover
- **Toast Notifications**: Notifications slide in from right with spring physics, exit smoothly
- **Chart Animations**: Both line chart and pie chart render with smooth animations
- **Floating Background Elements**: Abstract animated blobs float across the background in soft motions
- **Button Interactions**: All buttons have smooth scale and opacity transitions on hover/click
- **Page Transitions**: Pages fade in with upward slide motion
- **Modal Animations**: Forms and dialogs scale in and out with spring physics
- **Dot Pulse**: Success indicators pulse with a glow effect

**Animation Library**: Uses Framer Motion (v12+) for smooth, performant animations with:
- Spring physics for natural motion
- Stagger effects for sequential animations  
- Gesture-based interactions (whileHover, whileTap)
- AnimatePresence for exit animations

**Creative Visual Touches**:
- 🎨 Animated gradient accent bars on summary cards
- 🌊 Smooth backdrop blur effects on sticky headers
- 💫 Glow shadows that intensify on hover
- 🎯 Icon scale & rotate on interaction (spring animation)
- 📊 Charts auto-animate when data loads (500-900ms duration)
- 🎪 Floating abstract background elements for ambiance
- 🔔 Toast notifications slide in from top-right with spring bounce
- ✨ Values count up to their final number (currency and counts)
- 🎬 Smooth page transitions between Dashboard/Transactions/Insights
- 🌟 Active navigation items highlight with color transitions

### Role-based UI (Admin vs Viewer)

- **Viewer**
  - Can view Dashboard, Transactions, Insights
  - Cannot see `+ Add Transaction`
  - Cannot see Edit/Delete buttons
  - Cannot open TransactionForm or ConfirmDialog
  - Sidebar role badge shows **Viewer** (blue)
- **Admin**
  - Can view all pages and manage data
  - Sees `+ Add Transaction`
  - Sees Edit/Delete buttons on each transaction row
  - Can open the TransactionForm modal and delete confirmation dialog
  - Sidebar role badge shows **Admin** (purple)
- Role switching is instant (no page reload) and updates UI via React Context.
  - In this version, role is determined by login (no manual role switcher).

#### Feature Comparison Table

| Feature | Viewer | Admin |
|---------|--------|-------|
| View Dashboard | ✅ | ✅ |
| View Transactions | ✅ | ✅ |
| View Insights | ✅ | ✅ |
| Search Transactions | ✅ | ✅ |
| Filter & Sort | ✅ | ✅ |
| Add Transaction | ❌ | ✅ |
| Edit Transaction | ❌ | ✅ |
| Delete Transaction | ❌ | ✅ |
| Export to CSV | ✅ | ✅ |
| Toggle Dark Mode | ✅ | ✅ |

### Demo login credentials

- **Admin**: `admin` / `admin123`
- **Viewer**: `viewer` / `viewer123`

### Sign up / Register

- If you don’t have an account yet, go to `/signup` and register as:
  - **Admin** (can add/edit/delete)
  - **Viewer** (read-only)
- Accounts are stored in your browser (`localStorage`) for demo purposes.
## How to Use

### 🚀 Getting Started
1. Open `http://localhost:5173` in your browser
2. You can browse the app **without logging in** (public viewer mode)
3. To test Admin features, sign in with:
   - Email: `admin`
   - Password: `admin123`
4. To test Viewer mode, sign in with:
   - Email: `viewer`
   - Password: `viewer123`

### 📍 Dashboard Page
- **What you see**: Summary cards showing TotalBalance, Income, Expenses, Transaction Count
- **Charts**: 6-month income vs expenses trend + spending category breakdown
- **Try this**: Hover over charts for details; toggle dark mode in top-right corner

### 📋 Transactions Page
- **As Viewer**: See all transactions, use filters, search, sort, export to CSV
- **As Admin**: Do all above + Add/Edit/Delete transactions
- **Try this (Admin only)**:
  1. Click `+ Add Transaction`
  2. Fill in date, amount, type, category, description
  3. Click Save → Toast notification appears
  4. Click edit icon on any row to modify
  5. Click delete icon → Confirm deletion
  6. Click Export button to download CSV

### 💡 Insights Page
- **What you see**: Top spending category, 3-month comparison, observations
- **Try this**: Scroll to see category breakdown bars

### 🔐 Authentication Demo
- **Register**: Go to `/signup` and create new Admin/Viewer account
- **Login**: Go to `/login` and sign in with demo credentials
- **Logout**: Click logout in top-right corner (switches to public viewer mode)

### 🌙 Customization
- **Toggle Theme**: Look for sun/moon icon in top bar
- **Theme persists** in localStorage across sessions
## Folder Structure

The professional, relatable naming used here is:

- **`frontend/`**: React (Vite) app
- **`backend/`**: Express + MongoDB API

```
finance-dashboard/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── TopBar.jsx
│   │   │   │   └── MainLayout.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── SummaryCards.jsx
│   │   │   │   ├── BalanceTrendChart.jsx
│   │   │   │   └── SpendingPieChart.jsx
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionTable.jsx
│   │   │   │   ├── TransactionForm.jsx
│   │   │   │   └── FilterBar.jsx
│   │   │   ├── insights/
│   │   │   │   ├── InsightsPanel.jsx
│   │   │   │   └── MonthlyComparison.jsx
│   │   │   └── shared/
│   │   │       ├── Badge.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       └── ConfirmDialog.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   └── InsightsPage.jsx
│   │   ├── hooks/
│   │   │   └── useTransactions.js
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   ├── groupByCategory.js
│   │   │   └── getMonthlyTotals.js
│   │   ├── constants/
│   │   │   └── index.js
│   │   ├── api/
│   │   │   └── transactionsApi.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── backend/
    ├── controllers/
    │   └── transactionController.js
    ├── models/
    │   └── Transaction.js
    ├── routes/
    │   └── transactionRoutes.js
    ├── middleware/
    │   └── errorHandler.js
    ├── config/
    │   └── db.js
    ├── seed/
    │   └── seedData.js
    ├── server.js
    └── package.json
```

## Prerequisites

- Node.js (LTS recommended)
- MongoDB running locally (or update the MongoDB connection string)

## Setup Instructions

1. **Clone**
   - Clone the repository into your workspace.
2. **Install server dependencies**
   - `cd backend && npm install`
3. **Install client dependencies**
   - `cd frontend && npm install`
4. **Set up environment files**
   - Create `backend/.env` with:

     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/finance_dashboard
     NODE_ENV=development
     ```

   - Create `frontend/.env` with:

     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```
5. **Seed the database**
   - Run:
     - `node backend/seed/seedData.js`
   - The seed script deletes existing documents and inserts exactly **50** realistic transactions spanning **Jan–Jun 2025**.
6. **Start the server**
   - `cd backend && npm run dev`
7. **Start the client**
   - `cd frontend && npm run dev`

Open the frontend at:
- `http://localhost:5173`

## API Endpoint Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | Get all transactions with optional query params (`type`, `category`, `search`, `sortBy`, `sortOrder`, `startDate`, `endDate`) |
| POST | `/transactions` | Create a new transaction |
| PUT | `/transactions/:id` | Update a transaction by ID |
| DELETE | `/transactions/:id` | Delete a transaction by ID |
| GET | `/transactions/summary` | Get `{ totalBalance, totalIncome, totalExpenses, transactionCount }` |

### Query Params (`GET /transactions`)

- `type`: `"all"` \| `"income"` \| `"expense"`
- `category`: `"all"` \| one of: `Salary`, `Freelance`, `Investment`, `Food`, `Rent`, `Transport`, `Shopping`, `Health`, `Utilities`, `Entertainment`, `Education`
- `search`: string (matches `description` with case-insensitive regex)
- `sortBy`: `"date"` \| `"amount"`
- `sortOrder`: `"asc"` \| `"desc"`
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)

## How Role Switching Works

- Login assigns a role to the session (`admin` or `viewer`) and stores it in `localStorage`.
- Logout clears the session.
- UI gating:
  - Admin-only actions (`+ Add Transaction`, Edit/Delete buttons, TransactionForm modal, ConfirmDialog)
  - Viewer mode hides all admin controls while still allowing read access.

## Frontend-Only Mode vs Backend Mode

### 🟢 Works WITHOUT Backend (Frontend-Only)
- Dashboard page loads with demo data
- Transactions page shows mock data with all filters, search, sort working
- Insights page displays pre-calculated observations
- Dark mode, theme persistence, authentication UI all work
- **Limitation**: Add/Edit/Delete changes only persist in **current session** (not saved)

### 🔵 Full Feature Mode (WITH Backend)
- All features above work with **persistent data storage** (MongoDB)
- Add/Edit/Delete transactions **save to database**
- CSV export includes real data
- Changes persist across browser sessions
- Requires MongoDB running + backend server

### How to Go Frontend-Only (Optional)
If you don't have MongoDB set up:
1. Skip the `backend/` setup entirely
2. Just run `cd frontend && npm run dev`
3. App automatically detects offline mode and shows mock data

## ✨ Animations Showcase

When you run the app, watch for these delightful animations:

### Dashboard Page
- **On Load**: Summary cards slide in from bottom with staggered timing (each 0.1s apart)
- **Hover Cards**: Float up with glow shadow, icon rotates, background tints
- **Value Counter**: Numbers animate from 0 to final value (currency counter)
- **Charts**: Line chart curves animate in, pie chart slices appear sequentially
- **Background**: Soft floating gradient blobs move continuously
- **Sparklines**: Mini trend charts render smoothly

### Transactions Page
- **Table Rows**: Each row slides in from left with fade effect, staggered by row index
- **Row Hover**: Left border animates to accent color, background highlights
- **Buttons**: Edit/Delete buttons scale up on hover with smooth transitions
- **Add Button**: Pulses to draw attention, scales on interaction
- **Pagination**: Numbers transition smoothly between pages

### Toasts & Feedback
- **Success/Error Toasts**: Slide in from top-right with spring physics
- **Dismiss Button**: Scales when hovered, smooth exit animation
- **Loading States**: Skeleton screens pulse gently while fetching

### Micro-interactions
- **Theme Toggle**: Sun/moon icon rotates, page smoothly transitions between themes
- **Form Fields**: Input focus adds smooth ring animation
- **Delete Confirmation**: Modal scales in with spring physics
- **Navigation**: Active nav item color transitions smoothly

**Pro Tip**: Disable motion in DevTools → Rendering → Disable motion if you need a faster pace, or watch in 0.5x Chrome DevTools speed to see every frame!

## Testing Scenarios

### Scenario 1: Test as Viewer (Read-Only)
1. Login as `viewer` / `viewer123`
2. Verify `+ Add Transaction` button is **NOT visible**
3. Verify Edit/Delete icons are **NOT visible** on transaction rows
4. Verify sidebar shows **Viewer** badge (blue)
5. Verify you can still: view, filter, search, sort, export

### Scenario 2: Test as Admin (Full Access)
1. Login as `admin` / `admin123`
2. Verify `+ Add Transaction` button **IS visible**
3. Verify Edit/Delete icons **ARE visible** on every row
4. Click `+ Add Transaction`:
   - Fill all fields correctly
   - Try submitting with empty fields (should show validation errors)
   - Submit valid transaction → Toast notification
   - New transaction appears in table
5. Click edit on any row → Modal opens with pre-filled data
6. Click delete → Confirmation dialog appears
7. Verify sidebar shows **Admin** badge (purple)

### Scenario 3: Test Offline/Backend Down
1. Stop the backend server (or disable network)
2. Refresh the page
3. Verify dashboard still loads with mock data
4. Verify toast shows: "Unable to connect to backend..."
5. Verify app is still usable (read-only mode)

### Scenario 4: Test Responsive Design
1. Open DevTools (F12) → Toggle device toolbar
2. Test on Mobile (375px width), Tablet (768px), Desktop (1024px+)
3. Verify:
   - Desktop: Sidebar visible + desktop nav
   - Tablet: Sidebar visible + responsive spacing
   - Mobile: Sidebar hidden + bottom nav appears
   - All tables scroll horizontally on small screens
   - Forms stack properly on mobile

### Scenario 5: Test Filters & Search
1. Go to Transactions page
2. Change Type filter to "Income" → Table updates
3. Change Category to "Food" → Table updates
4. Search "salary" → Filters by description
5. Change Sort to "Amount" + "Asc" → Table re-sorts
6. Combine multiple filters → All work together

### Scenario 6: Test Dark Mode
1. Click theme toggle (sun/moon icon) in top bar
2. Verify all pages switch to dark mode
3. Refresh page → Theme persists
4. Verify colors are readable + contrast is good

## Screenshots

_Placeholder_ — Add screenshots of Dashboard, Transactions (filtered + sorted), and Insights pages.

## Design Decisions & Architecture

### Why React Context + useReducer?
- **Simple**: No Redux boilerplate for this project's scope
- **Scalable**: Reducer pattern makes state transitions predictable
- **Maintainable**: Single source of truth in AppContext
- **Performance**: Context only re-renders when its value changes

### Why Recharts?
- **React-native**: Works seamlessly with React components
- **Responsive**: Auto-scales with container
- **Customizable**: Charts are highly configurable with tooltips, legends

### Component Structure
- **Pages**: Route-level containers (DashboardPage, TransactionsPage, InsightsPage)
- **Layout**: Persistent UI (Sidebar, TopBar, MainLayout)
- **Dashboard**: Specific dashboard components (SummaryCards, Charts, etc.)
- **Transactions**: Reusable transaction UI (Table, Form, FilterBar)
- **Shared**: Reusable utilities (Modal, Toast, Badge, LoadingSkeleton, etc.)
- **Utils**: Pure functions (formatCurrency, getMonthlyTotals, groupByCategory)
- **Hooks**: Custom hooks for business logic (useAppContext)

### State Normalization
- Transactions stored as flat array in state
- Derived data (summary, charts) computed via useMemo based on transactions
- Filters separate from transactions (easy to clear/reset)
- Authentication separate from business data

### Error Handling & Fallbacks
- **Network Error**: Detects offline + shows friendly message + uses mock data
- **Validation**: Forms reject invalid input (amount > 0, all fields required)
- **Empty States**: Shows "No transactions found" instead of blank page
- **Loading States**: Skeleton screens while fetching data

## Optional Enhancements Implemented

Beyond core requirements, this project includes:

✅ **Dark Mode** — Theme toggle with localStorage persistence  
✅ **Data Persistence** — Auth & theme saved to localStorage  
✅ **Mock Data Fallback** — Works offline when backend unavailable  
✅ **Animations** — Framer Motion for smooth page transitions  
✅ **CSV Export** — Download all transactions as spreadsheet  
✅ **Advanced Filtering** — Multiple filters work together  
✅ **Toast Notifications** — Success/error feedback on actions  
✅ **Loading Skeletons** — Better UX than blank screens  
✅ **Backend Integration** — Full NodeJS + MongoDB setup  
✅ **Form Validation** — All inputs validated before submit  
✅ **Responsive Design** — Mobile-first approach, tested at 3 breakpoints  
✅ **Pagination** — Transaction table pages 10 at a time  
✅ **Role-Based UI** — Admin/Viewer modes fully functional

## Important Notes

- **Frontend-only setup**: You can skip the backend entirely and just run the frontend. Mock data will be shown automatically.
- **Database**: Update `MONGODB_URI` in `backend/.env` if MongoDB is running on a different host/port.
- **Port conflicts**: If port 5000 or 5173 is already in use, update them in `backend/server.js` and `frontend/vite.config.js`.
- **localStorage**: Auth tokens, theme preference, and filters are stored in browser localStorage (no server-side sessions).
- **CORS**: Backend accepts requests from `localhost`, `127.0.0.1`, and local network IPs on common Vite ports (`5173`–`5179`). Update the origin policy if your frontend uses a different host or port.

## Troubleshooting

### "Could not connect to backend"
- **Solution**: Start backend server (`cd backend && npm run dev`) or run frontend-only (just `cd frontend && npm run dev`)

### "MongoDB connection error"
- **Solution**: Ensure MongoDB is running or update `MONGODB_URI` to your connection string

### Transactions not persisting after refresh
- **Solution**: You're running in **frontend-only mode**. Start the backend to persist data to database.

### Port 5000/5173 already in use
- **Solution**: Change `PORT` in `backend/.env` and update `VITE_API_BASE_URL` in `frontend/.env` accordingly

### Theme not persisting
- **Solution**: Clear `localStorage` in DevTools or check browser privacy settings (private browsing disables localStorage)

### Browser Extension Error: "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received"
- **Cause**: This error is caused by browser extensions (ad blockers, privacy tools, developer extensions) and does not affect app functionality
- **Solution**: Disable problematic extensions or use incognito mode for development. The error originates from `chrome-extension://` URLs, not your application code
- **Impact**: Harmless - it's just a failed extension communication that gets logged as an uncaught promise rejection

## Project Statistics

- **Total Components**: 20+ (reusable & modular)
- **Lines of Code**: ~2,500+ (frontend + backend)
- **Features**: 15+ (including optional enhancements)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Responsive**: Yes (tested at 375px, 768px, 1024px+)

## Author Notes

This project demonstrates:
- ✅ Professional React patterns (hooks, context, custom hooks)
- ✅ Real-world state management without Redux
- ✅ Responsive design with Tailwind CSS
- ✅ Backend API design and integration
- ✅ User authentication (frontend simulation)
- ✅ Role-based access control on the UI
- ✅ Error handling and graceful degradation
- ✅ UX best practices (skeletons, toasts, empty states)
- ✅ Component composition and reusability
- ✅ Data visualization with Recharts

All code is **original** and written for this assignment.


