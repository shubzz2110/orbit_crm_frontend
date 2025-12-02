import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  Key,
  Search,
  Plus,
  Loader2,
  Edit2,
  Trash2,
  MoreVertical,
  FileText,
  Shield,
} from "lucide-react";
import { permissionService } from "@/services/permissionService";
import type { Permission, PermissionFormData } from "@/lib/types/role";
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

const permissionSchema = Yup.object().shape({
  name: Yup.string()
    .required("Permission name is required")
    .min(2, "Permission name must be at least 2 characters")
    .max(100, "Permission name must be less than 100 characters"),
  codename: Yup.string()
    .required("Code name is required")
    .min(2, "Code name must be at least 2 characters")
    .max(100, "Code name must be less than 100 characters")
    .matches(
      /^[a-z_]+$/,
      "Code name must be lowercase letters and underscores only"
    ),
  description: Yup.string().max(255, "Description must be less than 255 characters"),
  content_type: Yup.string().max(100, "Content type must be less than 100 characters"),
});

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const formik = useFormik<PermissionFormData>({
    initialValues: {
      name: "",
      codename: "",
      description: "",
      content_type: "",
    },
    validationSchema: permissionSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        if (selectedPermission) {
          await permissionService.update(selectedPermission.id, values);
          toast.success("Permission updated successfully", {
            description: `Permission "${values.name}" has been updated.`,
          });
        } else {
          await permissionService.create(values);
          toast.success("Permission created successfully", {
            description: `Permission "${values.name}" has been created.`,
          });
        }
        setIsDialogOpen(false);
        formik.resetForm();
        setSelectedPermission(null);
        fetchPermissions();
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?:
              | {
                  message?: string;
                  error?: string;
                  detail?: string;
                  name?: string[];
                  codename?: string[];
                }
              | string;
          };
          message?: string;
        };

        let errorMessage = selectedPermission
          ? "Failed to update permission"
          : "Failed to create permission";

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
              (Array.isArray(err.response.data.codename)
                ? err.response.data.codename[0]
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

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        ordering: "name",
      };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await permissionService.getAll(params);
      console.log("Permissions API response:", response);
      
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
      
      console.log("Parsed permissions list:", permissionsList);
      setPermissions(permissionsList);
    } catch (error: unknown) {
      console.error("Error fetching permissions:", error);
      const err = error as { message?: string };
      toast.error("Failed to load permissions", {
        description: err.message || "An error occurred while fetching permissions",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCreate = () => {
    formik.resetForm();
    setSelectedPermission(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    formik.setValues({
      name: permission.name,
      codename: permission.codename,
      description: permission.description || "",
      content_type: permission.content_type || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!permissionToDelete) return;

    try {
      await permissionService.delete(permissionToDelete.id);
      toast.success("Permission deleted successfully", {
        description: `Permission "${permissionToDelete.name}" has been deleted.`,
      });
      setDeleteDialogOpen(false);
      setPermissionToDelete(null);
      fetchPermissions();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Failed to delete permission", {
        description: err.message || "An error occurred while deleting the permission",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPermission(null);
    formik.resetForm();
  };

  // Group permissions by content type
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const group = permission.content_type || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
            <p className="text-muted-foreground mt-1">
              Manage system permissions and access controls
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Permission
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : permissions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/5 dark:bg-primary/10"></div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Key className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {searchQuery ? "No permissions found" : "No permissions yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchQuery
                ? `We couldn't find any permissions matching "${searchQuery}". Try adjusting your search terms or create a new permission.`
                : "Start by creating your first permission. Permissions define what actions users can perform in the system."}
            </p>
            {!searchQuery ? (
              <Button onClick={handleCreate} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Permission
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
                  Create New Permission
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {permissions.length} {permissions.length === 1 ? "permission" : "permissions"} found
              {Object.keys(groupedPermissions).length > 0 && (
                <span className="ml-2">
                  in {Object.keys(groupedPermissions).length} {Object.keys(groupedPermissions).length === 1 ? "category" : "categories"}
                </span>
              )}
            </p>
          </div>
          {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
            <Card key={group} className="overflow-hidden">
              <CardHeader className="bg-muted/50 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{group}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      {groupPermissions.length} {groupPermissions.length === 1 ? "permission" : "permissions"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupPermissions.map((permission) => (
                    <Card
                      key={permission.id}
                      className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/50 group"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Key className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-semibold truncate">
                                  {permission.name}
                                </CardTitle>
                              </div>
                            </div>
                            <div className="ml-10">
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted font-mono text-xs text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                {permission.codename}
                              </div>
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
                              <DropdownMenuItem onClick={() => handleEdit(permission)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(permission)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      {permission.description && (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2 pl-10">
                            {permission.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Permission Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPermission ? "Edit Permission" : "Create New Permission"}
            </DialogTitle>
            <DialogDescription>
              {selectedPermission
                ? "Update the permission details below."
                : "Create a new permission for your system. Permissions control access to specific features."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Permission Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Can view users"
                className={cn(
                  formik.touched.name && formik.errors.name && "border-red-500"
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-error">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codename">
                Code Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codename"
                name="codename"
                value={formik.values.codename}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., view_user"
                className={cn(
                  formik.touched.codename &&
                    formik.errors.codename &&
                    "border-red-500"
                )}
              />
              {formik.touched.codename && formik.errors.codename && (
                <p className="text-sm text-error">{formik.errors.codename}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Lowercase letters and underscores only (e.g., view_user, edit_post)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Brief description of this permission"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-error">{formik.errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_type">Content Type</Label>
              <Input
                id="content_type"
                name="content_type"
                value={formik.values.content_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., user, organization"
              />
              {formik.touched.content_type && formik.errors.content_type && (
                <p className="text-sm text-error">{formik.errors.content_type}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional: Group permissions by content type
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
                {selectedPermission ? "Update Permission" : "Create Permission"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the permission "{permissionToDelete?.name}".
              This action cannot be undone. Roles using this permission will lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
