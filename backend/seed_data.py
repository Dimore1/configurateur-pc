from database import SessionLocal
from models import Cpu, Motherboard, Ram, Gpu, Case, Psu

db = SessionLocal()

cpus = [
    Cpu(name="AMD Ryzen 5 7600", brand="AMD", socket="AM5", tdp=65, price=229.0, image_url="https://placehold.co/300x200?text=Ryzen+5+7600"),
    Cpu(name="AMD Ryzen 7 7800X3D", brand="AMD", socket="AM5", tdp=120, price=399.0, image_url="https://placehold.co/300x200?text=Ryzen+7+7800X3D"),
    Cpu(name="Intel Core i5-13400F", brand="Intel", socket="LGA1700", tdp=65, price=179.0, image_url="https://placehold.co/300x200?text=i5-13400F"),
    Cpu(name="Intel Core i7-13700K", brand="Intel", socket="LGA1700", tdp=125, price=379.0, image_url="https://placehold.co/300x200?text=i7-13700K"),
]

motherboards = [
    Motherboard(name="MSI B650M", socket="AM5", ram_type="DDR5", format="mATX", max_ram_slots=4, price=149.0, image_url="https://placehold.co/300x200?text=MSI+B650M"),
    Motherboard(name="Asus ROG Strix B650-A", socket="AM5", ram_type="DDR5", format="ATX", max_ram_slots=4, price=219.0, image_url="https://placehold.co/300x200?text=Asus+B650-A"),
    Motherboard(name="MSI B760M", socket="LGA1700", ram_type="DDR4", format="mATX", max_ram_slots=4, price=129.0, image_url="https://placehold.co/300x200?text=MSI+B760M"),
    Motherboard(name="Asus Prime Z790", socket="LGA1700", ram_type="DDR5", format="ATX", max_ram_slots=4, price=279.0, image_url="https://placehold.co/300x200?text=Asus+Prime+Z790"),
]

rams = [
    Ram(name="Corsair Vengeance 32GB", type="DDR5", capacity_gb=32, speed_mhz=6000, price=109.0, image_url="https://placehold.co/300x200?text=Corsair+Vengeance"),
    Ram(name="Kingston Fury 16GB", type="DDR4", capacity_gb=16, speed_mhz=3200, price=39.0, image_url="https://placehold.co/300x200?text=Kingston+Fury"),
    Ram(name="G.Skill Trident Z5 32GB", type="DDR5", capacity_gb=32, speed_mhz=6400, price=129.0, image_url="https://placehold.co/300x200?text=Trident+Z5"),
]

gpus = [
    Gpu(name="RTX 4060", length_mm=200, tdp=115, price=299.0, image_url="https://placehold.co/300x200?text=RTX+4060"),
    Gpu(name="RTX 4070", length_mm=240, tdp=200, price=579.0, image_url="https://placehold.co/300x200?text=RTX+4070"),
    Gpu(name="RX 7600", length_mm=260, tdp=165, price=269.0, image_url="https://placehold.co/300x200?text=RX+7600"),
    Gpu(name="RTX 5090", length_mm=340, tdp=575, price=1999.0, image_url="https://placehold.co/300x200?text=RTX+5090"),
]

cases = [
    Case(name="NZXT H510", supported_formats="ATX,mATX,ITX", max_gpu_length_mm=381, price=79.0, image_url="https://placehold.co/300x200?text=NZXT+H510"),
    Case(name="Fractal Design Node 304", supported_formats="mATX,ITX", max_gpu_length_mm=310, price=69.0, image_url="https://placehold.co/300x200?text=Node+304"),
    Case(name="Cooler Master Q300L", supported_formats="mATX,ITX", max_gpu_length_mm=360, price=49.0, image_url="https://placehold.co/300x200?text=Q300L"),
]

psus = [
    Psu(name="EVGA 600 BR", wattage=600, price=54.0, image_url="https://placehold.co/300x200?text=EVGA+600+BR"),
    Psu(name="Corsair RM750", wattage=750, price=109.0, image_url="https://placehold.co/300x200?text=Corsair+RM750"),
    Psu(name="be quiet! Pure Power 850", wattage=850, price=139.0, image_url="https://placehold.co/300x200?text=Pure+Power+850"),
]

db.add_all(cpus + motherboards + rams + gpus + cases + psus)
db.commit()
db.close()

print("Données de test insérées.")
