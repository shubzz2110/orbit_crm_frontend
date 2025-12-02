import { AdminSidebar } from "@/components/common/AdminSidebar";
import MemberSidebar from "@/components/common/MemberSidebar";
import { Navbar } from "@/components/common/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function CRMLayout({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles) {
    const userRoles = Array.isArray(role) 
      ? role.map(r => r.toLowerCase())
      : role 
        ? [role.toString().toLowerCase()]
        : [];
    
    const hasRequiredRole = allowedRoles.some(allowedRole =>
      userRoles.includes(allowedRole.toLowerCase())
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/403" replace />;
    }
  }
  
  // Determine which sidebar to show based on role
  const userRoles = Array.isArray(role)
    ? role.map(r => r.toLowerCase())
    : role
      ? [role.toString().toLowerCase()]
      : [];
  
  const isAdmin = userRoles.includes("admin");
  const isMember = userRoles.includes("member");
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {isAdmin && <AdminSidebar />}
        {isMember && !isAdmin && <MemberSidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 flex flex-col overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
