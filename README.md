# Project Management System

This is a simple and efficient project management solution designed to help administrators manage projects, create structured work modules, assign team leaders, and add team members. The system focuses on clarity and ease of use while avoiding unnecessary complexity.

## Features

- **Project Creation** — Admins can create projects with descriptions.
- **Work Module Management** — Divide projects into work modules like sales or design.
- **Section-Based Organization** — Each module is divided into sections.
- **Team Leader Assignment** — Assign leaders to each section.
- **Team Member Management** — Add members to specific sections.
- **Single User Registration Form** — Simple registration with roles based access control.
- **Simplified Interface** — Clean and user-friendly UI.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (Latest LTS recommended)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository or open the project in VS Code

   ```bash
   git clone https://github.com/fahad114433/FYP-PMS.git
   cd project-management-system
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Install frontend dependencies

   ```bash
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the backend directory and configure:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   ```

5. Run the application
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License.
