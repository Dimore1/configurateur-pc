"use client";

import { useEffect, useState } from "react";

interface Component {
  id: number;
  name: string;
  [key: string]: unknown;
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

const [config,setConfig] = useState({
  cpu_id: 0,
  motherboard_id: 0,
  ram_id: 0,
  gpu_id: 0,
  psu_id: 0,
  case_id: 0,
})

const handleChange = (field: string, value: string) => {
  setConfig({...config, [field]: Number(value) })
}

return (
  <main className="page">
    <h1 className="title">Configurateur PC FR</h1>

    <select onChange={(e) => handleChange("cpu_id", e.target.value)}>
      <option value="0">Sélectionnez un CPU</option>
      {cpus.map((cpu) => (
        <option key={cpu.id} value={cpu.id}>{cpu.name}</option>
      ))}
    </select> 

    <select onChange={(e) => handleChange("motherboard_id", e.target.value)}>
      <option value="0">Sélectionnez une carte mère</option>
      {motherboards.map((motherboard) => (
        <option key={motherboard.id} value={motherboard.id}>{motherboard.name}</option>
      ))} 
    </select>

    <select onChange={(e) => handleChange("ram_id", e.target.value)}>
      <option value="0">Sélectionnez une RAM</option>
      {rams.map((ram) => (
        <option key={ram.id} value={ram.id}>{ram.name}</option>
      ))}
    </select>

    <select onChange={(e) => handleChange("gpu_id", e.target.value)}>
      <option value="0">Sélectionnez une GPU</option>
      {gpus.map((gpu) => (
        <option key={gpu.id} value={gpu.id}>{gpu.name}</option>
      ))}
    </select>

    <select onChange={(e) => handleChange("psu_id", e.target.value)}>
      <option value="0">Sélectionnez un PSU</option>
      {psus.map((psu) => (
        <option key={psu.id} value={psu.id}>{psu.name}</option>
      ))}
    </select>

    <select onChange={(e) => handleChange("case_id", e.target.value)}>
      <option value="0">Sélectionnez un boîtier</option>
      {cases.map((pcCase) => (
        <option key={pcCase.id} value={pcCase.id}>{pcCase.name}</option>
      ))}
    </select>

  </main>
  );
}

