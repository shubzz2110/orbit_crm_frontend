import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  ShieldCheck,
  Search,
  Plus,
  Loader2,
  Edit2,
  Trash2,
  Users,
  Key,
  MoreVertical,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { roleService } from "@/services/roleService";
import { permissionService } from "@/services/permissionService";
import type { Role, RoleFormData, Permission } from "@/lib/types/role";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const roleSchema = Yup.object().shape({
  name: Yup.string()
    .required("Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must be less than 50 characters"),
  description: Yup.string().max(255, "Description must be less than 255 characters"),
});

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const formik = useFormik<RoleFormData>({
    initialValues: {
      name: "",
      description: "",
      permissions: [],
    },
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        if (selectedRole) {
          await roleService.update(selectedRole.id, values);
          toast.success("Role updated successfully", {
            description: `Role "${values.name}" has been updated.`,
          });
        } else {
          await roleService.create(values);
          toast.success("Role created successfully", {
            description: `Role "${values.name}" has been created.`,
          });
        }
        setIsDialogOpen(false);
        formik.resetForm();
        setSelectedRole(null);
        fetchRoles();
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?:
              | { message?: string; error?: string; detail?: string; name?: string[] }
              | string;
          };
          message?: string;
        };

        let errorMessage = selectedRole ? "Failed to update role" : "Failed to create role";

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else {
            errorMessage =
              err.response.data.message ||
              err.response.data.error ||
              err.response.data.detail ||
              (Array.isArray(err.response.data.name)
                ? err.response.data.name[0]
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

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        ordering: "-created_at",
      };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await roleService.getAll(params);
      
      // Handle different response formats
      let rolesList: Role[] = [];
      if (Array.isArray(response)) {
        rolesList = response;
      } else if (response && typeof response === 'object') {
        if ('results' in response && Array.isArray(response.results)) {
          rolesList = response.results;
        } else if ('data' in response && Array.isArray(response.data)) {
          rolesList = response.data;
        }
      }
      
      setRoles(rolesList);
    } catch (error: unknown) {
      console.error("Error fetching roles:", error);
      const err = error as { message?: string };
      toast.error("Failed to load roles", {
        description: err.message || "An error occurred while fetching roles",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionService.getAll({ ordering: "name" });
      
      // Handle different response formats
      let permissionsList: Permission[] = [];
      if (Array.isArray(response)) {
        permissionsList = response;
      } else if (response && typeof response === 'object') {
        if ('results' in response && Array.isArray(response.results)) {
          permissionsList = response.results;
        } else if ('data' in response && Array.isArray(response.data)) {
          permissionsList = response.data;
        }
      }
      
      setPermissions(permissionsList);
    } catch (error: unknown) {
      console.error("Failed to load permissions:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCreate = () => {
    formik.resetForm();
    setSelectedRole(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    formik.setValues({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions?.map((p) => p.id) || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await roleService.delete(roleToDelete.id);
      toast.success("Role deleted successfully", {
        description: `Role "${roleToDelete.name}" has been deleted.`,
      });
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
      fetchRoles();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Failed to delete role", {
        description: err.message || "An error occurred while deleting the role",
      });
    }
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    formik.setValues({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions?.map((p) => p.id) || [],
    });
    setIsPermissionDialogOpen(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      setSubmitting(true);
      await roleService.assignPermissions(
        selectedRole.id,
        formik.values.permissions || []
      );
      toast.success("Permissions updated successfully", {
        description: `Permissions for role "${selectedRole.name}" have been updated.`,
      });
      setIsPermissionDialogOpen(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Failed to update permissions", {
        description: err.message || "An error occurred while updating permissions",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    const currentPermissions = formik.values.permissions || [];
    if (currentPermissions.includes(permissionId)) {
      formik.setFieldValue(
        "permissions",
        currentPermissions.filter((id) => id !== permissionId)
      );
    } else {
      formik.setFieldValue("permissions", [...currentPermissions, permissionId]);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRole(null);
    formik.resetForm();
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
            <p className="text-muted-foreground mt-1">
              Manage user roles and their permissions
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : roles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/5 dark:bg-primary/10"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {searchQuery ? "No roles found" : "No roles yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchQuery
                ? `We couldn't find any roles matching "${searchQuery}". Try adjusting your search terms or create a new role.`
                : "Start by creating your first role. Roles help you organize and manage user permissions effectively."}
            </p>
            {!searchQuery ? (
              <Button onClick={handleCreate} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Role
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
                  <Plus className="h-4 w-4" />
                  Create New Role
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {roles.length} {roles.length === 1 ? "role" : "roles"} found
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card 
                key={role.id} 
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/50 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate mb-1">
                          {role.name}
                        </CardTitle>
                        {role.description ? (
                          <CardDescription className="line-clamp-2 text-sm">
                            {role.description}
                          </CardDescription>
                        ) : (
                          <CardDescription className="text-xs italic text-muted-foreground/70">
                            No description
                          </CardDescription>
                        )}
                      </div>
                    </div>
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
                        <DropdownMenuItem onClick={() => handleEdit(role)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManagePermissions(role)}>
                          <Key className="h-4 w-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(role)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Key className="h-3.5 w-3.5" />
                        Permissions
                      </span>
                      <span className="font-semibold text-sm">
                        {role.permissions?.length || 0}
                      </span>
                    </div>
                    {role.user_count !== undefined && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" />
                          Users
                        </span>
                        <span className="font-semibold text-sm">{role.user_count}</span>
                      </div>
                    )}
                    {role.created_at && (
                      <div className="pt-2 border-t text-xs text-muted-foreground">
                        Created {new Date(role.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedRole ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {selectedRole
                ? "Update the role details below."
                : "Create a new role for your organization. You can assign permissions after creation."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Manager, Editor"
                className={cn(
                  formik.touched.name && formik.errors.name && "border-red-500"
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-error">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Brief description of this role"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-error">{formik.errors.description}</p>
              )}
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
                {selectedRole ? "Update Role" : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Manage Permissions - {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              Select the permissions to assign to this role. {formik.values.permissions?.length || 0} permission{formik.values.permissions?.length !== 1 ? 's' : ''} selected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {permissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Key className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No permissions available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create permissions first to assign them to roles.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b">
                  <p className="text-sm font-medium">
                    {permissions.length} {permissions.length === 1 ? "permission" : "permissions"} available
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const allIds = permissions.map(p => p.id);
                      formik.setFieldValue("permissions", allIds);
                    }}
                    className="text-xs"
                  >
                    Select All
                  </Button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {permissions.map((permission) => {
                    const isChecked = formik.values.permissions?.includes(permission.id) || false;
                    return (
                      <div
                        key={permission.id}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                          isChecked 
                            ? "border-primary/50 bg-primary/5 dark:bg-primary/10" 
                            : "hover:bg-muted/50 hover:border-muted-foreground/20"
                        )}
                        onClick={() => togglePermission(permission.id)}
                      >
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={isChecked}
                          onCheckedChange={() => togglePermission(permission.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Label
                              htmlFor={`permission-${permission.id}`}
                              className="font-semibold cursor-pointer flex-1"
                            >
                              {permission.name}
                            </Label>
                            {isChecked && (
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </div>
                          {permission.codename && (
                            <div className="mt-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted font-mono text-xs text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                {permission.codename}
                              </span>
                            </div>
                          )}
                          {permission.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPermissionDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save {formik.values.permissions?.length || 0} Permission{formik.values.permissions?.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role "{roleToDelete?.name}". This action
              cannot be undone. Users with this role will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
