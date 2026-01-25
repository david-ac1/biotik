import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PhotoAnalysis {
  photo_type: "flock" | "feed_bag" | "environment";
  estimated_count?: number;
  health_score?: number;
  feed_brand?: string;
  feed_type?: string;
  environment_score?: number;
  observations: string[];
  red_flags: string[];
  confidence: number;
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

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { photoId } = await req.json();

    if (!photoId) {
      return new Response(JSON.stringify({ error: "photoId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch photo with ownership check via RLS
    const { data: photo, error: photoError } = await supabaseAuth
      .from("evidence_photos")
      .select(`
        *,
        daily_logs!inner (
          batch_id,
          day_number,
          batches!inner (
            breed,
            initial_count,
            current_count
          )
        )
      `)
      .eq("id", photoId)
      .maybeSingle();

    if (photoError || !photo) {
      return new Response(JSON.stringify({ error: "Photo not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const batch = photo.daily_logs.batches;
    const dayNumber = photo.daily_logs.day_number;

    // Build prompt based on photo type
    let analysisPrompt = "";
    const photoType = photo.photo_type as "flock" | "feed_bag" | "environment";

    if (photoType === "flock") {
      analysisPrompt = `Analyze this poultry flock photo for a ${batch.breed} batch on day ${dayNumber}.
Expected bird count: approximately ${batch.current_count || batch.initial_count} birds.

Evaluate:
1. Estimate visible bird count (if partially visible, extrapolate)
2. Health indicators (feather condition, activity level, uniformity)
3. Crowding/density assessment
4. Any visible health issues (lethargy, abnormal posture, lesions)
5. Signs of the photo being fake, AI-generated, or reused`;
    } else if (photoType === "feed_bag") {
      analysisPrompt = `Analyze this feed bag photo for authenticity verification.

Evaluate:
1. Read and extract the feed brand name
2. Identify feed type (starter, grower, finisher)
3. Check for visible nutritional information
4. Assess if the bag appears fresh/recently opened
5. Signs of the photo being fake, manipulated, or stock image`;
    } else {
      analysisPrompt = `Analyze this poultry house environment photo.

Evaluate:
1. Housing condition (cleanliness, ventilation, lighting)
2. Bedding/litter quality
3. Feeder and waterer visibility and condition
4. Temperature/humidity indicators if visible
5. Overall biosecurity assessment
6. Signs of the photo being fake or not from a real farm`;
    }

    // Call Gemini Vision API
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: "You are a poultry farming expert analyzing evidence photos for verification. Be thorough but concise.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              { type: "image_url", image_url: { url: photo.photo_url } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_analysis",
              description: "Submit the photo analysis results",
              parameters: {
                type: "object",
                properties: {
                  estimated_count: {
                    type: "number",
                    description: "Estimated bird count (for flock photos only)",
                  },
                  health_score: {
                    type: "number",
                    description: "Health score 0-1 (for flock photos)",
                  },
                  feed_brand: {
                    type: "string",
                    description: "Feed brand name (for feed bag photos)",
                  },
                  feed_type: {
                    type: "string",
                    description: "Feed type: starter, grower, or finisher",
                  },
                  environment_score: {
                    type: "number",
                    description: "Environment quality score 0-1 (for environment photos)",
                  },
                  observations: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of positive observations",
                  },
                  red_flags: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of concerns or issues detected",
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence in analysis 0-1",
                  },
                  is_authentic: {
                    type: "boolean",
                    description: "Whether the photo appears genuine",
                  },
                },
                required: ["observations", "red_flags", "confidence", "is_authentic"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_analysis" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid AI response format");
    }

    const analysis: PhotoAnalysis & { is_authentic: boolean } = JSON.parse(toolCall.function.arguments);
    analysis.photo_type = photoType;

    // Determine verification status
    let verificationStatus = "verified";
    if (!analysis.is_authentic) {
      verificationStatus = "rejected";
    } else if (analysis.red_flags && analysis.red_flags.length > 0) {
      verificationStatus = "flagged";
    } else if (analysis.confidence < 0.7) {
      verificationStatus = "pending";
    }

    // Update photo record
    const { error: updateError } = await supabaseAdmin
      .from("evidence_photos")
      .update({
        ai_analysis: analysis,
        verification_status: verificationStatus,
      })
      .eq("id", photoId);

    if (updateError) {
      throw new Error(`Failed to update photo: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        photoId,
        analysis,
        verificationStatus,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Photo analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
