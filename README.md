# 🍬 Sweet Management System
A full-stack Sweet Shop Management application for managing inventory and stock using **MERN Stack** (MongoDB, Express.js, React.js, Node.js).
---
## 📁 Project Structure
/server => Node.js, Express.js, MongoDB (Mongoose) \
/client => React.js (Fetch, React Router)

## 🚀 Backend Setup
### 📦 Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- Jest + Supertest (for API Testing)

### 📁 Folder: `/server`
### ⚙️ Installation & Running
1. Navigate to backend folder:
```bash
cd backend
npm install
```
2. Create .env file: \
```bash
PORT=3000 \
DB_URL=mongodb+srv://<your-production-db-url> \
TEST_DB_URL=mongodb://localhost:27017/sweet_test \
```
3. Start Backend Server:\
npm start
4. Run Unit/API Tests:\
```bash
npm test
```

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| POST   | `/api/v1/sweet/add-item`     | Add a new sweet item                 |
| POST   | `/api/v1/sweet/buy-sweet`    | Purchase sweet item                  |
| POST   | `/api/v1/sweet/add-quantity` | Add stock quantity to existing sweet |
| POST   | `/api/v1/sweet/delete-sweet` | Delete sweet item                    |
| POST   | `/api/v1/sweet/search`       | Search sweets by category / price    |

## 💻 Frontend Setup
### 📦 Technologies Used
- React.js
- Fetch (for API Calls)
- React Router (for navigation)
- Tailwind CSS / Bootstrap (optional for styling)

## 📁 Folder: /client
### ⚙️ Installation & Running
1. Navigate to frontend folder:
```bash
cd frontend
```
2.Install dependencies:
```bash
npm install
```
3. Create .env file: \
```bash
const VITE_BACKEND_URL = 'http://localhost:3000';
```
5. Start Frontend Development Server:
```bash
npm start
```
