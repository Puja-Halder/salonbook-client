# SalonBook

SalonBook is a salon appointment booking platform where customers can explore beauty services, view service details, request appointments, and manage their bookings. Administrators can manage salon services, handle appointment requests, manage customers, and monitor payment transactions.

## Features

### Customer Features
- Browse and explore salon services.
- Search and filter services by category.
- View service details, pricing, and duration.
- Create appointment requests.
- View appointment status and history.
- Cancel pending appointments.
- Complete payment for confirmed appointments.
- Manage profile information and profile image.
- Sign in using email/password or Google.
- View salon information and details.

### Admin Features
- Admin dashboard.
- Add, update, deactivate, reactivate, and delete services.
- Upload service images.
- View and manage appointment requests.
- Confirm or cancel appointments.
- Manage registered customers.
- Block customers when necessary.
- View payment transactions.

### General Features
- Role-based authentication and authorization.
- Responsive design for desktop and mobile.
- Dynamic service categories.
- Featured salon services.
- User-friendly notifications.
- Protected customer and admin pages.

## Technology Stack

**Frontend**
- Next.js
- React
- JavaScript
- Tailwind CSS
- Better Auth
- Lucide React
- React Hot Toast

**Backend**
- Node.js
- Express.js
- MongoDB
- Better Auth

**Other Services**
- ImgBB for image hosting
- Google OAuth for social authentication

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB database
- Git

### 1. Clone the repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
cd salonbook-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and configure the required environment variables.

Do not publish your secret keys or database credentials.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Setup

The backend is maintained in a separate repository.

Clone the server repository, install its dependencies, configure its environment variables, and start the Express server according to its README instructions.

## Project Repositories

- **Client Repository:** Add your GitHub client repository URL.
- **Server Repository:** Add your GitHub server repository URL.

## Live Demo

Coming soon.

## Notes

This project is developed as a full-stack salon appointment booking application.