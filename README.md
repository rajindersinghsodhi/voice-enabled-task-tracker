# Voice Enabled Task Tracker - Frontend

A voice enabled task tracker application built with Next.js, React, and shadcn/ui components. This frontend connects to a Node.js backend API to provide a complete task management solution.

## Features

- Create, read, update, and delete tasks
- voice enabled inputs, user can ask and ai will generate the task information for it
- user can move tasks between the boards to change status from ToDo to Done
- Search tasks by title
- Filter tasks by status, priority, and due date
- Modern UI with Tailwind CSS and shadcn/ui
- Responsive design

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Backend API** running (see backend repository README for setup instructions)

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd <frontend-folder-name>
   ```

2. **I have made it simple for you by not keeping url in .env** 

## Installation

Install all project dependencies:

```bash
npm install
```

## Running the Project

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

## Important Notes

1. **Backend Dependency**: This frontend requires the backend API to be running. Make sure your backend is set up and running before using this application.

3. **Port Conflicts**: If port 3000 is already in use, Next.js will automatically suggest the next available port, but make sure to change the port in backend to prevent **CORS** error.

## Technologies Used

- **Next.js**
- **React**
- **TypeScript** - for Type safety
- **Tailwind CSS** - for styling
- **shadcn/ui** - to integrate prebuilt UI components
- **Lucide React** - Icons
