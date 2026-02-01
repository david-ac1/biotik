import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Store,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import { BiotikLogo } from "@/components/BiotikLogo";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterNavLink
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </RouterNavLink>
  );
}

interface DashboardSidebarProps {
  userRole?: "farmer" | "buyer" | "admin";
}

export function DashboardSidebar({ userRole = "farmer" }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const farmerNav = [
    { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { to: "/logging", icon: <ClipboardList className="w-5 h-5" />, label: "Livestock Logging" },
  ];

  const adminNav = [
    { to: "/command-center", icon: <LayoutDashboard className="w-5 h-5" />, label: "Command Center" },
    { to: "/audits", icon: <ClipboardList className="w-5 h-5" />, label: "Audits" },
    { to: "/marketplace", icon: <Store className="w-5 h-5" />, label: "Marketplace" },
    { to: "/reports", icon: <FileText className="w-5 h-5" />, label: "Reports" },
  ];

  const buyerNav = [
    { to: "/marketplace", icon: <Store className="w-5 h-5" />, label: "Marketplace" },
    { to: "/orders", icon: <ClipboardList className="w-5 h-5" />, label: "Orders" },
    { to: "/reports", icon: <FileText className="w-5 h-5" />, label: "Reports" },
  ];

  const navItems = userRole === "admin" ? adminNav : userRole === "buyer" ? buyerNav : farmerNav;

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && <BiotikLogo size="sm" />}
        {collapsed && (
          <RouterNavLink to="/" className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto hover:opacity-80 transition-opacity">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </RouterNavLink>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "mx-auto mt-2"
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <NavItem
          to="/settings"
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          collapsed={collapsed}
        />
        <NavItem
          to="/help"
          icon={<HelpCircle className="w-5 h-5" />}
          label="Help & Support"
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
