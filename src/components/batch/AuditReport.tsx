import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AnomalyFlag {
  type: "warning" | "critical";
  message: string;
  day_number?: number;
  field?: string;
}

interface AuditReportProps {
  integrityScore: number;
  stewardshipGrade: string;
  fcr: number;
  mortalityRate: number;
  dataCompleteness: number;
  photoCoverage: number;
  anomalyFlags: AnomalyFlag[];
  lastAuditAt: string | null;
  aiSummary?: string;
}

export function AuditReport({
  integrityScore,
  stewardshipGrade,
  fcr,
  mortalityRate,
  dataCompleteness,
  photoCoverage,
  anomalyFlags,
  lastAuditAt,
  aiSummary,
}: AuditReportProps) {
  const [isOpen, setIsOpen] = useState(false);

  const gradeConfig = {
    gold: {
      label: "Gold",
      color: "bg-stewardship-gold text-stewardship-gold-foreground",
      icon: "🥇",
      description: "Exceptional data integrity and performance",
    },
    silver: {
      label: "Silver",
      color: "bg-muted-foreground text-white",
      icon: "🥈",
      description: "Good data integrity with minor gaps",
    },
    standard: {
      label: "Standard",
      color: "bg-muted text-muted-foreground",
      icon: "🏅",
      description: "Meets basic requirements",
    },
    pending: {
      label: "Pending",
      color: "bg-info/10 text-info",
      icon: "⏳",
      description: "Awaiting audit",
    },
  };

  const grade = gradeConfig[stewardshipGrade as keyof typeof gradeConfig] || gradeConfig.pending;

  const fcrStatus =
    fcr === 0 ? "neutral" : fcr < 1.7 ? "good" : fcr <= 2.0 ? "warning" : "critical";
  const fcrColors = {
    neutral: "text-muted-foreground",
    good: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
  };

  const criticalFlags = anomalyFlags.filter((f) => f.type === "critical");
  const warningFlags = anomalyFlags.filter((f) => f.type === "warning");

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Audit Report
          </CardTitle>
          {lastAuditAt && (
            <span className="text-xs text-muted-foreground">
              Last audit: {new Date(lastAuditAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grade & Score */}
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <Badge className={`${grade.color} text-lg px-4 py-2`}>
              {grade.icon} {grade.label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">{grade.description}</p>
          </motion.div>

          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Integrity Score</span>
              <span className="font-bold">{integrityScore}/100</span>
            </div>
            <Progress value={integrityScore} className="h-3" />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className={`text-2xl font-display font-bold ${fcrColors[fcrStatus]}`}>
              {fcr > 0 ? fcr.toFixed(2) : "—"}
            </p>
            <p className="text-xs text-muted-foreground">FCR</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className={`text-2xl font-display font-bold ${mortalityRate > 5 ? "text-destructive" : "text-success"}`}>
              {mortalityRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Mortality</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className={`text-2xl font-display font-bold ${dataCompleteness >= 80 ? "text-success" : "text-warning"}`}>
              {dataCompleteness}%
            </p>
            <p className="text-xs text-muted-foreground">Data Complete</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className={`text-2xl font-display font-bold ${photoCoverage >= 50 ? "text-success" : "text-warning"}`}>
              {photoCoverage}%
            </p>
            <p className="text-xs text-muted-foreground">Photo Coverage</p>
          </div>
        </div>

        {/* Anomaly Flags */}
        {anomalyFlags.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  {criticalFlags.length > 0 ? (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  ) : (
                    <Info className="w-4 h-4 text-warning" />
                  )}
                  {criticalFlags.length} Critical, {warningFlags.length} Warnings
                </span>
                <span className="text-xs">{isOpen ? "Hide" : "Show"} Details</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {criticalFlags.map((flag, idx) => (
                <div
                  key={`critical-${idx}`}
                  className="flex items-start gap-2 p-2 rounded-lg bg-destructive/10 text-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{flag.message}</span>
                </div>
              ))}
              {warningFlags.map((flag, idx) => (
                <div
                  key={`warning-${idx}`}
                  className="flex items-start gap-2 p-2 rounded-lg bg-warning/10 text-sm"
                >
                  <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span>{flag.message}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {anomalyFlags.length === 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success">
            <CheckCircle className="w-5 h-5" />
            <span>No anomalies detected</span>
          </div>
        )}

        {/* AI Summary */}
        {aiSummary && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs font-medium text-primary mb-1">AI Analysis</p>
            <p className="text-sm text-muted-foreground">{aiSummary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
