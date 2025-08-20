# MediBook Frontend

This is the frontend application for MediBook, a healthcare application designed to manage patient registration and appointment scheduling. It provides a user-friendly interface for patients to register, log in, manage their profiles, and potentially schedule appointments.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **Vite**: A fast frontend build tool that provides a quick development experience.
*   **TypeScript**: A superset of JavaScript that adds static typing.
*   **React Router DOM**: For declarative routing in React applications.
*   **Axios**: A promise-based HTTP client for making API requests.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Lucide React**: A collection of beautiful open-source icons.
*   **React Toastify**: For displaying toast notifications.

## Features

*   **User Registration**:
    *   Two-step registration process for patients.
    *   Initial registration collects name, email, phone number (with validation), and password.
    *   Second step allows users to input medical information (date of birth, blood type, allergies, medical history) or skip for later.
    *   Loading state for the registration button.
*   **User Authentication**:
    *   Login functionality with email and password.
    *   Integration with `AuthContext` for global user state management, storing user token and data in `localStorage`.
    *   **Admin Login**: Dedicated admin login page (`/admin/login`) with role-based access control.
    *   **Provider Login**: Dedicated provider login page (`/provider/login`) with role-based access control; direct registration is disabled, and a message advises contacting support.
*   **Admin Dashboard Features**:
    *   **Create Provider Account**: A new page (`/admin/dashboard/create-provider`) allows administrators to register new provider accounts with comprehensive details.
    *   **User Management**: View, delete, and update roles for all users via the `/admin/users` endpoint. Displays user details including name, email, and role.
    *   **Audit Logs**: Retrieve and filter system audit logs via the `/admin/audit-logs` endpoint. Supports filtering by user ID and action type (using a dropdown of predefined actions).
*   **Patient Profile Management**:
    *   Patients can view and edit their profile information, including personal details, address, and medical information.
    *   Date of birth field is formatted correctly for display and input.
*   **Routing**:
    *   Protected routes for authenticated users (e.g., dashboard).
    *   Separate routes for admin and provider dashboards.
*   **Responsive Design**: Built with Tailwind CSS for a mobile-first approach.
*   **Error Handling & Notifications**: Displays messages for various operations using `react-toastify`.

## Project Structure

```
medibook-frontend/
├── public/
│   └── MediBook.png
├── src/
│   ├── Admin/
│   │   ├── AuditLogs.tsx
│   │   ├── CreateProvider.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── UserManagement.tsx
│   │   └── Providers/
│   │       ├── Dashboard.tsx
│   │       ├── Login.tsx
│   │       ├── ManageSchedule.tsx
│   │       ├── UpdateAvailability.tsx
│   │       └── ViewAppointments.tsx
│   ├── assets/
│   ├── components/
│   │   └── D3Message.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Register.tsx
│   │   ├── RegisterMedicalInfo.tsx
│   │   └── patientdashboard/
│   │       ├── Appointments.tsx
│   │       ├── Dashboard.tsx
│   │       ├── History.tsx
│   │       └── Profile.tsx
│   ├── services/
│   │   ├── Adminapi.ts
│   │   ├── api.ts
│   │   ├── Appointmentapi.ts
│   │   ├── Audit-logsapi.ts
│   │   ├── Authapi.ts
│   │   └── Userapi.ts
│   ├── utils/
│   │   └── formatDate.ts
│   ├── App.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

*   Node.js (v14 or higher)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BenjaminAJ/MediBook-Frontend.git
    cd medibook-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory based on `.env.example`.
    ```
    VITE_API_BASE_URL=https://medibook-backend-s172.onrender.com/api
    ```
    Replace the URL with your backend API base URL.

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Deployment

This application is deployed on Vercel and can be accessed at:

[https://medibook-psi.vercel.app/](https://medibook-psi.vercel.app/)

## API Documentation

This frontend interacts with the MediBook Backend API. You can find the full API documentation here:

[https://medibook-backend-s172.onrender.com/api-docs/](https://medibook-backend-s172.onrender.com/api-docs/)

## Contributing

Contribution guidelines will be added later.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
