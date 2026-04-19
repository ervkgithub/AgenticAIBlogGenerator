"use client";

import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Issue {
  category: string;
  severity: string;
  description: string;
  impact: string;
  code_reference: string;
  fix: string;
}

interface ReportData {
  overall_score: string;
  summary: string;
  score_breakdown: Record<string, unknown>;
  issues: Issue[];
  improvement_plan: unknown[];
  best_practices_missing: unknown[];
}

interface ReportViewerProps {
  data: ReportData | null;
  error: string | null;
  strictMode?: boolean;
}

// ──────────────────────────────────────────────
// Safe renderer – converts ANY value into a safe
// renderable string so React never crashes on
// LLM hallucinations (e.g. nested objects).
// ──────────────────────────────────────────────
function safeString(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) return val.map(safeString).join(' | ');
  if (typeof val === 'object') {
    // LLM sometimes returns { step1: "...", step2: "..." } — flatten values
    return Object.values(val as Record<string, unknown>).map(safeString).join(' → ');
  }
  return String(val);
}

const getScoreStyles = (score: string) => {
  const normalized = score.toLowerCase().trim();
  switch (normalized) {
    case 'excellent': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'good':      return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'average':   return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'poor':      return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    default:          return 'text-slate-400 bg-slate-800/50 border-slate-700';
  }
};

const getSeverityStyles = (severity: string) => {
  const norm = severity?.toLowerCase() ?? '';
  if (norm === 'critical') return 'text-rose-300 bg-rose-500/10 border-rose-500/30';
  if (norm === 'high')     return 'text-orange-300 bg-orange-500/10 border-orange-500/30';
  if (norm === 'medium')   return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
  return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
};

const getSeverityIcon = (severity: string) => {
  const norm = severity?.toLowerCase() ?? '';
  if (norm === 'critical') return <ShieldAlert className="w-5 h-5 text-rose-500" />;
  if (norm === 'high')     return <AlertTriangle className="w-5 h-5 text-orange-500" />;
  if (norm === 'medium')   return <AlertCircle className="w-5 h-5 text-amber-500" />;
  return <Info className="w-5 h-5 text-blue-500" />;
};

// ─────────────────────────────────────────────────────────
// Normalise issues array — LLM sometimes wraps them in an
// outer object: { "issues": [...] } instead of a plain array
// ─────────────────────────────────────────────────────────
function normaliseIssues(raw: unknown): Issue[] {
  if (Array.isArray(raw)) return raw as Issue[];
  if (raw && typeof raw === 'object') {
    const vals = Object.values(raw as Record<string, unknown>);
    if (Array.isArray(vals[0])) return vals[0] as Issue[];
    return vals as Issue[];
  }
  return [];
}

export default function ReportViewer({ data, error, strictMode = false }: ReportViewerProps) {
  if (error) {
    return (
      <div className="w-full p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-red-500 font-semibold text-lg">Analysis Error</h3>
          <p className="text-red-400/90 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const issues = normaliseIssues(data.issues);
  const planItems: unknown[] = Array.isArray(data.improvement_plan) ? data.improvement_plan : [];
  const practices: unknown[] = Array.isArray(data.best_practices_missing) ? data.best_practices_missing : [];

  return (
    <div className="w-full space-y-8 text-slate-200">

      {/* ── Header & Grade ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-bold text-white tracking-tight">Analysis Report</h2>
            {strictMode && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30">
                ☠️ FAANG Strict
              </span>
            )}
          </div>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">{safeString(data.summary)}</p>
        </div>

        <div className={`flex flex-col items-center justify-center p-6 min-w-[180px] border rounded-2xl ${getScoreStyles(safeString(data.overall_score))}`}>
          <span className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Overall Grade</span>
          <span className="text-4xl font-extrabold tracking-tight">{safeString(data.overall_score)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Score Breakdown ── */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Score Breakdown
          </h3>
          {Object.entries(data.score_breakdown || {}).map(([key, val]) => (
            <div key={key} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="text-slate-200 text-sm">{safeString(val)}</span>
            </div>
          ))}
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Issues */}
          {issues.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">
                Identified Issues
                <span className="ml-2 text-sm font-normal text-slate-500">({issues.length})</span>
              </h3>
              <div className="grid gap-4">
                {issues.map((issue, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex-shrink-0">{getSeverityIcon(safeString(issue.severity))}</div>
                      <div className="space-y-2 w-full min-w-0">

                        {/* Top row: category + severity badge + code ref */}
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 text-xs font-bold rounded uppercase tracking-wider">
                            {safeString(issue.category)}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${getSeverityStyles(safeString(issue.severity))}`}>
                            {safeString(issue.severity)}
                          </span>
                          {issue.code_reference && safeString(issue.code_reference) !== 'N/A' && (
                            <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded ml-auto">
                              {safeString(issue.code_reference)}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-semibold text-slate-100">{safeString(issue.description)}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          <span className="text-slate-300 font-medium">Impact: </span>
                          {safeString(issue.impact)}
                        </p>

                        {issue.fix && (
                          <div className="mt-3 pt-3 border-t border-slate-800">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">Recommended Fix</span>
                            <pre className="bg-slate-950 p-4 rounded-xl text-sm border border-slate-800/80 overflow-x-auto text-emerald-300/90 whitespace-pre-wrap break-words">
                              <code>{safeString(issue.fix)}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Plan */}
          {planItems.length > 0 && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-indigo-400 mb-6">Improvement Plan</h3>
              <ul className="space-y-4">
                {planItems.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{safeString(step)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Best Practices */}
          {practices.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">Missing Best Practices</h3>
              <ul className="space-y-2">
                {practices.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-400 text-sm leading-relaxed">
                    <span className="text-rose-400 mt-1 flex-shrink-0">✗</span>
                    {safeString(p)}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
