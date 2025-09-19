'use client';
import { useState } from 'react';

export default function ChartTest() {
  const [out, setOut] = useState<any>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const save = async () => {
    const res = await fetch(`${API}/api/charts`, {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        birthDate: '1988-05-05',
        birthTime: '07:00',
        birthPlace: 'Köln',
      })
    });
    const data = await res.json();
    setOut(data);
  };

  const list = async () => {
    const res = await fetch(`${API}/api/charts`);
    setOut(await res.json());
  };

  return (
    <div style={{padding:20}}>
      <h2>API → DB Test</h2>
      <button onClick={save}>POST /api/charts</button>
      <button onClick={list} style={{marginLeft:8}}>GET /api/charts</button>
      <pre>{JSON.stringify(out, null, 2)}</pre>
    </div>
  );
}

