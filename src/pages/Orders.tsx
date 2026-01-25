import { motion } from "framer-motion";
import { format } from "date-fns";
import { Package, Clock, CheckCircle2, Truck, XCircle, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useOrders } from "@/hooks/useOrders";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Pending",
  },
  confirmed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Confirmed",
  },
  processing: {
    icon: <Package className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    label: "Processing",
  },
  shipped: {
    icon: <Truck className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    label: "Shipped",
  },
  delivered: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Delivered",
  },
  cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-red-100 text-red-800 border-red-200",
    label: "Cancelled",
  },
};

export default function Orders() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="buyer" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-display font-bold text-foreground mb-1">
                My Orders
              </h1>
              <p className="text-muted-foreground">
                Track your verified poultry orders
              </p>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-32" />
                  </Card>
                ))}
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, i) => {
                  const status = statusConfig[order.status || "pending"];
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="card-interactive">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {order.batch?.breed || "Batch"}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {order.batch?.batch_code}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`${status.color} flex items-center gap-1`}
                            >
                              {status.icon}
                              {status.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Quantity
                              </p>
                              <p className="font-semibold">{order.quantity_kg} kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Total
                              </p>
                              <p className="font-semibold">
                                ${order.total_amount.toFixed(2)}
                                {order.premium_percentage ? (
                                  <span className="text-xs text-primary ml-1">
                                    +{order.premium_percentage}%
                                  </span>
                                ) : null}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Farmer
                              </p>
                              <p className="font-semibold text-sm">
                                {order.farmer?.full_name || "—"}
                              </p>
                              {order.farmer?.district && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {order.farmer.district}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Delivery
                              </p>
                              {order.delivery_date ? (
                                <p className="font-semibold flex items-center gap-1 text-sm">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(order.delivery_date), "MMM d, yyyy")}
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground">Not set</p>
                              )}
                            </div>
                          </div>
                          {order.notes && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Notes
                              </p>
                              <p className="text-sm">{order.notes}</p>
                            </div>
                          )}
                          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                            Ordered on{" "}
                            {order.created_at
                              ? format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")
                              : "—"}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground">
                    Browse the marketplace to place your first order.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
