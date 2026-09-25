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
  isOptionDisabled = () => false
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  options: Component[];
  placeholder: string;
  isOptionDisabled? :  (option: Component) => boolean
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
          <option key={opt.id} value={opt.id} disabled={isOptionDisabled(opt)}>
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


  const unequalSocket = (a : Component, b : Component) => {
    return a.socket !== b.socket;
  }

  const unequalRamType = (mb : Component, ram : Component) => {
    return !(mb.ram_type as string).split(",").includes(ram.type as string);
  }

  const unequalFormat = (mb: Component, pc_case : Component) => {
    return !(pc_case.supported_formats as string).split(",").includes(mb.format as string);
  }

  const aGpuTooLong = (gpu: Component, pc_case: Component) => {
    return (gpu.length_mm as number) > (pc_case.max_gpu_length_mm as number);
  }

  const PSU_MARGIN = 150;

  const notEnoughWattage = (psu: Component, cpu: Component, gpu: Component) => {
    const needed = (cpu.tdp as number) + (gpu.tdp as number) + PSU_MARGIN;
    return (psu.wattage as number) < needed;
  }

  const selectedCpu = cpus.find((cpu) => cpu.id === config.cpu_id);
  const selectedMb = motherboards.find((motherboard) => motherboard.id === config.motherboard_id);
  const selectedRam = rams.find((ram) => ram.id === config.ram_id);
  const selectedCase = cases.find((pc_case) => pc_case.id === config.case_id);
  const selectedGpu = gpus.find((gpu) => gpu.id === config.gpu_id);
  const selectedPsu = psus.find((psu) => psu.id === config.psu_id);

  const isMotherboardDisabled = (motherboard : Component) => {
      for(let couple of [[selectedCpu,unequalSocket], [selectedRam,unequalRamType], [selectedCase, unequalFormat]]){
        let component = couple[0] as Component;
        const fn = couple[1] as (a: Component, b: Component) => boolean;
        if(component !== undefined && fn(motherboard,component)){
          return true;
        }
      }
      return false;
  }

  const isCpuDisabled = (cpu : Component) => {
      if (selectedMb !== undefined && unequalSocket(cpu, selectedMb)) {
        return true;
      }
      if (selectedPsu !== undefined && selectedGpu !== undefined && notEnoughWattage(selectedPsu, cpu, selectedGpu)) {
        return true;
      }
      return false;
  }

  const isRamDisabled = (ram : Component) => {
    if (selectedMb === undefined){
      return false;
    }
    return unequalRamType(selectedMb, ram);
  }

  const isCaseDisabled = (pc_case: Component) => {
    for(let couple of [[selectedMb, unequalFormat], [selectedGpu, aGpuTooLong]]){
        let component = couple[0] as Component;
        const fn = couple[1] as (a: Component, b: Component) => boolean;
        if(component !== undefined && fn(component,pc_case)){
          return true;
        }
    }
    return false;
  }


  const isGpuDisabled = (gpu: Component) => {
    if (selectedCase !== undefined && aGpuTooLong(gpu, selectedCase)) {
      return true;
    }
    if (selectedPsu !== undefined && selectedCpu !== undefined && notEnoughWattage(selectedPsu, selectedCpu, gpu)) {
      return true;
    }

    if(selectedPsu !== undefined && cpus.length != 0){
      if(cpus.every((cpu)=> (notEnoughWattage(selectedPsu,cpu,gpu)))){
        return true;
      }
    }
    return false;
  }

  const isPsuDisabled = (psu: Component) => {
    // cas 1 : CPU et GPU déjà choisis -> check direct
    if (selectedCpu !== undefined && selectedGpu !== undefined) {
      return notEnoughWattage(psu, selectedCpu, selectedGpu);
    }

    // cas 2 : seul le GPU est choisi -> ce PSU marcherait-il avec AU MOINS UN cpu du catalogue ?
    if (selectedGpu !== undefined) {
      if (cpus.length === 0) {
        return false;
      }
      return cpus.every((cpu) => notEnoughWattage(psu, cpu, selectedGpu));
    }

    // cas 3 : seul le CPU est choisi -> ce PSU marcherait-il avec AU MOINS UN gpu du catalogue ?
    if (selectedCpu !== undefined) {
      if (gpus.length === 0) {
        return false;
      }
      return gpus.every((gpu) => notEnoughWattage(psu, selectedCpu, gpu));
    }

    
    return false;
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
            isOptionDisabled={isCpuDisabled}
          />
          <Field
            label="Carte mère"
            value={config.motherboard_id}
            onChange={(v) => handleChange("motherboard_id", v)}
            options={motherboards}
            placeholder="Sélectionnez une carte mère"
            isOptionDisabled={isMotherboardDisabled}
          />
          <Field
            label="Mémoire (RAM)"
            value={config.ram_id}
            onChange={(v) => handleChange("ram_id", v)}
            options={rams}
            placeholder="Sélectionnez un kit de RAM"
            isOptionDisabled={isRamDisabled}
          />
          <Field
            label="Carte graphique (GPU)"
            value={config.gpu_id}
            onChange={(v) => handleChange("gpu_id", v)}
            options={gpus}
            placeholder="Sélectionnez une GPU"
            isOptionDisabled={isGpuDisabled}
          />
          <Field
            label="Alimentation (PSU)"
            value={config.psu_id}
            onChange={(v) => handleChange("psu_id", v)}
            options={psus}
            placeholder="Sélectionnez un PSU"
            isOptionDisabled={isPsuDisabled}
          />
          <Field
            label="Boîtier"
            value={config.case_id}
            onChange={(v) => handleChange("case_id", v)}
            options={cases}
            placeholder="Sélectionnez un boîtier"
            isOptionDisabled={isCaseDisabled}
          />
        </div>
      </div>
    </main>
  );




}
