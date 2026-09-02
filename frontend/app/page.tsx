"use client";

import { useEffect, useState } from "react";

interface Component {
  id: number;
  name: string;
  [key: string]: unknown;
}

function Field({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  options: Component[];
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm transition-colors hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <option value="0">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Home() {
  const [cpus, setCpus] = useState<Component[]>([]);
  const [motherboards, setMotherboards] = useState<Component[]>([]);
  const [rams, setRams] = useState<Component[]>([]);
  const [gpus, setGpus] = useState<Component[]>([]);
  const [psus, setPsus] = useState<Component[]>([]);
  const [cases, setCases] = useState<Component[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/components/cpus")
      .then((res) => res.json())
      .then((data) => setCpus(data));
    fetch("http://localhost:8000/components/motherboards")
      .then((res) => res.json())
      .then((data) => setMotherboards(data));
    fetch("http://localhost:8000/components/rams")
      .then((res) => res.json())
      .then((data) => setRams(data));
    fetch("http://localhost:8000/components/gpus")
      .then((res) => res.json())
      .then((data) => setGpus(data));
    fetch("http://localhost:8000/components/psus")
      .then((res) => res.json())
      .then((data) => setPsus(data));
    fetch("http://localhost:8000/components/cases")
      .then((res) => res.json())
      .then((data) => setCases(data));
  }, []);

  const [config, setConfig] = useState({
    cpu_id: 0,
    motherboard_id: 0,
    ram_id: 0,
    gpu_id: 0,
    psu_id: 0,
    case_id: 0,
  });

  const handleChange = (field: string, value: string) => {
    setConfig({ ...config, [field]: Number(value) });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center gap-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Configurateur PC FR</h1>
        <p className="mt-2 text-slate-500">Choisis tes composants pour construire ta configuration</p>
      </div>

      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field
            label="Processeur (CPU)"
            value={config.cpu_id}
            onChange={(v) => handleChange("cpu_id", v)}
            options={cpus}
            placeholder="Sélectionnez un CPU"
          />
          <Field
            label="Carte mère"
            value={config.motherboard_id}
            onChange={(v) => handleChange("motherboard_id", v)}
            options={motherboards}
            placeholder="Sélectionnez une carte mère"
          />
          <Field
            label="Mémoire (RAM)"
            value={config.ram_id}
            onChange={(v) => handleChange("ram_id", v)}
            options={rams}
            placeholder="Sélectionnez une RAM"
          />
          <Field
            label="Carte graphique (GPU)"
            value={config.gpu_id}
            onChange={(v) => handleChange("gpu_id", v)}
            options={gpus}
            placeholder="Sélectionnez une GPU"
          />
          <Field
            label="Alimentation (PSU)"
            value={config.psu_id}
            onChange={(v) => handleChange("psu_id", v)}
            options={psus}
            placeholder="Sélectionnez un PSU"
          />
          <Field
            label="Boîtier"
            value={config.case_id}
            onChange={(v) => handleChange("case_id", v)}
            options={cases}
            placeholder="Sélectionnez un boîtier"
          />
        </div>
      </div>
    </main>
  );
}
