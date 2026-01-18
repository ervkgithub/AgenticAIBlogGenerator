
'use client';
import { useState } from 'react';

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
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>Agentic AI – LinkedIn Blog Generator</h1>
      <button onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Blog'}
      </button>

      {error && (
        <div style={{ marginTop: 30, color: 'crimson' }}>{error}</div>
      )}

      {data && (
        <div style={{ marginTop: 30 }}>
          <h2>{data.topic}</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{data.blog}</pre>
          <h3>Cover Image Prompt</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{data.imagePrompt}</pre>
        </div>
      )}
    </main>
  );
}
