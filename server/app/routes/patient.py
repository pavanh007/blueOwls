from fastapi import APIRouter
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Patient
from app.db.schema import Appointments
from queue import Queue
import threading

patient_router = APIRouter()
lock = threading.Lock()
queue = Queue()


@patient_router.get("/patient/")
def get_all_appointment(db: Session = Depends(get_db)):
    return db.query(Patient).all()


@patient_router.get("/patient/{apppointment_id}")
def get_user_by_email(apppointment_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == apppointment_id).first()
    if patient:
        return patient
    raise HTTPException(status_code=404, detail="Patient not found")


@patient_router.post("/patient/")
def create_appointment(patient: Appointments, db: Session = Depends(get_db)):
    try:
        with lock:
            if not queue.empty():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Another patient is currently being booked for the same time slot."
                )
            queue.put(patient)
        db_appointment = Patient(**patient.dict())
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)

        with lock:
            queue.get()
        return db_appointment
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create patient: {str(e)}"
        )


@patient_router.put("/patient/{apppointment_id}")
def update_user_by_email(apppointment_id: int, patient: Appointments, db: Session = Depends(get_db)):
    db_appointment = db.query(Patient).filter(Patient.id == apppointment_id).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Patient not found")
    db_appointment.start = patient.start
    db_appointment.end = patient.end
    db.commit()
    return {"message": "Patient updated successfully"}


@patient_router.delete("/patient/{apppointment_id}")
def delete_user_by_email(apppointment_id: int, db: Session = Depends(get_db)):
    db_appointment = db.query(Patient).filter(Patient.id == apppointment_id).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(db_appointment)
    db.commit()
    return {"message": "Patient deleted successfully"}
