"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Link as LinkIcon, GitBranch, Zap, ShieldAlert, Shield } from 'lucide-react';
import ReportViewer from '@/components/ReportViewer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'repo'>('upload');
  const [isScanning, setIsScanning] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [strictMode, setStrictMode] = useState(false);

  const handleScan = async (type: 'file' | 'repo' | 'url', payload: any) => {
    setIsScanning(true);
    setError(null);
    setReportData(null);

    try {
      const endpoint = `http://localhost:8000/analyze/${type}`;
      let response;

      if (type === 'file') {
        const formData = new FormData();
        formData.append('file', payload);
        formData.append('strict', String(strictMode));
        response = await axios.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (type === 'repo') {
        response = await axios.post(endpoint, { repo_url: payload, strict: strictMode });
      } else {
        response = await axios.post(endpoint, { url: payload, strict: strictMode });
      }

      setReportData(response.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to analyze input. Make sure the FastAPI backend is running.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleScan('file', e.target.files[0]);
    }
  };

  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    if (activeTab === 'url') handleScan('url', inputValue);
    if (activeTab === 'repo') handleScan('repo', inputValue);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans selection:text-indigo-200 pb-20">

      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Output Validation</h1>
          </div>
          <p className="text-slate-400 max-w-2xl text-lg">
            Deeply analyze and validate codebases, live websites, and raw code snippets across 10 dimensions of software architecture quality.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-8 space-y-6">

        {/* Strict Mode Banner */}
        <div
          onClick={() => setStrictMode((prev) => !prev)}
          role="button"
          aria-pressed={strictMode}
          className={`cursor-pointer flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 select-none ${
            strictMode
              ? 'bg-rose-500/10 border-rose-500/50 shadow-lg shadow-rose-500/10'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              strictMode ? 'bg-rose-500/20' : 'bg-slate-800'
            }`}>
              {strictMode
                ? <ShieldAlert className="w-5 h-5 text-rose-400" />
                : <Shield className="w-5 h-5 text-slate-400" />
              }
            </div>
            <div>
              <p className={`font-bold text-sm ${strictMode ? 'text-rose-300' : 'text-slate-300'}`}>
                {strictMode ? '🔴 STRICT MODE — FAANG-Level Brutal Review' : '🟢 Normal Mode — Thorough Review'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {strictMode
                  ? 'Zero tolerance for anti-patterns. No sugarcoating. Every issue flagged and scored precisely.'
                  : 'Click to enable Strict Mode for a merciless, FAANG-level code audit.'}
              </p>
            </div>
          </div>
          {/* Toggle pill */}
          <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
            strictMode ? 'bg-rose-500' : 'bg-slate-700'
          }`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
              strictMode ? 'left-7' : 'left-1'
            }`} />
          </div>
        </div>

        {/* Input Controller */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-800 bg-slate-900/80">
            {[
              { id: 'upload', icon: <UploadCloud className="w-4 h-4" />, label: 'Upload Files' },
              { id: 'repo',   icon: <GitBranch className="w-4 h-4" />,   label: 'GitHub Repo' },
              { id: 'url',    icon: <LinkIcon className="w-4 h-4" />,     label: 'Live URL' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'upload' && (
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-950/50 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer group transition-all">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Drag &amp; Drop code files</h3>
                <p className="text-slate-500 text-sm">or click to browse your computer</p>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}

            {(activeTab === 'repo' || activeTab === 'url') && (
              <form onSubmit={handleTextInputSubmit} className="flex gap-4">
                <label htmlFor="url-input" className="sr-only">
                  {activeTab === 'repo' ? 'GitHub Repository URL' : 'Live Website URL'}
                </label>
                <input
                  id="url-input"
                  type="text"
                  placeholder={activeTab === 'repo' ? 'https://github.com/user/repo' : 'https://example.com'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder:text-slate-600 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputValue || isScanning}
                  className={`px-8 py-4 rounded-xl font-semibold transition-colors whitespace-nowrap shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    strictMode
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                  } text-white`}
                >
                  {isScanning ? 'Scanning...' : strictMode ? '⚡ Strict Scan' : 'Analyze Now'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isScanning && (
          <div className="mt-4 flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-3xl">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-6 ${
              strictMode
                ? 'border-rose-500/30 border-t-rose-500'
                : 'border-indigo-500/30 border-t-indigo-500'
            }`} />
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              {strictMode ? '☠️ Brutal FAANG Review in Progress...' : 'Analyzing Intelligently...'}
            </h3>
            <p className="text-slate-400 text-center max-w-sm">
              {strictMode
                ? 'Llama3 is tearing through every anti-pattern, crash vector, and accessibility failure.'
                : 'Ollama is evaluating dimensions, checking security, and preparing the improvement plan.'}
            </p>
          </div>
        )}

        {/* Results */}
        {!isScanning && (reportData || error) && (
          <ReportViewer data={reportData} error={error} strictMode={strictMode} />
        )}
      </main>
    </div>
  );
}
