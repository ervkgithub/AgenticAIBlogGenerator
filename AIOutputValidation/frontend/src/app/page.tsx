"use client";

import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { UploadCloud, Link as LinkIcon, GitBranch, Zap, ShieldAlert, Shield, FileCode, X, Trash2, CheckCircle2 } from 'lucide-react';
import ReportViewer from '@/components/ReportViewer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'repo'>('upload');
  const [isScanning, setIsScanning] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [strictMode, setStrictMode] = useState(false);
  
  // New state for multi-file support
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // File Handlers
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (activeTab !== 'upload') setActiveTab('upload');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleScan = async (type: 'file' | 'repo' | 'url', payload?: any) => {
    setIsScanning(true);
    setError(null);
    setReportData(null);

    try {
      const endpoint = `http://localhost:8000/analyze/${type}`;
      let response;

      if (type === 'file') {
        if (selectedFiles.length === 0) throw new Error("No files selected");
        
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
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
        err?.response?.data?.detail ||
        err.message ||
        'Failed to analyze input. Make sure the FastAPI backend is running.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    if (activeTab === 'url') handleScan('url', inputValue);
    if (activeTab === 'repo') handleScan('repo', inputValue);
  };

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans selection:text-indigo-200 pb-20"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

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
              <div className="space-y-6">
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-300 ${
                    isDragging 
                      ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
                      : 'border-slate-700 hover:border-indigo-500/50 bg-slate-950/50'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      onChange={(e) => handleFiles(e.target.files)} 
                    />
                  </label>
                  
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                    isDragging ? 'bg-indigo-500/30 scale-110' : 'bg-slate-800'
                  }`}>
                    <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-indigo-400' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">
                    {isDragging ? 'Drop those files!' : 'Drag & Drop code files'}
                  </h3>
                  <p className="text-slate-500 text-sm">or click to browse your computer</p>
                </div>

                {/* File Preview List */}
                {selectedFiles.length > 0 && (
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileCode className="w-4 h-4" /> Selected Files ({selectedFiles.length})
                      </h4>
                      <button 
                        onClick={clearFiles}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear All
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-xl group hover:border-slate-700 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                              <FileCode className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-200 line-clamp-1">{file.name}</p>
                              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFile(idx)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleScan('file')}
                      disabled={isScanning}
                      className={`w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all shadow-lg ${
                        strictMode 
                          ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20' 
                          : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
                      }`}
                    >
                      {isScanning ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          {strictMode ? '☠️ Start Strict FAANG Audit' : '🚀 Start Analysis'}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
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
        {isScanning && activeTab !== 'upload' && (
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
