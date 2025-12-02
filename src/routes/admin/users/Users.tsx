import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  UserPlus,
  Search,
  Mail,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  MoreVertical,
  UserCog,
} from "lucide-react";
import { userService } from "@/services/userService";
import type { RoleUser } from "@/services/userService";
import { roleService } from "@/services/roleService";
import type { User, UserFormData } from "@/lib/types/user";
import type { Role } from "@/lib/types/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const userSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  full_name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),
  timezone: Yup.string().max(50, "Timezone must be less than 50 characters"),
  language: Yup.string().max(10, "Language must be less than 10 characters"),
  is_active: Yup.boolean(),
});

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<RoleUser[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("none");
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik<UserFormData>({
    initialValues: {
      email: "",
      full_name: "",
      timezone: "UTC",
      language: "en",
      is_active: true,
      role: "member", // Default role
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        await userService.create(values);
        toast.success("User created successfully", {
          description: `User ${values.email} has been created with default password: TestPassword@123`,
        });
        setIsDialogOpen(false);
        formik.resetForm();
        fetchUsers();
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?:
              | { message?: string; error?: string; detail?: string; email?: string[] }
              | string;
          };
          message?: string;
        };

        let errorMessage = "Failed to create user";

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else {
            errorMessage =
              err.response.data.message ||
              err.response.data.error ||
              err.response.data.detail ||
              (Array.isArray(err.response.data.email)
                ? err.response.data.email[0]
                : null) ||
              errorMessage;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        ordering: "-created_at",
      };
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await userService.getAll(params);
      
      // Handle different response formats
      let usersList: User[] = [];
      
      if (Array.isArray(response)) {
        // Response is directly an array
        usersList = response;
      } else if (response && typeof response === 'object') {
        // Check for common pagination formats
        if ('results' in response && Array.isArray(response.results)) {
          usersList = response.results;
        } else if ('data' in response && Array.isArray(response.data)) {
          usersList = response.data;
        } else if ('items' in response && Array.isArray(response.items)) {
          usersList = response.items;
        } else {
          usersList = [];
        }
      } else {
        usersList = [];
      }
      
      setUsers(usersList);
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      const err = error as { 
        message?: string;
        response?: {
          data?: {
            message?: string;
            error?: string;
            detail?: string;
          } | string;
          status?: number;
        };
      };
      
      let errorMessage = "An error occurred while fetching users";
      
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (typeof err.response.data === "object") {
          errorMessage = err.response.data.message || 
                        err.response.data.error || 
                        err.response.data.detail || 
                        errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error("Failed to load users", {
        description: errorMessage,
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Sync selectedRoleId when userRoles changes
  useEffect(() => {
    if (userRoles && userRoles.length > 0) {
      const firstRole = userRoles[0];
      let roleId: string | null = null;
      
      // Handle different API response structures
      if (typeof firstRole?.role === 'number') {
        roleId = firstRole.role.toString();
      } else if (firstRole?.role?.id) {
        roleId = firstRole.role.id.toString();
      }
      
      if (roleId && selectedRoleId !== roleId) {
        setSelectedRoleId(roleId);
      }
    } else if (userRoles && userRoles.length === 0 && selectedRoleId !== "none") {
      setSelectedRoleId("none");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRoles]);

  const fetchRoles = async () => {
    try {
      const response = await roleService.getAll({ ordering: "name" });
      let rolesList: Role[] = [];
      if (Array.isArray(response)) {
        rolesList = response;
      } else if (response && typeof response === 'object') {
        if ('results' in response && Array.isArray(response.results)) {
          rolesList = response.results;
        }
      }
      setRoles(rolesList);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  };

  const handleCreate = () => {
    formik.resetForm();
    fetchRoles();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    formik.resetForm();
  };

  const handleAssignRoles = async (user: User) => {
    setSelectedUser(user);
    try {
      const roles = await userService.getUserRoles(user.id);
      setUserRoles(roles);
      
      // Set the selected role ID based on current user roles
      let currentRoleId: string = "none";
      
      // Handle API response structure: role can be a number (ID) or an object
      if (roles && roles.length > 0) {
        const firstRole = roles[0];
        // Check if role is a number (direct ID)
        if (typeof firstRole?.role === 'number') {
          currentRoleId = firstRole.role.toString();
        } 
        // Check if role is an object with id property
        else if (firstRole?.role?.id) {
          currentRoleId = firstRole.role.id.toString();
        }
        // Fallback: check if there's a direct id field
        else if (firstRole?.id && typeof firstRole.id === 'number') {
          // This might be the role_user ID, not the role ID, so skip it
        }
      }
      
      // Fallback: try to get from user object's role field
      if (currentRoleId === "none" && user.role) {
        if (Array.isArray(user.role) && user.role.length > 0) {
          const firstRole = user.role[0];
          if (typeof firstRole === 'object' && firstRole !== null && 'id' in firstRole) {
            currentRoleId = firstRole.id.toString();
          } else if (typeof firstRole === 'number') {
            currentRoleId = firstRole.toString();
          }
        } else if (typeof user.role === 'number') {
          currentRoleId = user.role.toString();
        }
      }
      
      setSelectedRoleId(currentRoleId);
      setIsRoleDialogOpen(true);
    } catch (error) {
      console.error("Failed to load user roles:", error);
      toast.error("Failed to load user roles");
      // Still open dialog with "none" selected
      setSelectedRoleId("none");
      setIsRoleDialogOpen(true);
    }
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      
      // Remove existing role if any
      if (userRoles.length > 0) {
        for (const roleUser of userRoles) {
          try {
            await userService.removeRole(roleUser.id);
          } catch (error) {
            console.error("Error removing existing role:", error);
          }
        }
      }

      // Assign new role if provided
      if (selectedRoleId !== "none") {
        const roleId = parseInt(selectedRoleId);
        await userService.assignRole(roleId, selectedUser.id);
      }
      
      // Refresh user roles
      const updatedRoles = await userService.getUserRoles(selectedUser.id);
      setUserRoles(updatedRoles);
      
      toast.success(selectedRoleId !== "none" ? "Role assigned successfully" : "Role removed successfully", {
        description: selectedRoleId !== "none" ? "The user's role has been updated." : "The user's role has been removed.",
      });
      
      fetchUsers(); // Refresh users list
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
      setUserRoles([]);
      setSelectedRoleId("none");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Failed to update role", {
        description: err.message || "An error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage users in your organization
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/5 dark:bg-primary/10"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {searchQuery ? "No users found" : "No users yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchQuery
                ? `We couldn't find any users matching "${searchQuery}". Try adjusting your search terms or create a new user.`
                : "Start building your team by adding your first user. You can invite team members and manage their access from here."}
            </p>
            {!searchQuery ? (
              <Button onClick={handleCreate} size="lg" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Create Your First User
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="gap-2"
                >
                  Clear Search
                </Button>
                <Button onClick={handleCreate} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create New User
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {users.length} {users.length === 1 ? "user" : "users"} found
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card 
                key={user.id} 
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/50 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                        {user.profile_picture ? (
                          <img
                            src={user.profile_picture}
                            alt={user.full_name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate mb-1">
                          {user.full_name}
                        </CardTitle>
                        <CardDescription className="truncate flex items-center gap-1.5 text-sm">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {user.is_active ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAssignRoles(user)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            Manage Roles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Role
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                          {(() => {
                            if (user.role) {
                              if (Array.isArray(user.role)) {
                                if (user.role.length > 0) {
                                  if (typeof user.role[0] === 'object' && user.role[0] !== null && 'name' in user.role[0]) {
                                    return (user.role as Array<{ name: string }>)[0].name;
                                  } else {
                                    return (user.role as string[])[0];
                                  }
                                }
                                return "No Role";
                              } else if (typeof user.role === 'string') {
                                return user.role;
                              }
                            }
                            return "No Role";
                          })()}
                        </span>
                      </div>
                    </div>
                    {user.organization_name && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Organization</span>
                        <span className="font-semibold text-sm truncate ml-2">{user.organization_name}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.is_active 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user for your organization. The default password will be{" "}
              <span className="font-mono font-semibold">TestPassword@123</span>. The user will be assigned the selected role.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500 dark:text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="user@example.com"
                className={cn(
                  formik.touched.email &&
                    formik.errors.email &&
                    "border-red-500 dark:border-red-500"
                )}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-error">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name <span className="text-red-500 dark:text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formik.values.full_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="John Doe"
                className={cn(
                  formik.touched.full_name &&
                    formik.errors.full_name &&
                    "border-red-500 dark:border-red-500"
                )}
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <p className="text-sm text-error">
                  {formik.errors.full_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500 dark:text-red-500">*</span>
              </Label>
              <select
                id="role"
                name="role"
                value={formik.values.role || "member"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {roles.length === 0 ? (
                  <option value="member">Member</option>
                ) : (
                  roles.map((role) => (
                    <option key={role.id} value={role.name.toLowerCase()}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-muted-foreground">
                Default role is "Member". You can change this after user creation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  value={formik.values.timezone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="UTC"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  name="language"
                  value={formik.values.language}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="en"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border bg-muted/50">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formik.values.is_active}
                onChange={formik.handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                User is active
              </Label>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
              <p className="text-sm font-medium mb-1">Default Password</p>
              <p className="text-sm text-muted-foreground">
                The user will be created with the password:{" "}
                <span className="font-mono font-semibold">TestPassword@123</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                The user should change this password on their first login.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              Assign Role - {selectedUser?.full_name}
            </DialogTitle>
            <DialogDescription>
              Select a role for this user. Only one role can be assigned at a time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {roles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No roles available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create roles first to assign them to users.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b">
                  <p className="text-sm font-medium">
                    {roles.length} {roles.length === 1 ? "role" : "roles"} available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current: <span className="font-semibold text-foreground">
                      {(() => {
                        if (userRoles.length > 0) {
                          const firstRole = userRoles[0];
                          // Handle different API response structures
                          if (firstRole?.role_name) {
                            return firstRole.role_name;
                          } else if (firstRole?.role?.name) {
                            return firstRole.role.name;
                          }
                        }
                        return "None";
                      })()}
                    </span>
                  </p>
                </div>
                <RadioGroup
                  value={selectedRoleId}
                  onValueChange={(value) => {
                    setSelectedRoleId(value);
                  }}
                  className="space-y-2 max-h-[400px] overflow-y-auto pr-2"
                >
                  {/* No Role Option */}
                  <div
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border transition-all",
                      selectedRoleId === "none"
                        ? "border-primary/50 bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                        : "hover:bg-muted/50 hover:border-muted-foreground/20"
                    )}
                  >
                    <RadioGroupItem value="none" id="role-none" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor="role-none"
                        className="font-semibold cursor-pointer flex-1 flex items-center justify-between"
                      >
                        <span>No Role</span>
                        {selectedRoleId === "none" && (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        User will not have any role assigned
                      </p>
                    </div>
                  </div>
                  
                  {/* Role Options */}
                  {roles.map((role) => {
                    const isSelected = selectedRoleId === role.id.toString();
                    return (
                      <div
                        key={role.id}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border transition-all",
                          isSelected 
                            ? "border-primary/50 bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20" 
                            : "hover:bg-muted/50 hover:border-muted-foreground/20"
                        )}
                      >
                        <RadioGroupItem
                          value={role.id.toString()}
                          id={`role-${role.id}`}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="font-semibold cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{role.name}</span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </Label>
                          {role.description && (
                            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </>
            )}
          </div>
          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRoleDialogOpen(false);
                setSelectedUser(null);
                setUserRoles([]);
                setSelectedRoleId("none");
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveRole}
              disabled={submitting}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
