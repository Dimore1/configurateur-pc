def check_cpu_motherboard(cpu, motherboard):
    if cpu.socket != motherboard.socket:
        return False, f"Socket incompatible : le CPU utilise {cpu.socket}, la carte mère attend {motherboard.socket}"
    return True, None


def check_ram_motherboard(ram, motherboard):
    if ram.type != motherboard.ram_type:
        return False, f"RAM incompatible : la RAM est en {ram.type}, la carte mère attend de la {motherboard.ram_type}"
    return True, None


def check_case_motherboard(case, motherboard):
    supported = case.supported_formats.split(",")
    if motherboard.format not in supported:
        return False, f"Format incompatible : la carte mère est au format {motherboard.format}, le boîtier accepte {supported}"
    return True, None


def check_gpu_case(gpu, case):
    if gpu.length_mm > case.max_gpu_length_mm:
        return False, f"GPU trop long : {gpu.length_mm}mm pour un boîtier qui accepte {case.max_gpu_length_mm}mm max"
    return True, None


def check_psu_wattage(psu, cpu, gpu, margin=150):
    needed = cpu.tdp + gpu.tdp + margin
    if psu.wattage < needed:
        return False, f"Alimentation insuffisante : {psu.wattage}W fournis, environ {needed}W nécessaires (marge de sécurité incluse)"
    return True, None


def check_build(cpu, motherboard, ram, gpu, case, psu):
    checks = [
        check_cpu_motherboard(cpu, motherboard),
        check_ram_motherboard(ram, motherboard),
        check_case_motherboard(case, motherboard),
        check_gpu_case(gpu, case),
        check_psu_wattage(psu, cpu, gpu),
    ]
    issues = [message for (is_ok, message) in checks if not is_ok]
    compatible = all(is_ok for (is_ok, message) in checks)
    return {"compatible": compatible, "issues": issues}