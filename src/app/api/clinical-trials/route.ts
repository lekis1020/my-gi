import { NextResponse } from "next/server";
import {
  TRIAL_MONITOR_AREAS,
  ONGOING_STATUSES,
  buildClinicalTrialsGovUrl,
  parseClinicalTrialsGovResponse,
  mergeAreaStudies,
  type ClinicalTrialMonitorResponse,
  type ParsedAreaResult,
} from "@/lib/clinical-trials/monitor";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: ParsedAreaResult[] = [];
  const missingAreas: string[] = [];

  const settled = await Promise.allSettled(
    TRIAL_MONITOR_AREAS.map(async (area) => {
      const url = buildClinicalTrialsGovUrl(area.query);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`ClinicalTrials.gov returned ${response.status} for ${area.id}`);
      }

      const payload = await response.json();
      return parseClinicalTrialsGovResponse(area, payload);
    }),
  );

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === "fulfilled") {
      results.push(result.value);
    } else {
      missingAreas.push(TRIAL_MONITOR_AREAS[i].id);
    }
  }

  if (results.length === 0) {
    return NextResponse.json(
      { error: "Failed to fetch clinical trials data" },
      { status: 502 },
    );
  }

  const body: ClinicalTrialMonitorResponse = {
    source: "clinicaltrials.gov",
    trackedAt: new Date().toISOString(),
    monitoredStatuses: [...ONGOING_STATUSES],
    areas: results.map((r) => r.area),
    studies: mergeAreaStudies(results),
    partial: missingAreas.length > 0,
    missingAreas,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200",
    },
  });
}
