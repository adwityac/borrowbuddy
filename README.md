# **BorrowBuddy**

A community-driven item-sharing platform that allows users to lend, borrow, and manage items with ease. Built with a full-stack architecture featuring **React**, **Node.js**, **Express**, and **MongoDB**, BorrowBuddy enables smooth item uploads, request handling, approval workflows, user dashboards, and secure authentication.



<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-22-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Backend-black?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/Authentication-JWT-orange" />
  <img src="https://img.shields.io/badge/Requests-Item%20Borrowing-yellow" />
  <img src="https://img.shields.io/badge/Status%20Flow-Pending-blue" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>



## 🚀 **Overview**

BorrowBuddy is a modern web app where users can:

- Upload items they want to lend  
- Browse items uploaded by others  
- Request to borrow an item  
- Approve or reject requests for items they own  
- Track their outgoing and incoming requests  
- Manage their dashboard with clean UI and real-time updates  

It aims to promote **community sharing**, **sustainability**, and **resource efficiency**.



## 🛠️ **Tech Stack**

### **Frontend**
- React (Vite)
- TailwindCSS
- Axios
- React Router DOM
- JWT-based protected routes

### **Backend**
- Node.js  
- Express.js  
- Multer (image uploads)  
- JWT authentication middleware  

### **Database**
- MongoDB  
- Mongoose Models (User, Item, Request)



## 📦 Features

### 🔐 **Authentication**
- JWT-based login & registration  
- Role-based access control  

### 📤 **Item Uploading**
- Upload item images (Multer)  
- Store title, description, owner, and availability  

### 🛒 **Browse Items**
- View, filter, and sort  
- Open detailed item pages  
- Request to borrow  

### 🔁 **Borrowing Flow**
- Request → Approve / Reject → Returned  
- Owner can approve or reject requests  
- Borrower can track their request status  

### 📊 **Dashboard**
- Monitor incoming requests  
- Track your active and past requests  



## 📷 **Screenshots**
<img width="1897" height="876" alt="Screenshot 2025-11-22 203123" src="https://github.com/user-attachments/assets/11a7661c-1e33-4757-b8ba-6a344a720b9a" />





## ⚙️ **Setup & Installation**

### **1. Clone the repository**
```bash
git clone https://github.com/adwityac/borrowbuddy.git
cd borrowbuddy
```

### **2. Install dependencies**

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### **3. Start servers**

Backend:
```bash
npm run start
```

Frontend:
```bash
npm run dev
```



## 📡 API Routes (Summary)

### **Item Routes**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/items` | Upload an item |
| GET | `/items` | Fetch all items |
| GET | `/items/:id` | Fetch a single item |

### **Request Routes**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/requests/:itemId` | Create borrow request |
| GET | `/requests/mine` | My requests |
| GET | `/requests/incoming` | Requests for my items |
| POST | `/requests/:id/approve` | Approve |
| POST | `/requests/:id/reject` | Reject |
| POST | `/requests/:id/returned` | Mark returned |



## 📄 License

BorrowBuddy is released under the **MIT License**.



## ❤️ Contributing

Pull requests are welcome!  
For major changes, open an issue first to discuss the update.

