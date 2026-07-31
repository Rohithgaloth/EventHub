# EventHub

EventHub is a comprehensive, full-stack event management platform designed to streamline the creation, discovery, and registration of events. Built with modern web technologies, it provides a seamless experience for both event organizers and attendees.

## Architecture

The application is structured as a monorepo containing both the frontend client and the backend server.

- **Frontend**: A React single-page application powered by Vite.
- **Backend**: A Node.js API server built with Express and MongoDB.

## Features

- **User Authentication**: Secure signup and login mechanisms using JSON Web Tokens (JWT).
- **Event Management**: Organizers can create, edit, and manage their events.
- **Event Discovery**: Users can browse and search for upcoming events.
- **Registration & Ticketing**: Integrated event registration system.
- **Payments Integration**: Secure payment processing handled via Stripe.
- **File Uploads**: Support for uploading event images and media using Multer.
- **User Dashboard**: Dedicated dashboard for users to manage their registrations and created events.

## Technology Stack

### Frontend
- **React 19**: UI Library
- **Vite**: Build tool and development server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests
- **Framer Motion**: Animation library
- **Lucide React**: Iconography
- **ESLint**: Code linting and formatting

### Backend
- **Node.js & Express**: API framework
- **MongoDB & Mongoose**: Database and ODM
- **JSON Web Token (JWT)**: Authentication
- **BcryptJS**: Password hashing
- **Stripe**: Payment gateway
- **Multer**: File uploading
- **Express Validator**: Request validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm package manager
- MongoDB instance (or rely on the included in-memory server for development)
- Stripe account (for payment integration)

### Installation

1. Clone the repository.
2. Install dependencies for both the frontend and backend using pnpm.

```bash
# Install frontend dependencies (from the root directory)
pnpm install

# Install backend dependencies
cd server
pnpm install
```

### Environment Configuration

Configure the environment variables required for the backend server.

1. Navigate to the `server` directory.
2. Copy the `.env.example` file to `.env`.
3. Fill in the necessary values (e.g., MongoDB URI, JWT Secret, Stripe API keys).

### Running the Application

You will need to start both the frontend and backend development servers.

**Start the Backend Server**
```bash
cd server
pnpm run dev
```

**Start the Frontend Server**
```bash
# From the project root
pnpm run dev
```

The frontend application will typically be available at `http://localhost:5173`, and the API server will be running on the port specified in your `.env` file.

## Development Scripts

### Root (Frontend)
- `pnpm run dev`: Starts the Vite development server.
- `pnpm run build`: Builds the React application for production.
- `pnpm run preview`: Previews the production build locally.
- `pnpm run lint`: Runs ESLint to check for code quality issues.

### Server (Backend)
- `pnpm run start`: Starts the production server.
- `pnpm run dev`: Starts the development server with file watching.

## License

This project is proprietary and confidential.
