# Project Management API

A comprehensive Node.js REST API for project and task management with user authentication, email verification, and role-based access control.

## Features

- **User Authentication & Authorization**

  - User registration with email verification
  - Login/logout functionality
  - JWT-based authentication (access & refresh tokens)
  - Password reset via email
  - Role-based access control (Admin, Project Admin, Member)

- **Project Management**

  - Create, read, update, delete projects
  - Project member management
  - Role assignment for project members

- **Task Management**

  - Create and manage tasks within projects
  - Task assignment to users
  - Task status tracking (Todo, In Progress, Done)
  - Subtask management
  - File attachments support

- **Notes System**

  - Project-specific notes
  - Create, read, update, delete notes

- **Email Services**
  - Email verification for new accounts
  - Password reset emails
  - Professional email templates using Mailgen

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with Mailtrap
- **Validation**: Express Validator
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── auth.controllers.js
│   ├── project.controllers.js
│   ├── task.controllers.js
│   ├── note.controllers.js
│   └── healthcheck.controllers.js
├── models/              # Database schemas
│   ├── user.models.js
│   ├── project.models.js
│   ├── task.models.js
│   ├── subtask.models.js
│   ├── note.models.js
│   └── projectmember.models.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── project.routes.js
│   ├── task.routes.js
│   ├── note.routes.js
│   └── healthcheck.routes.js
├── middlewares/         # Custom middleware
│   ├── multer.middleware.js
│   └── validator.middleware.js
├── utils/               # Utility functions
│   ├── api-error.js
│   ├── api-response.js
│   ├── async-handler.js
│   ├── constants.js
│   └── mail.js
├── validators/          # Input validation rules
│   └── index.js
├── db/                  # Database configuration
│   └── index.js
├── app.js              # Express app setup
└── index.js            # Server entry point
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-management-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=8000
   BASE_URL=http://localhost:8000

   # Database
   MONGO_URI=mongodb://localhost:27017/project-management

   # JWT Secrets
   ACCESS_TOKEN_SECRET=your-access-token-secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   REFRESH_TOKEN_EXPIRY=7d

   # Mailtrap Configuration (for email testing)
   MAILTRAP_HOST=smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USERNAME=your-mailtrap-username
   MAILTRAP_PASSWORD=your-mailtrap-password
   MAILTRAP_SENDEREMAIL=noreply@yourapp.com
   ```

4. **Create required directories**

   ```bash
   mkdir -p public/images
   ```

5. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/v1/users`)

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| POST   | `/register`            | Register a new user       |
| POST   | `/login`               | Login user                |
| POST   | `/logout`              | Logout user               |
| GET    | `/me`                  | Get current user          |
| POST   | `/change-password`     | Change user password      |
| POST   | `/refresh-token`       | Refresh access token      |
| POST   | `/forgot-password`     | Request password reset    |
| POST   | `/reset-password`      | Reset password with token |
| POST   | `/verify-email`        | Verify email with token   |
| POST   | `/resend-verification` | Resend email verification |

### Project Routes (`/api/v1/projects`)

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| POST   | `/`                             | Create new project    |
| GET    | `/`                             | Get all projects      |
| GET    | `/:projectId`                   | Get project by ID     |
| PUT    | `/:projectId`                   | Update project        |
| DELETE | `/:projectId`                   | Delete project        |
| POST   | `/:projectId/members`           | Add member to project |
| GET    | `/:projectId/members`           | Get project members   |
| PUT    | `/:projectId/members/:memberId` | Update member role    |
| DELETE | `/:projectId/members/:memberId` | Remove member         |

### Task Routes (`/api/v1/tasks`)

| Method | Endpoint                       | Description     |
| ------ | ------------------------------ | --------------- |
| POST   | `/`                            | Create new task |
| GET    | `/`                            | Get all tasks   |
| GET    | `/:taskId`                     | Get task by ID  |
| PUT    | `/:taskId`                     | Update task     |
| DELETE | `/:taskId`                     | Delete task     |
| POST   | `/:taskId/subtasks`            | Create subtask  |
| PUT    | `/:taskId/subtasks/:subtaskId` | Update subtask  |
| DELETE | `/:taskId/subtasks/:subtaskId` | Delete subtask  |

### Health Check (`/api/v1/healthcheck`)

| Method | Endpoint | Description         |
| ------ | -------- | ------------------- |
| GET    | `/`      | Check server health |

## User Roles

- **Admin**: Full system access
- **Project Admin**: Manage specific projects and their members
- **Member**: Basic project access

## Task Statuses

- **Todo**: Task not started
- **In Progress**: Task being worked on
- **Done**: Task completed

## Request/Response Examples

### User Registration

```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "member"
}
```

### User Login

```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Create Project

```bash
POST /api/v1/projects
Content-Type: application/json
Authorization: Bearer <access-token>

{
  "name": "My New Project",
  "description": "Project description",
  "createdBy": "user-id"
}
```

### Create Task

```bash
POST /api/v1/tasks
Content-Type: application/json
Authorization: Bearer <access-token>

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication",
  "project": "project-id",
  "assignedTo": "user-id",
  "assignedBy": "user-id",
  "status": "todo"
}
```

## Error Handling

The API uses a custom error handling system with consistent error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": []
}
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for refresh tokens
- Input validation and sanitization
- Protected routes with middleware
- Email verification for account activation

## File Upload

The API supports file uploads for task attachments using Multer middleware. Files are stored in the `public/images` directory with timestamp prefixes.

## Email Services

- Uses Nodemailer with Mailtrap for development
- Professional email templates with Mailgen
- Email verification for new accounts
- Password reset functionality

## Development

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Mailtrap account (for email testing)

### Running in Development Mode

```bash
npm run dev
```

### Environment Variables

Make sure to set all required environment variables in your `.env` file before running the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the repository or contact the development team.
