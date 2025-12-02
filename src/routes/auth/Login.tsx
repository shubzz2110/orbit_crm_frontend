import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import type { LoginResponse } from "@/lib/definations";
import api from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getDashboardRoute } from "@/lib/auth-utils";

// ✅ Validation schema
const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
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
          // Token is invalid (401), clear auth and allow login
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

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        const response = await api.post<LoginResponse>("/accounts/login/", values);
        
        if (response.status === 200 && response.data) {
          const { user, access_token, message } = response.data;
          
          // Extract role from user.role - handle different formats
          let role: string[] | string | null = null;
          
          if (user.role) {
            if (Array.isArray(user.role)) {
              if (user.role.length > 0) {
                // Check if it's an array of objects with 'name' property
                if (typeof user.role[0] === 'object' && user.role[0] !== null && 'name' in user.role[0]) {
                  role = user.role.map((r: { name: string }) => r.name);
                } else if (typeof user.role[0] === 'string') {
                  // It's already an array of strings
                  role = user.role as string[];
                }
              }
            } else if (typeof user.role === 'string') {
              // Single role as string
              role = user.role;
            }
          }
          
          // Validate role before proceeding
          if (!role || (Array.isArray(role) && role.length === 0)) {
            toast.error("Login failed", {
              description: "User role not found. Please contact administrator.",
            });
            return;
          }
          
          // Set authentication state
          useAuthStore.getState().setAuth(user, access_token, role);
          
          // Show success message
          toast.success(message || "Login successful", {
            description: `Welcome back, ${user.full_name || user.email}!`,
          });
          
          // Navigate to appropriate dashboard based on role
          const dashboardRoute = getDashboardRoute(role);
          navigate(dashboardRoute, { replace: true });
        }
      } catch (error) {
        // Handle error response
        if (error instanceof AxiosError) {
          const errorMessage = 
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.response?.data?.detail ||
            (typeof error.response?.data === 'string' ? error.response.data : null) ||
            error.message ||
            "Login failed. Please try again.";
          
          // Show error toast
          toast.error("Login failed", {
            description: errorMessage,
          });
        } else {
          // Handle non-axios errors
          toast.error("Login failed", {
            description: "An unexpected error occurred. Please try again.",
          });
        }
      }
    },
  });

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex flex-col w-full h-full gap-10 items-center justify-center">
        <p className="text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-10">
      <div className="flex flex-col gap-2.5">
        <h1 className="text-white font-bold text-2xl">Welcome back</h1>
        <p className="text-gray-400 font-normal text-sm leading-4">
          Sign in to account to continue
        </p>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-5 w-full"
        noValidate
      >
        {/* Email */}
        <div className="flex flex-col w-full gap-2.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            name="email"
            placeholder="youremail@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            }
            autoComplete="email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-error">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col w-full gap-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : ""
            }
            autoComplete="new-password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-error">{formik.errors.password}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="mt-2.5 w-full">
          <Button
            size="lg"
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full cursor-pointer"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>

        {/* Legal links */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}
