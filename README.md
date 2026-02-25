# Souvik Tech Agency — Frontend
<p align="center">
  <img src="https://raw.githubusercontent.com/souvikghost/Souvik-Tech-Agency-Frontend/main/public/assets/Souvik%20Tech%20Agency%20Main%20Logo.svg" alt="Souvik Tech Agency" height="80" />
</p>

> A role-based software company management portal for managing employees, clients, services, projects, and internal messaging.

🔗 **Live Demo:** [https://souviktechagency.vercel.app](https://souviktechagency.vercel.app)  
🔗 **Backend Repo:** [https://github.com/souvikghost/Souvik-Tech-Agency](https://github.com/souvikghost/Souvik-Tech-Agency)


---
## Infrastructure

| Layer | Platform | Details |
|-------|----------|---------|
| Frontend | Vercel | Auto-deployed from GitHub, global CDN |
| Backend | AWS EC2 | Ubuntu server, running 24/7 with PM2 process manager |
| Database | MongoDB Atlas | Cloud-hosted, connected to EC2 backend |
| Media Storage | Cloudinary | Avatar uploads with face-crop transformation |
| Auth | HTTP-only Cookie + JWT | Secure cross-origin auth between Vercel and EC2 |
---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Test Credentials](#test-credentials)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Deployment](#deployment)

---

## Overview

Souvik Tech Agency is a full-stack management portal with three distinct roles — **Admin**, **Employee**, and **Client**. Each role has a dedicated portal with specific capabilities. The system supports service requests, project management, internal messaging, and profile management with avatar uploads.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack React Query v5 |
| Routing | React Router v6 |
| HTTP | Native Fetch API with cookie-based auth |

---

## Features

### Admin
- Dashboard with live stats — total users, services, requests, projects
- Create employees and clients with role-based onboarding
- Soft-delete users — records preserved, viewable in Deleted tab
- Create and delete services with starting price
- Approve or reject client service requests — project auto-created on approval
- Assign and unassign employees to projects
- Mark projects as completed or stopped
- Messaging with all employees and clients
- Edit profile name and upload avatar
- Payment management per project — add, edit, delete payment records (amount, method, status, date, notes)
- Revenue tracking on dashboard — total collected, partial payments, outstanding amounts
- Full payment records table on dashboard with project, client, amount, method, status, date

### Employee
- View all assigned projects with status
- Update project status (cannot unassign themselves)
- Message admin and assigned clients
- Edit profile name and upload avatar

### Client
- Browse all available services with pricing
- Submit service requests with a custom note
- View approved projects and track their status
- Message admin and assigned employees
- Edit profile name and upload avatar
- View payment status per project (paid, partial, unpaid) with amount and date

### Shared
- Polling-based messaging (no WebSocket required)
- Avatar upload via Cloudinary with face-crop transformation
- Soft delete — deleted users shown with label in records, excluded from messaging
- Protected routes — unauthenticated users redirected to login, wrong role redirected to own portal
- Demo Login button on login page for quick access
- Soft-deleted users blocked from logging in — returns invalid credentials on login attempt

---

## Test Credentials

| Role     | Email                              | Password |
|----------|------------------------------------|----------|
| Admin    | admin@souviktechagency.com         | abcd     |
| Employee | jake@souviktechagency.com          | abcd     |
| Client   | dana@souviktechagency.com          | abcd     |

> A **Demo Login** button is available on the bottom-right corner of the login page — click it to see all credentials at a glance.

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Backend server running locally or deployed (see [backend repo](https://github.com/souvikghost/Souvik-Tech-Agency))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/souvikghost/Souvik-Tech-Agency-Frontend
cd Souvik-Tech-Agency-Frontend

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_API_URL=http://localhost:9797/api
```

> For production deployment, set `VITE_API_URL` to your deployed backend URL in your hosting platform's environment variable settings.

### Run Locally

```bash
npm run dev
```

App will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## Project Structure


src/
├── api/                        # API call functions per feature
│   ├── auth.js                 # login, logout, getMe
│   ├── user.js                 # getEmployees, getClients, createUser, deleteUser
│   ├── services.js             # getServices, createService, deleteService
│   ├── requests.js             # getRequests, approveRequest, rejectRequest
│   ├── projects.js             # getProjects, updateStatus, assignEmployees
│   ├── messages.js             # getConversations, getThread, sendMessage, deleteConversation
│   ├── payment.js              # getPayments, getPaymentByProject, getPaymentStats, createPayment, updatePayment, deletePayment
│   └── dashboard.js            # getDashboardStats
├── assets/                     # Logos and static assets
├── components/
│   ├── forAdmin/               # Admin portal pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AllUsers.jsx
│   │   ├── RunningProjects.jsx
│   │   ├── ServiceRequest.jsx
│   │   └── Services.jsx
│   ├── forClient/              # Client portal pages
│   │   ├── ApprovedProjects.jsx
│   │   ├── ListedServices.jsx
│   │   ├── ServiceCard.jsx
│   │   └── SubmittedProjectRequest.jsx
│   ├── forEmployee/            # Employee portal pages
│   │   └── RunningProjectsForEmployee.jsx
│   ├── modalPopUp/             # Reusable modal components
│   ├── AppLayout.jsx           # Role-based layout wrapper
│   ├── Body.jsx                # Router config with protected routes
│   ├── ConfirmDeleteModal.jsx  # Shared confirm delete modal
│   ├── Login.jsx               # Login page with demo credentials helper
│   ├── Messages.jsx            # Shared messaging component (all roles)
│   ├── OwnProfile.jsx          # Shared profile page (all roles)
│   ├── Placeholder.jsx         # Loading/empty placeholder
│   ├── ProtectedRoute.jsx      # Auth + role-based route guards
│   ├── StatCard.jsx            # Dashboard stat card
│   ├── StatusBadge.jsx         # Status pill badge component
│   └── UniversalUI.jsx         # Sidebar + top bar layout shell
├── context/
│   └── AuthContext.jsx         # Global user state, login, logout
├── fonts/                      # Self-hosted font files
├── hooks/
│   └── useToast.jsx            # Toast notification hook
├── lib/
│   └── api.js                  # Base fetch wrapper — getAPI, postAPI, patchAPI, delAPI
├── utils/
│   ├── constants.js            # formatDate, timeAgo, roleBadge, cardStyles, getInitials
│   ├── navLinks.js             # Navigation items per role
│   └── svgPacket.js            # SVG icon map
├── App.jsx
├── App.css
├── main.jsx
└── index.css

---

## Screenshots

## Admin View
<img width="1710" height="986" alt="Login" src="https://github.com/user-attachments/assets/a311b96f-2f47-4e7e-ad88-6085c03d8bde" />
<img width="1710" height="951" alt="Screenshot 2026-02-24 at 8 47 48 PM" src="https://github.com/user-attachments/assets/a1ddb447-99d3-49d6-892b-7e429bfc8ebb" />
<img width="1710" height="952" alt="Admin:Users" src="https://github.com/user-attachments/assets/0bbac896-a63b-427d-b4c9-82ccb64ca9d4" />
<img width="1710" height="951" alt="Admin:Services" src="https://github.com/user-attachments/assets/8d3363c1-5de2-441b-8b0b-7e2583c0eea8" />
<img width="1710" height="953" alt="Admin:Requests" src="https://github.com/user-attachments/assets/d93fe433-d9db-4782-9075-11df440c1507" />
<img width="1710" height="952" alt="Admin:Requests:Approve" src="https://github.com/user-attachments/assets/081fe268-8855-4d45-8776-2b17bd17606a" />
<img width="1710" height="952" alt="image" src="https://github.com/user-attachments/assets/9c26bda4-b500-436a-8e8d-13a052b6a4c5" />
<img width="1710" height="951" alt="image" src="https://github.com/user-attachments/assets/7aff4c9c-da26-4ff1-b584-dbd859f77156" />
<img width="1710" height="952" alt="Admin:Projects:Assign" src="https://github.com/user-attachments/assets/c7595fa3-3616-47c4-9ffa-c1b84290c3b7" />
<img width="1710" height="952" alt="Admin:Profile" src="https://github.com/user-attachments/assets/0a083935-93f0-4352-acbb-690dfa273c6e" />
<img width="1710" height="950" alt="Admin:Messages History" src="https://github.com/user-attachments/assets/0a8615ab-2897-4b17-a129-17a903280106" />
---

## Employee  View
<img width="1710" height="983" alt="Employee:Projects:Update Status" src="https://github.com/user-attachments/assets/1b366ca5-8cfb-4fb7-a26f-89b7b08e1f0a" />
<img width="1710" height="983" alt="Employee:Messages" src="https://github.com/user-attachments/assets/dde7d5ac-2b41-4b7d-91ad-3de357a1a575" />
---

## Client View
<img width="1710" height="951" alt="Client:Service:Request" src="https://github.com/user-attachments/assets/f9f6652c-acc0-4b0b-9d9a-c9f3ad9f0841" />
<img width="1710" height="951" alt="Client:Requests" src="https://github.com/user-attachments/assets/cce6a4c1-fba9-4d43-8a81-c37c52c2ab85" />
<img width="1710" height="952" alt="image" src="https://github.com/user-attachments/assets/5a5d80d2-eace-45fb-a1bb-b18962d43334" />


---

## Deployment

This frontend is deployed on **Vercel**.

To deploy your own instance:

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the following environment variable in Vercel dashboard under **Settings → Environment Variables**:
   ```
   VITE_API_URL=<your_backend_url>
   ```

---

## Backend

The backend is a Node.js + Express + MongoDB REST API.

- Repo: [https://github.com/souvikghost/Souvik-Tech-Agency](https://github.com/souvikghost/Souvik-Tech-Agency)
- See the backend README for setup instructions, environment variables, and API documentation.
