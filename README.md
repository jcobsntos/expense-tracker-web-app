# 💰 Expense Tracker Web App

A full-stack **MERN (MongoDB, Express, React, Node.js)** based Expense Tracker that helps users manage income, expenses, and budgets with an intuitive dashboard.  
Built by **[@jcobsntos](https://github.com/jcobsntos)**

![GitHub repo size](https://img.shields.io/github/repo-size/jcobsntos/expense-tracker-web-app)
![GitHub stars](https://img.shields.io/github/stars/jcobsntos/expense-tracker-web-app?style=social)
![GitHub license](https://img.shields.io/github/license/jcobsntos/expense-tracker-web-app)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 🎥 Demo Preview (GIF)

![Demo GIF Placeholder](https://github.com/user-attachments/assets/48b57900-c5a9-4132-a23b-1f32713239c6)

---

## 🛠 Tech Stack

| Technology                | Purpose                              |
| ------------------------- | ------------------------------------ |
| **React.js**              | Frontend UI library                  |
| **Tailwind CSS**          | Styling and responsive design        |
| **Node.js**               | Runtime environment                  |
| **Express.js**            | Backend framework                    |
| **MongoDB**               | Database                             |
| **Mongoose**              | ODM for MongoDB                      |
| **JWT (JSON Web Tokens)** | Authentication & Authorization       |
| **Recharts**              | Data visualization (graphs & charts) |
| **Axios**                 | API communication                    |

---

## 🚀 Features

- 🔐 **User Authentication** – Secure login & sign-up with JWT
- 📁 **Dashboard Overview** – Total balance, income & expense summary
- 💵 **Income Management** – Add, view, delete, and export income sources
- 💸 **Expense Management** – Track expenses by category, delete, and export
- 📈 **Interactive Charts** – Bar, Pie, Line, and Area charts with multiple visualization options
- 🕒 **Recent Transactions** – Quick access to the latest records
- 📁 **Excel Reports** – Export all income & expense data
- 📱 **Responsive Design** – Works across desktop, tablet, and mobile
- 🧭 **Intuitive Navigation** – Sidebar access to Dashboard, Income, Expenses, Budget, Profile, and Logout
- ❌ **Delete with Ease** – Hover over items to reveal a delete button
- 🎨 **Light Theme** – Clean and modern light theme optimized for readability
- 👤 **Profile Management** – Complete profile settings with image upload/remove
- 💰 **Budget Tracking** – Set monthly budgets by category and track spending
- 🎨 **Enhanced Visualizations** – Interactive charts with hover effects and multiple chart types
- 📊 **Spending Insights** – Advanced analytics with trend analysis

---

## 📂 Folder Structure

```
expense-tracker-web-app/
│
├── backend/                # Express server & API routes
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   └── controllers/        # Controller logic
│
├── frontend/expense-tracker/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # React pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions & configs
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📸 Screenshots

Here are some previews of the app in action:

| Login Page                 | Sign Up Page                     | Dashboard                          |
| -------------------------- | -------------------------------- | ---------------------------------- |
| ![Login](https://github.com/user-attachments/assets/a15574e0-969e-480b-abab-358e0174f3a8) | ![SignUp](https://github.com/user-attachments/assets/ebb85b14-1491-47f1-afaa-a51b294c3a53) | ![Dashboard](https://github.com/user-attachments/assets/87b0f698-a8d5-438d-9490-a76b80ab686e) |

| Income Page                  | Expense Page                    |
| ---------------------------- | ------------------------------- |
| ![Income](https://github.com/user-attachments/assets/dfd1cf3d-22d6-4f05-a586-ed598dc28477) | ![Expense](https://github.com/user-attachments/assets/d080e91f-b0bf-4bd2-9a6f-1abd2c8a01b3) |



---

## 🔄 System Architecture (Mermaid Diagram)

```mermaid
flowchart TD
    User[User] -->|HTTP Requests| A[Frontend - React + Tailwind + Light Theme]
    A -->|API Calls| B[Backend - Express + Node.js]
    B --> C[MongoDB Database]
    B --> D[Authentication via JWT]
    B --> E[Image Upload - Multer]
    B --> F[Excel Export - XLSX]
    B --> G[Budget Management]
    A --> H[Enhanced Charts - Recharts]
    A --> I[Profile Management]
    A --> J[Responsive Design]
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/jcobsntos/expense-tracker-web-app.git
cd expense-tracker-web-app
```

### 2️⃣ Node version

Make sure you’re using the correct Node version:

```bash
nvm use node
```

### 3️⃣ Install Dependencies

For backend:

```bash
cd backend
npm install express jsonwebtoken mongoose dotenv cors bcryptjs multer xlsx

```

### 🔑 Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Create .env file inside backend/

```bash
MONGO_URI=mongodb+srv://{username}:<db_password>@expensetracker.mongodb.net/?retryWrites=true&w=majority&appName={clusterName}
JWT_SECRET={generatedToken}
PORT=8000
```

### MongoDB Setup

1. Create/sign in to a MongoDB Atlas account

2. Create a cluster and get the connection string

3. Replace <db_password> in your .env file

### 4️⃣ For frontend

```bash
cd frontend/expense-tracker
npm install
```

### 5️⃣ Run the App

Go back to root folder

```bash
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🛣 Roadmap

### ✅ Recently Completed
- [x] **Light Theme Optimization** – Streamlined to a clean, consistent light theme
- [x] **Profile Management** – Comprehensive profile settings with image management
- [x] **Budget Tracking** – Monthly budget creation and monitoring by category
- [x] **Enhanced Data Visualization** – Interactive charts with multiple view options
- [x] **Improved UX** – Better navigation, animations, and user feedback
- [x] **Code Cleanup** – Removed dark mode dependencies for better performance

### 🚀 Upcoming Features
- [ ] Add recurring expenses feature
- [ ] Enhanced export functionality with date range filters
- [ ] Mobile app development (React Native)
- [ ] Multi-user support with role management
- [ ] Advanced analytics and spending predictions
- [ ] Receipt scanning with OCR
- [ ] Integration with banking APIs

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [React Documentation](https://react.dev/)
- [Node.js Docs](https://nodejs.org/en/docs/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/en-US/)

---

Built by [@jcobsntos](https://github.com/jcobsntos)
