"use client";

import { useEffect, useState } from "react";

interface Cpu {
  id: number;
  name: string;
  brand: string;
  socket: string;
  tdp: number;
}

export default function Home() {
  const [cpus, setCpus] = useState<Cpu[]>([]);

useEffect(() => {
  fetch("http://localhost:8000/components/cpus")
    .then((res) => res.json())
    .then((data) => setCpus(data));
}, []);

return (
  <main className="page">
    <h1 className="title">Configurateur PC FR</h1>
    <div className="cpu-list">
    {cpus.map((cpu) => (
          <div key={cpu.id} className="cpu-card">
            <div>
              <p className="cpu-name">{cpu.name}</p>
              <p className="cpu-brand">{cpu.brand}</p>
            </div>
            <span>{cpu.socket} — {cpu.tdp}W</span>
          </div>
        ))}
    </div>
    </main>
  );
}

