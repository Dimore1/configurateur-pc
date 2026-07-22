from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import Cpu, Motherboard, Ram, Gpu, Case, Psu
from compatibility import check_build
from fastapi import FastAPI, HTTPException
from database import SessionLocal


app = FastAPI(title="Configurateur PC FR - API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

from sqlalchemy import text
from database import engine

@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"db_status": "ok", "result": result.scalar()}



class BuildRequest(BaseModel):
    cpu_id: int
    motherboard_id: int
    ram_id: int
    gpu_id: int
    case_id: int
    psu_id: int


@app.post("/check-compatibility")
def check_compatibility(build: BuildRequest):
    db = SessionLocal()
    try:
        cpu = db.get(Cpu, build.cpu_id)
        motherboard = db.get(Motherboard, build.motherboard_id)
        ram = db.get(Ram, build.ram_id)
        gpu = db.get(Gpu, build.gpu_id)
        case = db.get(Case, build.case_id)
        psu = db.get(Psu, build.psu_id)

        if not all([cpu, motherboard, ram, gpu, case, psu]):
            raise HTTPException(status_code=404, detail="Un ou plusieurs composants introuvables")

        return check_build(cpu, motherboard, ram, gpu, case, psu)
    finally:
        db.close()


@app.get("/components/{table_name}")
def list_components(table_name: str):
    tables = {
        "cpus": Cpu, "motherboards": Motherboard, "rams": Ram,
        "gpus": Gpu, "cases": Case, "psus": Psu,
    }
    model = tables.get(table_name)
    if not model:
        raise HTTPException(status_code=404, detail="Type de composant inconnu")

    db = SessionLocal()
    try:
        return db.query(model).all()
    finally:
        db.close()