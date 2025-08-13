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

## Features

*   **User Registration**:
    *   Two-step registration process for patients.
    *   Initial registration collects name, email, phone number (with validation), and password.
    *   Second step allows users to input medical information (date of birth, blood type, allergies, medical history) or skip for later.
    *   Loading state for the registration button.
*   **User Authentication**:
    *   Login functionality with email and password.
    *   Integration with `AuthContext` for global user state management.
    *   Stores user token and data in `localStorage` for persistent sessions.
*   **Routing**:
    *   Protected routes for authenticated users (e.g., dashboard).
    *   Separate routes for admin and provider dashboards.
*   **Responsive Design**: Built with Tailwind CSS for a mobile-first approach.
*   **Error Handling**: Displays messages for registration and login failures.

## Project Structure

```
medibook-frontend/
├── public/
│   └── MediBook.png
├── src/
│   ├── Admin/
│   │   ├── Providers/
│   │   └── ... (Admin and Provider related components)
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
│   │       └── ... (Patient dashboard components)
│   ├── services/
│   │   ├── api.ts
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

## API Documentation

This frontend interacts with the MediBook Backend API. You can find the full API documentation here:

[https://medibook-backend-s172.onrender.com/api-docs/](https://medibook-backend-s172.onrender.com/api-docs/)

## Contributing

Contribution guidelines will be added later.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
