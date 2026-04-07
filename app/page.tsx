
'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok) {
        let msg = 'Request failed';
        if (ct.includes('application/json')) {
          const errJson = await res.json();
          msg = errJson?.error ?? msg;
        } else {
          const text = await res.text();
          msg = text || msg;
        }
        setData(null);
        setError(msg);
        return;
      }
      if (ct.includes('application/json')) {
        setData(await res.json());
      } else {
        setData(null);
        setError('Unexpected response format');
      }
    } catch (e: any) {
      setData(null);
      setError(e?.message ?? 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header>
        <h1 className="title">Agentic AI</h1>
        <p className="subtitle">LinkedIn Blog Generator</p>
      </header>
      
      <div className="card">
        <div className="btn-container">
          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div> Generating...
              </>
            ) : (
              <>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Generate Blog
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {data && (
          <div className="result-section">
            <div className="result-card">
              <span className="section-label">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Generated Title
              </span>
              <h2 className="topic-title">{data.topic}</h2>
              
              <span className="section-label" style={{ marginTop: '2rem' }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                Blog Content
              </span>
              <div className="blog-content">
                <ReactMarkdown>{data.blog}</ReactMarkdown>
              </div>
            </div>

            <div className="result-card">
              <span className="section-label">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Cover Image Prompt
              </span>
              <div className="image-prompt">{data.imagePrompt}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
