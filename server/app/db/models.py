from sqlalchemy import Column, Integer, String, DateTime, func, Enum
from sqlalchemy.ext.declarative import declarative_base
from enum import Enum as PythonEnum

Base = declarative_base()


class RoleEnum(PythonEnum):
    doctor = "doctor"
    patient = "patient"


class User(Base):
    __tablename__ = "users"
    user_id: int = Column(String(50), primary_key=True, index=True, unique=True)
    name: str = Column(String(50))
    address: str = Column(String(50))
    role: RoleEnum = Column(Enum(RoleEnum), default=RoleEnum.patient)
    email: str = Column(String(50))
    phone: str = Column(String(12), unique=True, index=True)
    password: str = Column(String(50))
    age: str = Column(String(2))


class Appointment(Base):
    __tablename__ = "appointments"
    appointment_id = Column(String(50), primary_key=True, index=True)
    patient_phone_no = Column(String(50), index=True)
    start = Column(String(20), index=True)
    end = Column(String(20), index=True)
    date= Column(String(20), index=True)
    note = Column(String(200), index=True)
    practitioner_id = Column(String(50), index=True)
    created_at = Column(DateTime, default=func.now())
    payment_link = Column(String(200))
