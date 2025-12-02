import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  TrendingUp,
  Activity,
  Mail,
  Phone,
  Building2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTooltip } from "@/components/charts/CustomTooltip";
import { dashboardService, type DashboardStats } from "@/services/dashboardService";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Failed to load dashboard data", {
          description: "Please try refreshing the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const monthlyContactsData = stats.contacts.monthly_data || [];
  
  const leadStatusData = Object.entries(stats.contacts.by_lead_status || {}).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));

  const lifecycleStageData = Object.entries(stats.contacts.by_lifecycle_stage || {}).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));

  const sourceData = Object.entries(stats.contacts.by_source || {})
    .map(([source, contacts]) => {
      const total = Object.values(stats.contacts.by_source || {}).reduce((sum, val) => sum + val, 0);
      const percentage = total > 0 ? Math.round((contacts / total) * 100) : 0;
      return { source, contacts, percentage };
    })
    .sort((a, b) => b.contacts - a.contacts);

  const activityData = stats.activity.weekly || [];

  // Calculate growth percentage
  const growthPercentage = stats.contacts.growth_percentage || 0;
  const growthDisplay = growthPercentage >= 0 ? `+${growthPercentage.toFixed(1)}%` : `${growthPercentage.toFixed(1)}%`;

  const statCards = [
    {
      title: "Total Contacts",
      value: stats.contacts.total.toLocaleString(),
      change: growthDisplay,
      trend: growthPercentage >= 0 ? "up" : "down",
      icon: Users,
      description: "All contacts in CRM",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      tooltip: `Total contacts: ${stats.contacts.total.toLocaleString()}`,
    },
    {
      title: "Active Contacts",
      value: stats.contacts.active.toLocaleString(),
      change: `${Math.round((stats.contacts.active / stats.contacts.total) * 100)}%`,
      trend: "up",
      icon: UserPlus,
      description: "Currently active",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      tooltip: `Active contacts: ${stats.contacts.active.toLocaleString()} out of ${stats.contacts.total.toLocaleString()}`,
    },
    {
      title: "New This Month",
      value: stats.contacts.new_this_month.toLocaleString(),
      change: growthDisplay,
      trend: growthPercentage >= 0 ? "up" : "down",
      icon: TrendingUp,
      description: "New contacts added",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      tooltip: `New contacts this month: ${stats.contacts.new_this_month.toLocaleString()}`,
    },
    {
      title: "Converted",
      value: stats.contacts.converted.toLocaleString(),
      change: `${Math.round((stats.contacts.converted / stats.contacts.total) * 100)}%`,
      trend: "up",
      icon: Target,
      description: "Successfully converted",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      tooltip: `Converted contacts: ${stats.contacts.converted.toLocaleString()}`,
    },
  ];

  // Additional stat cards
  const additionalStats = [
    {
      title: "Total Deals",
      value: stats.deals.total.toLocaleString(),
      icon: DollarSign,
      description: `${stats.deals.won} won, ${stats.deals.lost} lost`,
      tooltip: `Total deals: ${stats.deals.total}, Won: ${stats.deals.won}, Lost: ${stats.deals.lost}, Open: ${stats.deals.open}`,
    },
    {
      title: "Deal Value",
      value: `$${stats.deals.total_amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      description: `Won: $${stats.deals.won_amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      tooltip: `Total deal value: $${stats.deals.total_amount.toLocaleString()}, Won: $${stats.deals.won_amount.toLocaleString()}`,
    },
    {
      title: "Tasks",
      value: stats.tasks.total.toLocaleString(),
      icon: CheckCircle2,
      description: `${stats.tasks.overdue} overdue, ${stats.tasks.upcoming} upcoming`,
      tooltip: `Total tasks: ${stats.tasks.total}, Overdue: ${stats.tasks.overdue}, Upcoming: ${stats.tasks.upcoming}`,
    },
    {
      title: "Leads",
      value: stats.leads.total.toLocaleString(),
      icon: Users,
      description: "Total leads in pipeline",
      tooltip: `Total leads: ${stats.leads.total.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your CRM performance and metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {additionalStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Contacts Growth Chart */}
          {monthlyContactsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Contacts Growth</CardTitle>
                <CardDescription>Monthly contact growth and new additions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyContactsData}>
                    <defs>
                      <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="stroke-muted/30 dark:stroke-muted/20" 
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: "currentColor" }}
                    />
                    <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
                    <RechartsTooltip
                      content={
                        <CustomTooltip
                          labelFormatter={(label) => `Month: ${label}`}
                          valueFormatter={(value, name) => {
                            return name === "Total Contacts" || name === "New Contacts"
                              ? value.toLocaleString()
                              : value;
                          }}
                        />
                      }
                      cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3" }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: "20px",
                        color: "hsl(var(--foreground))"
                      }}
                      iconType="circle"
                      formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                    />
                    <Area
                      type="monotone"
                      dataKey="contacts"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorContacts)"
                      name="Total Contacts"
                    />
                    <Area
                      type="monotone"
                      dataKey="new"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorNew)"
                      name="New Contacts"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Lead Status Distribution */}
          {leadStatusData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
                <CardDescription>Breakdown of contacts by lead status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={
                        <CustomTooltip
                          showLabel={false}
                          valueFormatter={(value, name) => {
                            const total = leadStatusData.reduce((sum, item) => sum + item.value, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                            return `${value.toLocaleString()} (${percentage}%)`;
                          }}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {leadStatusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Lifecycle Stage */}
          {lifecycleStageData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Lifecycle Stage</CardTitle>
                <CardDescription>Contacts by lifecycle stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={lifecycleStageData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="stroke-muted/30 dark:stroke-muted/20" 
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: "currentColor" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
                    <RechartsTooltip
                      content={
                        <CustomTooltip
                          labelFormatter={(label) => `Stage: ${label}`}
                          valueFormatter={(value) => `${value.toLocaleString()} contacts`}
                        />
                      }
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {lifecycleStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Contact Sources */}
          {sourceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Sources</CardTitle>
                <CardDescription>Where your contacts are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData} layout="vertical">
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="stroke-muted/30 dark:stroke-muted/20" 
                      vertical={false}
                    />
                    <XAxis type="number" className="text-xs" tick={{ fill: "currentColor" }} />
                    <YAxis
                      dataKey="source"
                      type="category"
                      className="text-xs"
                      tick={{ fill: "currentColor" }}
                      width={100}
                    />
                    <RechartsTooltip
                      content={
                        <CustomTooltip
                          labelFormatter={(label) => `Source: ${label}`}
                          valueFormatter={(value, name) => {
                            const total = sourceData.reduce((sum, item) => sum + item.contacts, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                            return `${value.toLocaleString()} contacts (${percentage}%)`;
                          }}
                        />
                      }
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                    />
                    <Bar dataKey="contacts" radius={[0, 8, 8, 0]} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {sourceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">{item.source}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {item.contacts}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Chart */}
        {activityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Daily activity breakdown for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="stroke-muted/30 dark:stroke-muted/20" 
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: "currentColor" }}
                  />
                  <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
                  <RechartsTooltip
                    content={
                      <CustomTooltip
                        labelFormatter={(label) => `Date: ${label}`}
                        valueFormatter={(value, name) => {
                          const activityType = name.toLowerCase();
                          return `${value} ${activityType}`;
                        }}
                      />
                    }
                    cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3" }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: "20px",
                      color: "hsl(var(--foreground))"
                    }}
                    iconType="line"
                    formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                    name="Calls"
                  />
                  <Line
                    type="monotone"
                    dataKey="emails"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#10b981" }}
                    activeDot={{ r: 6 }}
                    name="Emails"
                  />
                  <Line
                    type="monotone"
                    dataKey="meetings"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#f59e0b" }}
                    activeDot={{ r: 6 }}
                    name="Meetings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
