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
    <label className="field">
      <span className="field-label">{label}</span>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="field-select"
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

  const [result, setResult] = useState<{ compatible: boolean; issues: string[] } | null>(null);

  const handleChange = (field: string, value: string) => {
    setConfig({ ...config, [field]: Number(value) });
  };

  const handleCheck = async () => {
    const res = await fetch("http://localhost:8000/check-compatibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    setResult(data);


  }

  return (
    <main className="page">
      <div className="header">
        <h1 className="title">Configurateur PC FR</h1>
        <p className="description">Choisis tes composants pour construire ta configuration</p>
      </div>

      <div className="card">
        <div className="field-grid">
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
      <button type="button" className="compatibility-button" onClick={handleCheck}>
          Vérifier la config
      </button>
    </main>
  );




}
