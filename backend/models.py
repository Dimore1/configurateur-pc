from sqlalchemy import Column, Integer, String, Float
from database import Base


class Cpu(Base):
    __tablename__ = "cpus"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    socket = Column(String, nullable=False)  # ex: "AM5", "LGA1700"
    tdp = Column(Integer)  # consommation en watts


class Motherboard(Base):
    __tablename__ = "motherboards"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    socket = Column(String, nullable=False)  # doit correspondre au CPU
    ram_type = Column(String, nullable=False)  # "DDR4" ou "DDR5 ou DDR4,DDR5"
    format = Column(String, nullable=False)  # "ATX", "mATX", "ITX"
    max_ram_slots = Column(Integer)


class Ram(Base):
    __tablename__ = "rams"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "DDR4" ou "DDR5"
    capacity_gb = Column(Integer)
    speed_mhz = Column(Integer)


class Gpu(Base):
    __tablename__ = "gpus"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    length_mm = Column(Integer)  # longueur physique de la carte
    tdp = Column(Integer)


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    supported_formats = Column(String)  # ex: "ATX,mATX,ITX"
    max_gpu_length_mm = Column(Integer)


class Psu(Base):
    __tablename__ = "psus"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    wattage = Column(Integer, nullable=False)