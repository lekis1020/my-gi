"use client";

import { useState } from "react";
import { ExternalLink, FlaskConical, Calendar, Building2 } from "lucide-react";
import { useClinicalTrials } from "@/hooks/use-clinical-trials";
import { TRIAL_MONITOR_AREAS } from "@/lib/clinical-trials/monitor";
import type { ClinicalTrialStudySummary } from "@/lib/clinical-trials/monitor";

interface ClinicalTrialMonitorPanelProps {
  onSelectStudy?: (relatedQuery: string, title: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  RECRUITING: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  ACTIVE_NOT_RECRUITING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  ENROLLING_BY_INVITATION: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  NOT_YET_RECRUITING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const TAB_COLORS: Record<string, string> = {
  pipeline: "border-teal-500 text-teal-700 dark:text-teal-300",
  ibd: "border-red-500 text-red-700 dark:text-red-300",
  colorectal_cancer: "border-rose-500 text-rose-700 dark:text-rose-300",
  hepatology: "border-violet-500 text-violet-700 dark:text-violet-300",
  pancreatitis: "border-orange-500 text-orange-700 dark:text-orange-300",
  gerd: "border-amber-500 text-amber-700 dark:text-amber-300",
  gi_oncology: "border-pink-500 text-pink-700 dark:text-pink-300",
  functional_gi: "border-cyan-500 text-cyan-700 dark:text-cyan-300",
  endoscopy: "border-blue-500 text-blue-700 dark:text-blue-300",
  celiac: "border-green-500 text-green-700 dark:text-green-300",
  gi_bleeding: "border-red-600 text-red-800 dark:text-red-200",
};

export function ClinicalTrialMonitorPanel({ onSelectStudy }: ClinicalTrialMonitorPanelProps) {
  const { areas, studies, isLoading, error } = useClinicalTrials();
  const [activeTab, setActiveTab] = useState("pipeline");

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-2 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Failed to load clinical trial data.
      </div>
    );
  }

  const tabs = [
    { id: "pipeline", label: "Pipeline" },
    ...TRIAL_MONITOR_AREAS.map((a) => ({ id: a.id, label: a.label })),
  ];

  const filteredStudies =
    activeTab === "pipeline"
      ? studies.sort((a, b) => b.pipelineScore - a.pipelineScore)
      : studies.filter((s) => s.focusAreaIds.includes(activeTab));

  const activeArea = areas.find((a) => a.id === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 px-4 dark:border-gray-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const colorClass = TAB_COLORS[tab.id] ?? "border-gray-500 text-gray-700 dark:text-gray-300";
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                isActive
                  ? colorClass
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab description */}
      <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800">
        {activeTab === "pipeline" ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Candidate drugs, biologics, and targeted therapies prioritized first.
          </p>
        ) : activeArea ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {activeArea.totalCount.toLocaleString()} ongoing trials for{" "}
            <span className="font-medium">{activeArea.label}</span>
          </p>
        ) : null}
      </div>

      {/* Study list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredStudies.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No studies found for this category.
          </p>
        )}
        {filteredStudies.map((study) => (
          <StudyCard key={study.nctId} study={study} onSelectStudy={onSelectStudy} />
        ))}
      </div>
    </div>
  );
}

function StudyCard({
  study,
  onSelectStudy,
}: {
  study: ClinicalTrialStudySummary;
  onSelectStudy?: (relatedQuery: string, title: string) => void;
}) {
  const statusColor = STATUS_COLORS[study.status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <div className="space-y-2 px-4 py-3">
      {/* Status + Phase badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor}`}>
          {study.statusLabel}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {study.phaseLabel}
        </span>
        {study.focusAreaLabels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Title */}
      <p className="text-sm font-medium leading-snug text-gray-900 dark:text-gray-100">
        {study.title}
      </p>

      {/* NCT + Sponsor */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-mono">{study.nctId}</span>
        {study.sponsor && (
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {study.sponsor}
          </span>
        )}
        {study.lastUpdated && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {study.lastUpdated}
          </span>
        )}
      </div>

      {/* Interventions */}
      {study.interventions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {study.interventions.map((intervention) => (
            <span
              key={intervention}
              className="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              {intervention}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      {study.progressPercent !== null && (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-teal-500 transition-all"
              style={{ width: `${study.progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {study.progressLabel}
            {study.targetDate && (
              <> &middot; {study.targetDateLabel}: {study.targetDate}</>
            )}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {onSelectStudy && (
          <button
            onClick={() => onSelectStudy(study.relatedQuery, study.title)}
            className="flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
          >
            <FlaskConical className="h-3 w-3" />
            Related Papers
          </button>
        )}
        <a
          href={study.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ExternalLink className="h-3 w-3" />
          View Trial
        </a>
      </div>
    </div>
  );
}
