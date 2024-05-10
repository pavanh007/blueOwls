from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: Optional[str]
    password: Optional[str]
    age: Optional[str]
    phone: str
    role: Optional[str]


class UserUpdate(BaseModel):
    email: Optional[str]
    address: Optional[str]
    password: Optional[str]
    age: Optional[str]


class Appointments(BaseModel):
    patient_phone_no: str
    start: str
    date: str
    end: str
    note: str
    practitioner_id: Optional[str]


class loginData(BaseModel):
    phone: str
    password: str
