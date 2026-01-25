import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

interface DashboardLayoutProps {
  userRole?: "farmer" | "buyer" | "admin";
  userName?: string;
}

export function DashboardLayout({ 
  userRole = "farmer", 
  userName = "Ebuka Okafor" 
}: DashboardLayoutProps) {
  const roleLabels = {
    farmer: "Farmer",
    buyer: "B2B Buyer",
    admin: "Senior Auditor",
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName={userName} 
          userRole={roleLabels[userRole]} 
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
