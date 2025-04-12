# ⚙️ BittenApol - Admin Panel

This is the admin dashboard for the BittenApol e-commerce platform. It allows administrators to manage products, view orders, and oversee user activity.

## 📌 Features

- Product management (Create, Edit, Delete)
- User and role management
- Order tracking and status updates
- Protected admin routes with role-based access
- Clean and responsive admin interface

## 🛠️ Technologies Used

- **Frontend:** Next.js, React, TypeScript
- **Backend:** API Routes (Next.js)
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT or session-based (NextAuth, Google OAuth, etc.)
- **UI:** Tailwind CSS (or custom admin UI)

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/eloylozano/bitten-apol-admin.git
cd bitten-apol-admin
```

2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Configure environment variables
Create a .env.local file in the root with:
```env
MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/your_db
ADMIN_SECRET_KEY=your_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4️⃣ Run the project
```bash
npm run dev
Access the dashboard at: http://localhost:3000/admin
```

📁 Project Structure
```bash
📂 app/
 ├── 📂 admin/           # Admin routes and pages
 ├── 📂 api/             # Backend API routes
 ├── 📂 components/      # Shared dashboard components
 ├── 📂 models/          # Mongoose schemas
 ├── 📜 layout.tsx       # App layout
 ├── 📜 page.tsx         # Main landing (if applicable)
```
