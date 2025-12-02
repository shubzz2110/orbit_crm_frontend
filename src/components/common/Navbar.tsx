import { Search, User, LogOut, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ThemeToggle } from "./ThemeToggle";
import { userService } from "@/services/userService";
import type { User as UserType } from "@/lib/types/user";
import { NotificationBell } from "@/components/notifications";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [user, setUser] = useState<UserType | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await userService.getProfile();
        setUser(userData);
      } catch (error) {
        // Silently fail - profile picture is optional
      }
    };
    fetchProfile();
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Upload the file
    try {
      setUploadingPicture(true);
      const updatedUser = await userService.uploadProfilePicture(file);
      setUser(updatedUser);
      toast.success("Profile picture updated", {
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?:
            | {
                message?: string;
                error?: string;
                detail?: string;
                profile_picture?: string[];
              }
            | string;
        };
        message?: string;
      };

      let errorMessage = "Failed to upload profile picture";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else {
          errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            err.response.data.detail ||
            (Array.isArray(err.response.data.profile_picture)
              ? err.response.data.profile_picture[0]
              : null) ||
            errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error("Upload failed", {
        description: errorMessage,
      });
    } finally {
      setUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await api.post("/accounts/logout/");
      
      // Clear authentication state
      clearAuth();
      
      // Show success message
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
      });
      
      // Redirect to login page
      navigate("/auth/login", { replace: true });
    } catch (error) {
      // Even if API call fails, clear local auth and redirect
      clearAuth();
      
      if (error instanceof AxiosError) {
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Logout completed";
        
        toast.info("Logged out", {
          description: errorMessage,
        });
      } else {
        toast.info("Logged out", {
          description: "You have been logged out.",
        });
      }
      
      // Always redirect to login page
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1 rounded-full" />

          <div className="relative w-64 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts, leads, companies..."
              className="pl-10 bg-muted/50 border-border/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-10 w-10 ring-2 ring-border hover:ring-primary/50 transition-all cursor-pointer">
                  {user?.profile_picture ? (
                    <AvatarImage src={user.profile_picture} alt={user.full_name || "User"} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {uploadingPicture ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploadingPicture}
              />
              <DropdownMenuItem 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPicture}
                className="cursor-pointer"
              >
                <Camera className="h-4 w-4 mr-2" />
                {uploadingPicture ? "Uploading..." : "Change Profile Picture"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
