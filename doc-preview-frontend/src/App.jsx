// src/App.jsx
import React, { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setError('Select a file first');
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);

      // Use 127.0.0.1 to avoid potential localhost resolution issues
      const resp = await fetch('http://127.0.0.1:4000/upload', {
        method: 'POST',
        body: form
      });

      console.log('HTTP status:', resp.status);
      const json = await resp.json().catch(() => null);
      console.log('API response:', json);

      if (!resp.ok) {
        throw new Error((json && json.error) || `Upload failed (status ${resp.status})`);
      }

      setResult(json);
    } catch (err) {
      console.error('Upload error:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={h}>Document Upload & Preview</h1>

        <form onSubmit={handleUpload} style={form}>
          {/* Hidden native input */}
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => {
              setFile(e.target.files[0] || null);
              setResult(null);
              setError(null);
            }}
            style={{ display: 'none' }}
          />

          {/* Visible file bar (label triggers the hidden input) */}
          <label htmlFor="fileInput" style={fileBar}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
              {file ? file.name : 'Choose a file... (PDF or DOCX)'}
            </span>
            <span style={{ marginLeft: 12, fontSize: 13, color: '#2563eb', fontWeight: 600 }}>
              Browse
            </span>
          </label>

          <button type="submit" style={btn} disabled={!file || loading}>
            {loading ? 'Uploading…' : 'Upload & Preview'}
          </button>
        </form>

        {error && <div style={errorStyle}>{error}</div>}

        {result && (
          <div style={preview}>
            <h2 style={sub}>Preview</h2>
            <div><strong>Filename:</strong> {result.filename}</div>
            <div><strong>Pages:</strong> {result.pages}</div>
            <div style={{ marginTop: 12 }}>
              <strong>Headings</strong>
              {result.headings && result.headings.length > 0 ? (
                <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 1.6 }}>
                  {result.headings.map((hText, i) => <li key={i}>{hText}</li>)}
                </ul>
              ) : (
                <div style={{ marginTop: 8, fontStyle: 'italic' }}>No headings detected</div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: 18, color: '#6b7280', fontSize: 14 }}>
          Supports PDF and DOCX. DOCX page count is estimated by word count.
        </div>
      </div>
    </div>
  );
}

/* ------------------ Styles (objects) ------------------ */

const page = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center', // center horizontally
  alignItems: 'flex-start', // set to 'center' if you want vertical centering
  background: '#ffffff',
  paddingTop: 60,
  paddingLeft: 20,
  paddingRight: 20,
  boxSizing: 'border-box'
};

const card = {
  width: '100%',
  maxWidth: '920px',
  background: '#fff',
  padding: 32,
  borderRadius: 12,
  boxShadow: '0 12px 40px rgba(2,6,23,0.08)',
  boxSizing: 'border-box',
  justifyContent: 'center'
};

const h = {
  margin: 0,
  marginBottom: 18,
  fontSize: 32,
  fontWeight: 800,
  color: '#0b1220',
  textAlign: 'center'
};

const form = {
  display: 'flex',
  gap: 16,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
  flexWrap: 'wrap'
};

const fileBar = {
  padding: '12px 16px',
  minWidth: '340px',
  maxWidth: '720px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  background: '#fff',
  cursor: 'pointer',
  color: '#374151',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const btn = {
  padding: '12px 18px',
  borderRadius: 10,
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 16,
  minWidth: 180
};

const preview = {
  marginTop: 18,
  padding: 18,
  background: '#fbfdff',
  borderRadius: 8,
  border: '1px solid #eef2ff',
  color: '#0b1220'
};

const sub = {
  margin: 0,
  marginBottom: 8,
  fontSize: 18,
  color: '#0b1220'
};

const errorStyle = { color: '#b00020', marginTop: 8 };
