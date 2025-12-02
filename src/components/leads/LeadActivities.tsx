import { useState, useEffect } from "react";
import { Phone, Mail, Calendar, Clock, Plus, Loader2 } from "lucide-react";
import type { Lead, LeadActivity, LeadActivityFormData } from "@/lib/types/lead";
import { leadService } from "@/services/leadService";
import { ACTIVITY_TYPE_OPTIONS, EMAIL_DIRECTION_OPTIONS, CALL_DIRECTION_OPTIONS } from "@/lib/types/lead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

interface LeadActivitiesProps {
  lead: Lead;
  onActivityAdded?: () => void;
}

export function LeadActivities({ lead, onActivityAdded }: LeadActivitiesProps) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<LeadActivityFormData>>({
    activity_type: "call",
    activity_date: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    fetchActivities();
  }, [lead.id]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await leadService.getActivities(lead.id);
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.activity_type || !formData.activity_date) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      // Convert datetime-local format to ISO string
      const activityDate = formData.activity_date
        ? new Date(formData.activity_date).toISOString()
        : new Date().toISOString();
      
      const activityData: Omit<LeadActivityFormData, "lead"> = {
        ...formData,
        activity_date: activityDate,
      } as Omit<LeadActivityFormData, "lead">;
      
      await leadService.addActivity(lead.id, activityData);
      toast.success("Activity added successfully");
      setIsDialogOpen(false);
      setFormData({
        activity_type: "call",
        activity_date: new Date().toISOString().slice(0, 16),
      });
      fetchActivities();
      onActivityAdded?.();
    } catch (error: any) {
      console.error("Error adding activity:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add activity";
      toast.error("Failed to add activity", {
        description: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activities ({activities.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Activity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activities yet</p>
            <p className="text-sm mt-1">Add your first activity to track interactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">
                        {activity.subject || activity.activity_type_display || activity.activity_type}
                      </h4>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(activity.activity_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {activity.duration_minutes && (
                      <span>Duration: {activity.duration_minutes} min</span>
                    )}
                    {activity.email_direction && (
                      <span>Direction: {activity.email_direction}</span>
                    )}
                    {activity.call_direction && (
                      <span>Direction: {activity.call_direction}</span>
                    )}
                    {activity.meeting_location && (
                      <span>Location: {activity.meeting_location}</span>
                    )}
                    {activity.created_by_full_name && (
                      <span>By: {activity.created_by_full_name}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Activity Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>
              Record an interaction with this lead
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity_type">
                Activity Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="activity_type"
                value={formData.activity_type || ""}
                onChange={(e) =>
                  setFormData({ ...formData, activity_type: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity_date">
                Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="activity_date"
                type="datetime-local"
                value={formData.activity_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, activity_date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Brief subject or title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Details about the activity"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            </div>
            {formData.activity_type === "call" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="call_direction">Call Direction</Label>
                  <select
                    id="call_direction"
                    value={formData.call_direction || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        call_direction: e.target.value as "inbound" | "outbound",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select direction</option>
                    {CALL_DIRECTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="30"
                  />
                </div>
              </>
            )}
            {formData.activity_type === "email" && (
              <div className="space-y-2">
                <Label htmlFor="email_direction">Email Direction</Label>
                <select
                  id="email_direction"
                  value={formData.email_direction || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email_direction: e.target.value as "inbound" | "outbound",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select direction</option>
                  {EMAIL_DIRECTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {formData.activity_type === "meeting" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="meeting_location">Location</Label>
                  <Input
                    id="meeting_location"
                    value={formData.meeting_location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, meeting_location: e.target.value })
                    }
                    placeholder="Meeting location or address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting_url">Meeting URL</Label>
                  <Input
                    id="meeting_url"
                    type="url"
                    value={formData.meeting_url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, meeting_url: e.target.value })
                    }
                    placeholder="https://meet.example.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="60"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

