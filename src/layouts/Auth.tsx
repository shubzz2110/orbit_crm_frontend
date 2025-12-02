import { Orbit } from "lucide-react";
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getDashboardRoute } from "@/lib/auth-utils";
import api from "@/services/axios";
import { AxiosError } from "axios";

export default function Auth() {
  const navigate = useNavigate();
  const { isAuthenticated, token, role } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (isAuthenticated && token) {
        // Verify token is still valid by making a simple API call
        try {
          // Try to get user profile or any protected endpoint to verify token
          // If endpoint doesn't exist (404), we'll assume token is valid if it exists
          await api.get("/accounts/profile/");
          // Token is valid, redirect to appropriate dashboard
          const dashboardRoute = getDashboardRoute(role);
          navigate(dashboardRoute, { replace: true });
          return;
        } catch (error) {
          // Token is invalid (401), clear auth and allow access to auth pages
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              useAuthStore.getState().clearAuth();
            } else if (error.response?.status === 404) {
              // Endpoint doesn't exist, but token exists - assume valid and redirect
              const dashboardRoute = getDashboardRoute(role);
              navigate(dashboardRoute, { replace: true });
              return;
            }
          }
        }
      }
      setIsChecking(false);
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, token, role, navigate]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full py-10 p-6">
        <div className="flex flex-col items-center justify-center z-10">
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full py-10 p-6">
      <div className="flex flex-col items-center justify-center z-10">
        <div className="max-w-md w-full flex flex-col gap-7">
          <div className="flex items-center gap-2.5">
            <Orbit className="h-12 w-12 text-primary relative" />
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              OrbitCRM
            </h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
