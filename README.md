# Orbit CRM Frontend

A modern, responsive Customer Relationship Management (CRM) frontend application built with React, TypeScript, and Vite. This frontend provides an intuitive user interface for managing contacts, leads, deals, tasks, and organizations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Components](#components)
- [Services](#services)
- [State Management](#state-management)
- [Authentication](#authentication)
- [Styling](#styling)
- [Development](#development)
- [Building for Production](#building-for-production)

## Features

- **Modern UI/UX**: Built with Radix UI components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode**: Theme switching with persistent preferences
- **Authentication**: JWT-based authentication with automatic token refresh
- **Role-Based Access Control**: Admin and Member roles with different views
- **Contact Management**: Full CRUD operations with filtering and search
- **Lead Management**: Track leads with activity history
- **Deal Pipeline**: Kanban board and list views for deal management
- **Task Management**: Create, assign, and track tasks with priorities
- **Dashboard Analytics**: Real-time statistics and charts
- **Notifications**: Real-time notification system with bell indicator
- **Form Validation**: Formik and Yup for robust form handling
- **Error Handling**: Comprehensive error pages and user feedback
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

### Core
- **React** 19.2.0 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 7.2.4 - Build tool and dev server

### UI & Styling
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Label, Popover, Radio Group, Separator, Tooltip
- **Lucide React** 0.554.0 - Icon library
- **next-themes** 0.4.6 - Theme management

### State Management & Data
- **Zustand** 5.0.8 - Lightweight state management
- **Axios** 1.13.2 - HTTP client
- **React Router** 7.9.6 - Client-side routing

### Forms & Validation
- **Formik** 2.4.9 - Form management
- **Yup** 1.7.1 - Schema validation

### Charts & Visualization
- **Recharts** 3.5.1 - Chart library

### Utilities
- **clsx** 2.1.1 - Conditional class names
- **class-variance-authority** 0.7.1 - Component variants
- **tailwind-merge** 3.4.0 - Merge Tailwind classes
- **sonner** 2.0.7 - Toast notifications

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Backend API** running (see backend README)

## Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd orbit_crm_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Configuration

### API Base URL

The API base URL is configured in `src/services/axios.ts`. By default, it points to:
```typescript
baseURL: "http://localhost:8000/api"
```

To change the API URL, update the `baseURL` in `src/services/axios.ts`:
```typescript
const api = axios.create({
  baseURL: "https://your-api-domain.com/api",
  // ...
});
```

### Environment Variables (Optional)

For different environments, you can create environment files:
- `.env.development` - Development environment
- `.env.production` - Production environment

Example `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Then update `axios.ts` to use:
```typescript
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
```

## Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

2. **Open your browser**:
   ```
   http://localhost:5173
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

5. **Run linter**:
   ```bash
   npm run lint
   ```

## Project Structure

```
orbit_crm_frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable components
│   │   ├── charts/       # Chart components
│   │   ├── common/       # Common components (Sidebar, Navbar, etc.)
│   │   ├── contacts/     # Contact-related components
│   │   ├── deals/        # Deal-related components
│   │   ├── leads/        # Lead-related components
│   │   ├── notifications/# Notification components
│   │   ├── tasks/        # Task-related components
│   │   └── ui/           # Base UI components (shadcn/ui)
│   ├── contexts/         # React contexts (Theme, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   │   ├── Auth.tsx      # Authentication layout
│   │   └── CRM.tsx       # Main CRM layout
│   ├── lib/              # Utilities and types
│   │   ├── types/        # TypeScript type definitions
│   │   ├── auth-utils.ts # Authentication utilities
│   │   ├── definations.ts# Common type definitions
│   │   └── utils.ts      # Utility functions
│   ├── routes/           # Page components
│   │   ├── admin/        # Admin-only pages
│   │   ├── auth/         # Authentication pages
│   │   ├── errors/       # Error pages
│   │   ├── member/       # Member pages
│   │   └── profile/      # Profile pages
│   ├── services/         # API service functions
│   ├── store/            # Zustand stores
│   ├── AppRoutes.tsx     # Route configuration
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── components.json       # shadcn/ui configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## Routing

The application uses React Router v7 for client-side routing. Routes are defined in `src/AppRoutes.tsx`.

### Public Routes
- `/auth/login` - Login page

### Protected Routes (Require Authentication)

#### Admin Routes (`/admin/*`)
- `/admin/dashboard` - Admin dashboard with analytics
- `/admin/organization` - Organization management
- `/admin/users` - User management
- `/admin/roles` - Role management
- `/admin/permissions` - Permission management
- `/admin/contacts` - Contact management
- `/admin/leads` - Lead management
- `/admin/tasks` - Task management
- `/admin/deals` - Deal management (Kanban & List views)
- `/admin/notifications` - Notifications center
- `/admin/profile` - User profile

#### Member Routes (`/member/*`)
- `/member/dashboard` - Member dashboard

#### Common Routes
- `/profile` - User profile (accessible to all authenticated users)

### Error Routes
- `/400` - Bad Request
- `/401` - Unauthorized
- `/403` - Forbidden
- `/404` - Not Found
- `/unauthorized` - Unauthorized access
- `/forbidden` - Forbidden access

## Components

### UI Components (`src/components/ui/`)
Base components built with Radix UI and styled with Tailwind CSS:
- `alert-dialog` - Modal dialogs for confirmations
- `avatar` - User avatars
- `badge` - Status badges
- `button` - Button variants
- `card` - Card containers
- `checkbox` - Checkbox inputs
- `dialog` - Modal dialogs
- `dropdown-menu` - Dropdown menus
- `input` - Text inputs
- `label` - Form labels
- `pagination` - Pagination controls
- `popover` - Popover menus
- `radio-group` - Radio button groups
- `separator` - Visual separators
- `sheet` - Side sheets
- `sidebar` - Sidebar navigation
- `skeleton` - Loading skeletons
- `sonner` - Toast notifications
- `tooltip` - Tooltips

### Feature Components

#### Contacts (`src/components/contacts/`)
- `ContactCard` - Contact card display
- `ContactForm` - Contact create/edit form
- `ContactListView` - Contact list with pagination
- `ContactFilters` - Filtering controls
- `ContactViewDialog` - Contact detail view
- `ContactDeleteDialog` - Delete confirmation
- `ContactBadges` - Status badges
- `ContactEmptyState` - Empty state display
- `ContactPagination` - Pagination component

#### Deals (`src/components/deals/`)
- `DealCard` - Deal card display
- `DealKanban` - Kanban board view
- `DealListView` - List view
- `DealForm` - Deal create/edit form
- `DealFilters` - Filtering controls
- `DealViewDialog` - Deal detail view
- `DealDeleteDialog` - Delete confirmation
- `DealBadges` - Status badges
- `DealEmptyState` - Empty state display
- `DealPagination` - Pagination component

#### Leads (`src/components/leads/`)
- Similar structure to contacts with lead-specific components
- `LeadActivities` - Activity timeline component

#### Tasks (`src/components/tasks/`)
- Similar structure with task-specific components

#### Notifications (`src/components/notifications/`)
- `NotificationBell` - Notification bell with badge
- `NotificationItem` - Individual notification item

#### Common (`src/components/common/`)
- `AdminSidebar` - Admin navigation sidebar
- `MemberSidebar` - Member navigation sidebar
- `Navbar` - Top navigation bar
- `NavLink` - Navigation link component
- `ThemeToggle` - Dark/light mode toggle

## Services

API service functions are organized by feature in `src/services/`:

- `axios.ts` - Axios instance with interceptors for authentication
- `contactService.ts` - Contact CRUD operations
- `dealService.ts` - Deal CRUD operations
- `leadService.ts` - Lead CRUD operations
- `taskService.ts` - Task CRUD operations
- `userService.ts` - User management
- `organizationService.ts` - Organization management
- `roleService.ts` - Role management
- `permissionService.ts` - Permission management
- `notificationService.ts` - Notification operations
- `dashboardService.ts` - Dashboard statistics

Each service follows a consistent pattern:
```typescript
export const contactService = {
  getAll: async (params?) => { /* ... */ },
  getById: async (id) => { /* ... */ },
  create: async (data) => { /* ... */ },
  update: async (id, data) => { /* ... */ },
  delete: async (id) => { /* ... */ },
  // Feature-specific methods
};
```

## State Management

The application uses **Zustand** for state management.

### Auth Store (`src/store/authStore.ts`)
Manages authentication state:
- `user` - Current user object
- `token` - JWT access token
- `role` - User role(s)
- `isAuthenticated` - Authentication status
- `setAuth()` - Set authentication data
- `setUser()` - Update user
- `setToken()` - Update token
- `setRole()` - Update role
- `clearAuth()` - Clear authentication

The store is persisted to localStorage for session persistence.

### Usage Example
```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user?.email}</div>;
}
```

## Authentication

### Authentication Flow

1. **Login**: User submits credentials via `/auth/login`
2. **Token Storage**: Access token stored in Zustand store (persisted to localStorage)
3. **Token Injection**: Axios interceptor adds token to all requests
4. **Token Refresh**: On 401 response, automatically refresh token
5. **Logout**: Clear tokens and redirect to login

### Axios Interceptors

The axios instance (`src/services/axios.ts`) includes:

**Request Interceptor**:
- Automatically attaches JWT token to Authorization header

**Response Interceptor**:
- Handles 401 errors by attempting token refresh
- Queues failed requests during token refresh
- Redirects to login on refresh failure

### Protected Routes

Routes are protected by the `CRMLayout` component which:
- Checks authentication status
- Validates user roles
- Redirects unauthenticated users to login
- Shows appropriate sidebar based on role

## Styling

### Tailwind CSS
The project uses Tailwind CSS 4.x with a custom configuration. Utility classes are used throughout for styling.

### Theme System
- **Dark Mode**: Implemented using `next-themes`
- **Theme Toggle**: Available in the navbar
- **Persistent**: Theme preference saved to localStorage

### Component Variants
Uses `class-variance-authority` for component variants:
```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        default: "...",
        sm: "...",
      },
    },
  }
);
```

## Development

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Prefer named exports
- Use TypeScript interfaces for props and data structures

### Adding New Components

1. **Create component file**:
   ```typescript
   // src/components/my-feature/MyComponent.tsx
   import { FC } from 'react';
   
   interface MyComponentProps {
     // props
   }
   
   export const MyComponent: FC<MyComponentProps> = ({ ... }) => {
     return <div>...</div>;
   };
   ```

2. **Export from index** (if applicable):
   ```typescript
   // src/components/my-feature/index.ts
   export { MyComponent } from './MyComponent';
   ```

### Adding New Routes

1. **Create page component** in `src/routes/`
2. **Add route** in `src/AppRoutes.tsx`:
   ```typescript
   {
     path: "my-route",
     element: <MyPage />,
   }
   ```

### Adding New Services

1. **Create service file** in `src/services/`:
   ```typescript
   import api from './axios';
   
   export const myService = {
     getAll: async () => {
       const response = await api.get('/my-endpoint/');
       return response.data;
     },
     // ... other methods
   };
   ```

### Type Definitions

Type definitions are organized in `src/lib/types/`:
- `contact.ts` - Contact types
- `deal.ts` - Deal types
- `lead.ts` - Lead types
- `task.ts` - Task types
- `user.ts` - User types
- `organization.ts` - Organization types
- `role.ts` - Role types
- `notification.ts` - Notification types

## Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Output**: The build output will be in the `dist/` directory

3. **Preview production build**:
   ```bash
   npm run preview
   ```

4. **Deploy**: Deploy the `dist/` directory to your hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

### Environment-Specific Builds

For different environments, you can use environment variables:
```bash
# Development
npm run dev

# Production
VITE_API_BASE_URL=https://api.production.com/api npm run build
```

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS settings allow your frontend origin
   - Check `CORS_ALLOWED_ORIGINS` in backend settings

2. **Authentication Issues**:
   - Verify token is being stored correctly
   - Check axios interceptor configuration
   - Ensure backend JWT settings match

3. **Build Errors**:
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf node_modules/.vite`

4. **Type Errors**:
   - Run `npm run lint` to check for issues
   - Ensure all types are properly imported

## License

This project is part of the Orbit CRM system.

## Support

For issues and questions, please contact the development team.
