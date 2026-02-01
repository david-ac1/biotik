import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import FarmerLogging from "./pages/FarmerLogging";
import BatchDetail from "./pages/BatchDetail";
import BatchPassport from "./pages/BatchPassport";
import Marketplace from "./pages/Marketplace";
import Orders from "./pages/Orders";
import CommandCenter from "./pages/CommandCenter";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/passport/:batchId" element={<BatchPassport />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <FarmerLogging />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logging"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <FarmerLogging />
                </ProtectedRoute>
              }
            />
            <Route
              path="/batch/:batchId"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <BatchDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute allowedRoles={["buyer", "farmer", "admin"]}>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["buyer", "farmer", "admin"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/command-center"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CommandCenter />
                </ProtectedRoute>
              }
              />
            <Route path="/docs" element={<Documentation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
