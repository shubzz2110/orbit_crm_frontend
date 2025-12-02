import {
  Orbit,
  User,
  Building2,
  Users,
  ShieldCheck,
  CheckSquare,
  Home,
  Settings,
  Activity,
  Contact2,
  UserRound,
  TrendingUp,
  Bell,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavLink } from "@/components/common/NavLink";
import { cn } from "@/lib/utils";

const adminSidebarItems = [
  {
    title: "CRM",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: Home },
      { name: "Leads", href: "/admin/leads", icon: Contact2 },
      { name: "Contacts", href: "/admin/contacts", icon: UserRound },
      { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
      { name: "Deals", href: "/admin/deals", icon: TrendingUp },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    title: "Administration",
    items: [
      { name: "Organization", href: "/admin/organization", icon: Building2 },
      { name: "User Management", href: "/admin/users", icon: Users },
      { name: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
      { name: "Audit Logs", href: "/admin/audit", icon: Activity },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Profile", href: "/admin/profile", icon: User },
    ],
  },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent>
        {/* LOGO */}
        <div
          className={cn(
            "py-5 flex items-center border-b border-border/40 transition-all",
            open ? "px-6 gap-2 justify-start" : "px-0 justify-center"
          )}
        >
          <Orbit className="h-6 w-6 text-primary shrink-0" />
          {open && (
            <span className="text-lg font-semibold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
              OrbitCRM
            </span>
          )}
        </div>

        {/* ITEMS */}
        {adminSidebarItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs uppercase text-muted-foreground/70 px-4">
              {section.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild tooltip={item.name}>
                      <NavLink
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        activeClassName="bg-primary/20 text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.name}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
