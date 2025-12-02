import { Loader2, TrendingUp, DollarSign, Calendar, User, FileText, Percent } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Deal, DealFormData } from "@/lib/types/deal";
import type { Organization } from "@/lib/types/organization";
import type { User as UserType } from "@/lib/types/user";
import type { Lead } from "@/lib/types/lead";
import type { Contact } from "@/lib/types/contact";
import { DEAL_STAGE_OPTIONS, DEAL_STATUS_OPTIONS, DEAL_SOURCE_OPTIONS, CURRENCY_OPTIONS } from "@/lib/types/deal";
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

const dealSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(255, "Title must be less than 255 characters"),
  amount: Yup.string()
    .required("Amount is required")
    .test("is-positive", "Amount must be greater than zero", (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  currency: Yup.string().required("Currency is required"),
  probability: Yup.number()
    .min(0, "Probability must be between 0 and 100")
    .max(100, "Probability must be between 0 and 100")
    .required("Probability is required"),
  expected_close_date: Yup.string().required("Expected close date is required"),
  stage: Yup.string().required("Stage is required"),
  status: Yup.string().required("Status is required"),
  organization: Yup.number().required("Organization is required"),
});

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

interface DealFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DealFormData) => Promise<void>;
  deal?: Deal | null;
  organizations: Organization[];
  users: UserType[];
  leads?: Lead[];
  contacts?: Contact[];
  submitting: boolean;
}

export function DealForm({
  isOpen,
  onOpenChange,
  onSubmit,
  deal,
  organizations,
  users,
  leads = [],
  contacts = [],
  submitting,
}: DealFormProps) {
  const isEditMode = !!deal;

  const formik = useFormik<DealFormData>({
    initialValues: {
      title: deal?.title || "",
      description: deal?.description || "",
      amount: deal?.amount || "",
      currency: deal?.currency || "INR",
      probability: deal?.probability || 0,
      stage: deal?.stage || "Qualification",
      status: deal?.status || "Open",
      expected_close_date: deal?.expected_close_date ? formatDateLocal(deal.expected_close_date) : "",
      actual_close_date: deal?.actual_close_date ? formatDateLocal(deal.actual_close_date) : "",
      source: deal?.source || undefined,
      deal_owner: deal?.deal_owner || null,
      organization: deal?.organization || organizations[0]?.id || 0,
      contact: deal?.contact || null,
      lead: deal?.lead || null,
    },
    validationSchema: dealSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Convert date format to ISO string
      const formattedValues = {
        ...values,
        expected_close_date: new Date(values.expected_close_date).toISOString().split('T')[0],
        actual_close_date: values.actual_close_date ? new Date(values.actual_close_date).toISOString().split('T')[0] : null,
      };
      await onSubmit(formattedValues);
      formik.resetForm();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  // Auto-update status when stage changes
  const handleStageChange = (stage: string) => {
    formik.setFieldValue("stage", stage);
    if (stage === "Closed Won") {
      formik.setFieldValue("status", "Won");
      formik.setFieldValue("probability", 100);
    } else if (stage === "Closed Lost") {
      formik.setFieldValue("status", "Lost");
      formik.setFieldValue("probability", 0);
    } else if (formik.values.status !== "Open" && formik.values.status !== "On Hold") {
      formik.setFieldValue("status", "Open");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Edit Deal" : "Create New Deal"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update deal information below"
              : "Fill in the details to add a new deal"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
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
                  placeholder="Website Development Project"
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
                  placeholder="About the opportunity..."
                  value={formik.values.description || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Deal Value Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Deal Value
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="amount">
                    Amount <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="100000"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.amount && formik.errors.amount && "border-red-500"
                    )}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="text-sm text-red-500">{formik.errors.amount}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    Currency <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="currency"
                    name="currency"
                    value={formik.values.currency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      formik.touched.currency && formik.errors.currency && "border-red-500"
                    )}
                  >
                    {CURRENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="probability">
                  Probability (%) <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="probability"
                    name="probability"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="50"
                    value={formik.values.probability}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "flex-1",
                      formik.touched.probability && formik.errors.probability && "border-red-500"
                    )}
                  />
                  <div className="w-12 h-10 rounded-md border border-input bg-muted flex items-center justify-center text-sm">
                    %
                  </div>
                </div>
                {formik.touched.probability && formik.errors.probability && (
                  <p className="text-sm text-red-500">{formik.errors.probability}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline & Status Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pipeline & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">
                    Stage <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="stage"
                    name="stage"
                    value={formik.values.stage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      formik.touched.stage && formik.errors.stage && "border-red-500"
                    )}
                  >
                    {DEAL_STAGE_OPTIONS.map((opt) => (
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
                    {DEAL_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expected_close_date">
                    Expected Close Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expected_close_date"
                    name="expected_close_date"
                    type="date"
                    value={formik.values.expected_close_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.expected_close_date && formik.errors.expected_close_date && "border-red-500"
                    )}
                  />
                  {formik.touched.expected_close_date && formik.errors.expected_close_date && (
                    <p className="text-sm text-red-500">{formik.errors.expected_close_date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_close_date">Actual Close Date</Label>
                  <Input
                    id="actual_close_date"
                    name="actual_close_date"
                    type="date"
                    value={formik.values.actual_close_date || ""}
                    onChange={formik.handleChange}
                    disabled={formik.values.status === "Open"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <select
                  id="source"
                  name="source"
                  value={formik.values.source || ""}
                  onChange={formik.handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select source</option>
                  {DEAL_SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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
                  <Label htmlFor="deal_owner">Deal Owner</Label>
                  <select
                    id="deal_owner"
                    name="deal_owner"
                    value={formik.values.deal_owner || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "deal_owner",
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
              {isEditMode ? "Update" : "Create"} Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

