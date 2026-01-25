import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  userRole?: "farmer" | "buyer" | "admin";
}

export function DashboardLayout({ 
  userRole = "farmer", 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
