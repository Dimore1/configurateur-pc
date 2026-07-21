from database import SessionLocal
from models import Cpu, Motherboard, Ram, Gpu, Case, Psu

db = SessionLocal()

cpus = [
    Cpu(name="AMD Ryzen 5 7600", brand="AMD", socket="AM5", tdp=65),
    Cpu(name="AMD Ryzen 7 7800X3D", brand="AMD", socket="AM5", tdp=120),
    Cpu(name="Intel Core i5-13400F", brand="Intel", socket="LGA1700", tdp=65),
    Cpu(name="Intel Core i7-13700K", brand="Intel", socket="LGA1700", tdp=125),
]

motherboards = [
    Motherboard(name="MSI B650M", socket="AM5", ram_type="DDR5", format="mATX", max_ram_slots=4),
    Motherboard(name="Asus ROG Strix B650-A", socket="AM5", ram_type="DDR5", format="ATX", max_ram_slots=4),
    Motherboard(name="MSI B760M", socket="LGA1700", ram_type="DDR4", format="mATX", max_ram_slots=4),
    Motherboard(name="Asus Prime Z790", socket="LGA1700", ram_type="DDR5", format="ATX", max_ram_slots=4),
]

rams = [
    Ram(name="Corsair Vengeance 32GB", type="DDR5", capacity_gb=32, speed_mhz=6000),
    Ram(name="Kingston Fury 16GB", type="DDR4", capacity_gb=16, speed_mhz=3200),
    Ram(name="G.Skill Trident Z5 32GB", type="DDR5", capacity_gb=32, speed_mhz=6400),
]

gpus = [
    Gpu(name="RTX 4060", length_mm=200, tdp=115),
    Gpu(name="RTX 4070", length_mm=240, tdp=200),
    Gpu(name="RX 7600", length_mm=260, tdp=165),
]

cases = [
    Case(name="NZXT H510", supported_formats="ATX,mATX,ITX", max_gpu_length_mm=381),
    Case(name="Fractal Design Node 304", supported_formats="mATX,ITX", max_gpu_length_mm=310),
    Case(name="Cooler Master Q300L", supported_formats="mATX,ITX", max_gpu_length_mm=360),
]

psus = [
    Psu(name="EVGA 600 BR", wattage=600),
    Psu(name="Corsair RM750", wattage=750),
    Psu(name="be quiet! Pure Power 850", wattage=850),
]

db.add_all(cpus + motherboards + rams + gpus + cases + psus)
db.commit()
db.close()

print("Données de test insérées.")  