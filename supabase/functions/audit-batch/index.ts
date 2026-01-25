import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DailyLog {
  id: string;
  day_number: number;
  log_date: string;
  mortality_count: number | null;
  feed_consumed_kg: number | null;
  avg_weight_g: number | null;
}

interface EvidencePhoto {
  id: string;
  log_id: string;
  verification_status: string;
}

interface AnomalyFlag {
  type: "warning" | "critical";
  message: string;
  day_number?: number;
  field?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    // Client for auth validation
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client for updates
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub as string;
    const { batchId } = await req.json();

    if (!batchId) {
      return new Response(JSON.stringify({ error: "batchId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch batch with ownership check
    const { data: batch, error: batchError } = await supabaseAuth
      .from("batches")
      .select("*")
      .eq("id", batchId)
      .maybeSingle();

    if (batchError || !batch) {
      return new Response(JSON.stringify({ error: "Batch not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch daily logs
    const { data: logs, error: logsError } = await supabaseAuth
      .from("daily_logs")
      .select("*")
      .eq("batch_id", batchId)
      .order("day_number", { ascending: true });

    if (logsError) {
      throw new Error(`Failed to fetch logs: ${logsError.message}`);
    }

    const dailyLogs: DailyLog[] = logs || [];

    // Fetch evidence photos
    const logIds = dailyLogs.map((l) => l.id);
    let photos: EvidencePhoto[] = [];
    if (logIds.length > 0) {
      const { data: photoData } = await supabaseAuth
        .from("evidence_photos")
        .select("id, log_id, verification_status")
        .in("log_id", logIds);
      photos = photoData || [];
    }

    // Calculate metrics
    const totalFeedKg = dailyLogs.reduce((sum, l) => sum + (l.feed_consumed_kg || 0), 0);
    const totalMortality = dailyLogs.reduce((sum, l) => sum + (l.mortality_count || 0), 0);
    const currentCount = batch.initial_count - totalMortality;
    const mortalityRate = (totalMortality / batch.initial_count) * 100;

    // Calculate weight gain (latest avg weight - initial chick weight ~40g)
    const latestLog = dailyLogs[dailyLogs.length - 1];
    const latestAvgWeight = latestLog?.avg_weight_g || 40;
    const initialWeight = 40; // Day-old chick weight in grams
    const weightGainPerBird = (latestAvgWeight - initialWeight) / 1000; // Convert to kg
    const totalWeightGainKg = weightGainPerBird * currentCount;

    // Calculate FCR
    const fcr = totalWeightGainKg > 0 ? totalFeedKg / totalWeightGainKg : 0;

    // Calculate data completeness
    const expectedDays = batch.expected_maturity_days || 42;
    const daysSinceStart = Math.floor(
      (Date.now() - new Date(batch.start_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const expectedLogs = Math.min(daysSinceStart, expectedDays);
    const dataCompleteness = expectedLogs > 0 ? (dailyLogs.length / expectedLogs) * 100 : 100;

    // Calculate photo coverage
    const logsWithPhotos = new Set(photos.map((p) => p.log_id)).size;
    const photoCoverage = dailyLogs.length > 0 ? (logsWithPhotos / dailyLogs.length) * 100 : 0;

    // Detect basic anomalies
    const anomalyFlags: AnomalyFlag[] = [];

    // Check for weight loss
    for (let i = 1; i < dailyLogs.length; i++) {
      const prev = dailyLogs[i - 1].avg_weight_g || 0;
      const curr = dailyLogs[i].avg_weight_g || 0;
      if (curr < prev && prev > 0) {
        anomalyFlags.push({
          type: "warning",
          message: `Weight decreased from ${prev}g to ${curr}g`,
          day_number: dailyLogs[i].day_number,
          field: "avg_weight_g",
        });
      }
    }

    // Check for high mortality spikes
    for (const log of dailyLogs) {
      if (log.mortality_count && log.mortality_count > batch.initial_count * 0.05) {
        anomalyFlags.push({
          type: "critical",
          message: `High mortality: ${log.mortality_count} birds (>${5}% of initial count)`,
          day_number: log.day_number,
          field: "mortality_count",
        });
      }
    }

    // Check for missing data gaps
    const dayNumbers = new Set(dailyLogs.map((l) => l.day_number));
    for (let d = 1; d <= Math.min(daysSinceStart, expectedDays); d++) {
      if (!dayNumbers.has(d) && d > 0) {
        anomalyFlags.push({
          type: "warning",
          message: `Missing log for day ${d}`,
          day_number: d,
        });
      }
    }

    // AI-powered anomaly detection (if API key available)
    let aiAnalysis = null;
    if (lovableApiKey && dailyLogs.length >= 3) {
      try {
        const aiPrompt = `Analyze this poultry batch data for anomalies and suspicious patterns.

Batch: ${batch.breed}, ${batch.initial_count} birds, started ${batch.start_date}
Current Count: ${currentCount}
Mortality Rate: ${mortalityRate.toFixed(2)}%
FCR: ${fcr.toFixed(3)}

Daily Logs (day, mortality, feed_kg, avg_weight_g):
${dailyLogs
  .map((l) => `Day ${l.day_number}: ${l.mortality_count || 0}, ${l.feed_consumed_kg || 0}kg, ${l.avg_weight_g || 0}g`)
  .join("\n")}

Industry benchmarks for ${batch.breed}:
- Good FCR: <1.7, Average: 1.7-2.0, Poor: >2.0
- Expected mortality: <5%
- Expected weight at 42 days: 2500-3000g

Identify any:
1. Biologically impossible values
2. Suspicious patterns (data too perfect, sudden jumps)
3. Values outside normal ranges
4. Signs of data manipulation

Respond in JSON format:
{
  "risk_level": "low" | "medium" | "high",
  "flags": [{ "type": "warning" | "critical", "message": "description" }],
  "summary": "brief analysis"
}`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: "You are a poultry farming data analyst. Respond only with valid JSON." },
              { role: "user", content: aiPrompt },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "analyze_batch",
                  description: "Return anomaly analysis results",
                  parameters: {
                    type: "object",
                    properties: {
                      risk_level: { type: "string", enum: ["low", "medium", "high"] },
                      flags: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            type: { type: "string", enum: ["warning", "critical"] },
                            message: { type: "string" },
                          },
                          required: ["type", "message"],
                        },
                      },
                      summary: { type: "string" },
                    },
                    required: ["risk_level", "flags", "summary"],
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "analyze_batch" } },
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            aiAnalysis = JSON.parse(toolCall.function.arguments);
            // Add AI flags to anomaly list
            if (aiAnalysis.flags) {
              for (const flag of aiAnalysis.flags) {
                anomalyFlags.push({
                  type: flag.type,
                  message: `[AI] ${flag.message}`,
                });
              }
            }
          }
        }
      } catch (aiError) {
        console.error("AI analysis failed:", aiError);
      }
    }

    // Calculate integrity score
    const completenessScore = Math.min(dataCompleteness, 100) * 0.4;
    const anomalyScore = Math.max(0, 100 - anomalyFlags.filter((f) => f.type === "critical").length * 20 - anomalyFlags.filter((f) => f.type === "warning").length * 5) * 0.3;
    const photoScore = Math.min(photoCoverage, 100) * 0.3;
    const integrityScore = Math.round(completenessScore + anomalyScore + photoScore);

    // Determine stewardship grade
    let stewardshipGrade = "standard";
    const hasCriticalAnomalies = anomalyFlags.some((f) => f.type === "critical");

    if (integrityScore >= 85 && fcr < 1.7 && !hasCriticalAnomalies) {
      stewardshipGrade = "gold";
    } else if (integrityScore >= 70 || (fcr >= 1.7 && fcr <= 2.0)) {
      stewardshipGrade = "silver";
    }

    // Update batch with audit results
    const { error: updateError } = await supabaseAdmin
      .from("batches")
      .update({
        integrity_score: integrityScore,
        stewardship_grade: stewardshipGrade,
        total_feed_kg: totalFeedKg,
        total_weight_gain_kg: totalWeightGainKg,
        current_count: currentCount,
        anomaly_flags: anomalyFlags,
        last_audit_at: new Date().toISOString(),
      })
      .eq("id", batchId);

    if (updateError) {
      throw new Error(`Failed to update batch: ${updateError.message}`);
    }

    // Update FCR on latest log
    if (latestLog) {
      await supabaseAdmin
        .from("daily_logs")
        .update({ fcr_cumulative: fcr })
        .eq("id", latestLog.id);
    }

    const result = {
      success: true,
      batchId,
      metrics: {
        fcr: Math.round(fcr * 1000) / 1000,
        mortalityRate: Math.round(mortalityRate * 100) / 100,
        dataCompleteness: Math.round(dataCompleteness),
        photoCoverage: Math.round(photoCoverage),
        totalFeedKg,
        totalWeightGainKg: Math.round(totalWeightGainKg * 100) / 100,
        currentCount,
      },
      integrityScore,
      stewardshipGrade,
      anomalyFlags,
      aiAnalysis,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Audit error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Audit failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
