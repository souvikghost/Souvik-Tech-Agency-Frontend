# Souvik Tech Agency — Frontend

> A role-based software company management portal for managing employees, clients, services, projects, and internal messaging.

🔗 **Live Demo:** [https://souviktechagency.vercel.app](https://souviktechagency.vercel.app)  
🔗 **Backend Repo:** [https://github.com/souvikghost/Souvik-Tech-Agency](https://github.com/souvikghost/Souvik-Tech-Agency)

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

### Shared
- Polling-based messaging (no WebSocket required)
- Avatar upload via Cloudinary with face-crop transformation
- Soft delete — deleted users shown with label in records, excluded from messaging
- Protected routes — unauthenticated users redirected to login, wrong role redirected to own portal
- Demo Login button on login page for quick access

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

```
src/
├── api/                        # API call functions per feature
│   ├── auth.js                 # login, logout, getMe
│   ├── user.js                 # getEmployees, getClients, createUser, deleteUser
│   ├── services.js             # getServices, createService, deleteService
│   ├── requests.js             # getRequests, approveRequest, rejectRequest
│   ├── projects.js             # getProjects, updateStatus, assignEmployees
│   ├── messages.js             # getConversations, getThread, sendMessage, deleteConversation
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
```

---

## Screenshots

> Add screenshots here after deployment. Drag and drop images directly into this file on GitHub to upload them automatically.

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
4. Deploy — Vercel auto-builds on every push to main

---

## Backend

The backend is a Node.js + Express + MongoDB REST API.

- Repo: [https://github.com/souvikghost/Souvik-Tech-Agency](https://github.com/souvikghost/Souvik-Tech-Agency)
- See the backend README for setup instructions, environment variables, and API documentation.