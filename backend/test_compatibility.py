from database import SessionLocal
from models import Cpu, Motherboard, Ram, Gpu, Case, Psu
from compatibility import check_build

db = SessionLocal()

cpu = db.query(Cpu).filter(Cpu.name == "AMD Ryzen 5 7600").first()
motherboard = db.query(Motherboard).filter(Motherboard.name == "MSI B650M").first()
ram = db.query(Ram).filter(Ram.name == "Corsair Vengeance 32GB").first()
gpu = db.query(Gpu).filter(Gpu.name == "RTX 4060").first()
case = db.query(Case).filter(Case.name == "Fractal Design Node 304").first()
psu = db.query(Psu).filter(Psu.name == "EVGA 600 BR").first()

result = check_build(cpu, motherboard, ram, gpu, case, psu)
print("Config compatible attendue :", result)

# Carte mère Intel avec un CPU AMD -> doit être incompatible
motherboard_intel = db.query(Motherboard).filter(Motherboard.name == "MSI B760M").first()
result2 = check_build(cpu, motherboard_intel, ram, gpu, case, psu)
print("Config incompatible attendue :", result2)

db.close()