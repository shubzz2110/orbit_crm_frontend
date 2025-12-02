import { createBrowserRouter, Navigate } from "react-router";
import Auth from "./layouts/Auth";
import CRMLayout from "./layouts/CRM";
import Dashboard from "./routes/admin/dashboard/Dashboard";
import Organization from "./routes/admin/organization/Organization";
import Users from "./routes/admin/users/Users";
import Roles from "./routes/admin/roles/Roles";
import Permissions from "./routes/admin/permissions/Permissions";
import Contacts from "./routes/admin/contacts/Contacts";
import Leads from "./routes/admin/leads/Leads";
import Tasks from "./routes/admin/tasks/Tasks";
import Deals from "./routes/admin/deals/Deals";
import Notifications from "./routes/admin/notifications/Notifications";
import MemberDashboard from "./routes/member/dashboard/Dashboard";
import Profile from "./routes/profile/Profile";
import NotFound from "./routes/errors/NotFound";
import Unauthorized from "./routes/errors/Unauthorized";
import Forbidden from "./routes/errors/Forbidden";
import BadRequest from "./routes/errors/BadRequest";
import ErrorPage from "./routes/errors/ErrorPage";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />
  },
  {
    path: "auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        lazy: () => import("./routes/auth/Login").then((module) => ({ element: <module.default /> })),
      },
    ]
  },
  {
    path: "",
    element: <CRMLayout />,
    children: [
      {
        path: "admin",
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "organization",
            element: <Organization />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "roles",
            element: <Roles />,
          },
          {
            path: "permissions",
            element: <Permissions />,
          },
          {
            path: "contacts",
            element: <Contacts />,
          },
          {
            path: "leads",
            element: <Leads />,
          },
          {
            path: "tasks",
            element: <Tasks />,
          },
          {
            path: "deals",
            element: <Deals />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "member",
        children: [
          {
            path: "dashboard",
            element: <MemberDashboard />,
          },
        ],
      },
      {
        path: "profile",
        element: <Profile />,
      },
      // Error pages
      {
        path: "400",
        element: <BadRequest />,
      },
      {
        path: "401",
        element: <Unauthorized />,
      },
      {
        path: "403",
        element: <Forbidden />,
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "forbidden",
        element: <Forbidden />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
    errorElement: <ErrorPage />,
  }
])

export default AppRoutes;