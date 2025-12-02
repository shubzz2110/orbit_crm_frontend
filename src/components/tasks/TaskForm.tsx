import { Loader2, CheckSquare, Calendar, Clock, User, FileText, Repeat } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Task, TaskFormData } from "@/lib/types/task";
import type { Organization } from "@/lib/types/organization";
import type { User as UserType } from "@/lib/types/user";
import type { Lead } from "@/lib/types/lead";
import type { Contact } from "@/lib/types/contact";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TASK_TYPE_OPTIONS = [
  { value: "Call", label: "Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
  { value: "Follow-up", label: "Follow-up" },
  { value: "Demo", label: "Demo" },
  { value: "Other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
];

const STATUS_OPTIONS = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const REPEAT_FREQUENCY_OPTIONS = [
  { value: "None", label: "None" },
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
];

const taskSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(255, "Title must be less than 255 characters"),
  due_date: Yup.string().required("Due date is required"),
  priority: Yup.string().required("Priority is required"),
  status: Yup.string().required("Status is required"),
  organization: Yup.number().required("Organization is required"),
  repeat_frequency: Yup.string().required("Repeat frequency is required"),
});

// Helper function to format datetime-local input value
const formatDateTimeLocal = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
};

// Helper function to format date input value
const formatDateLocal = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

interface TaskFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormData) => Promise<void>;
  task?: Task | null;
  organizations: Organization[];
  users: UserType[];
  leads?: Lead[];
  contacts?: Contact[];
  submitting: boolean;
}

export function TaskForm({
  isOpen,
  onOpenChange,
  onSubmit,
  task,
  organizations,
  users,
  leads = [],
  contacts = [],
  submitting,
}: TaskFormProps) {
  const isEditMode = !!task;

  const formik = useFormik<TaskFormData>({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      task_type: task?.task_type || undefined,
      priority: task?.priority || "Medium",
      status: task?.status || "To Do",
      due_date: task?.due_date ? formatDateTimeLocal(task.due_date) : "",
      reminder_at: task?.reminder_at ? formatDateTimeLocal(task.reminder_at) : "",
      assigned_to: task?.assigned_to || null,
      organization: task?.organization || organizations[0]?.id || 0,
      lead: task?.lead || null,
      contact: task?.contact || null,
      repeat_frequency: task?.repeat_frequency || "None",
      repeat_until: task?.repeat_until ? formatDateLocal(task.repeat_until) : "",
    },
    validationSchema: taskSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Convert datetime-local format to ISO string
      const formattedValues = {
        ...values,
        due_date: new Date(values.due_date).toISOString(),
        reminder_at: values.reminder_at ? new Date(values.reminder_at).toISOString() : null,
        repeat_until: values.repeat_until ? new Date(values.repeat_until).toISOString().split('T')[0] : null,
      };
      await onSubmit(formattedValues);
      formik.resetForm();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update task information below"
              : "Fill in the details to add a new task"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Follow up with client"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    formik.touched.title && formik.errors.title && "border-red-500"
                  )}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-sm text-red-500">{formik.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Detailed information about the task..."
                  value={formik.values.description || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task_type">Task Type</Label>
                  <select
                    id="task_type"
                    name="task_type"
                    value={formik.values.task_type || ""}
                    onChange={formik.handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select type</option>
                    {TASK_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Priority <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      formik.touched.priority && formik.errors.priority && "border-red-500"
                    )}
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      formik.touched.status && formik.errors.status && "border-red-500"
                    )}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="datetime-local"
                    value={formik.values.due_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.due_date && formik.errors.due_date && "border-red-500"
                    )}
                  />
                  {formik.touched.due_date && formik.errors.due_date && (
                    <p className="text-sm text-red-500">{formik.errors.due_date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminder_at">Reminder At</Label>
                  <Input
                    id="reminder_at"
                    name="reminder_at"
                    type="datetime-local"
                    value={formik.values.reminder_at || ""}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Relationships Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Assignment & Relationships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">
                    Organization <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="organization"
                    name="organization"
                    value={formik.values.organization}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      formik.touched.organization && formik.errors.organization && "border-red-500"
                    )}
                  >
                    {organizations.length === 0 && (
                      <option value="">No organizations available</option>
                    )}
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <select
                    id="assigned_to"
                    name="assigned_to"
                    value={formik.values.assigned_to || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "assigned_to",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lead">Related Lead</Label>
                  <select
                    id="lead"
                    name="lead"
                    value={formik.values.lead || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "lead",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">None</option>
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.lead_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Related Contact</Label>
                  <select
                    id="contact"
                    name="contact"
                    value={formik.values.contact || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "contact",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">None</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.full_name || `${contact.first_name} ${contact.last_name}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recurrence Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Repeat className="h-5 w-5" />
                Recurrence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repeat_frequency">Repeat Frequency</Label>
                  <select
                    id="repeat_frequency"
                    name="repeat_frequency"
                    value={formik.values.repeat_frequency}
                    onChange={formik.handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {REPEAT_FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repeat_until">Repeat Until</Label>
                  <Input
                    id="repeat_until"
                    name="repeat_until"
                    type="date"
                    value={formik.values.repeat_until || ""}
                    onChange={formik.handleChange}
                    disabled={formik.values.repeat_frequency === "None"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditMode ? "Update" : "Create"} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

