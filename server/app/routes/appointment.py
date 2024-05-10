import uuid

from fastapi import APIRouter
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import get_db
from app.db.models import Appointment
from app.db.schema import Appointments
from queue import Queue
import uuid
import stripe
import threading

appointment_router = APIRouter()
lock = threading.Lock()
queue = Queue()
stripe.api_key = "rk_test_51N7rGTSAvVXoO7CAz73Ye8YvOrmLLps05mPOBkOq6Qa9HowRRtwkTFnvKu7qXrgDZEvGIuygvKxXV5JGZLVZjxj300VNfaTn9L"


@appointment_router.get("/")
def get_future_appointments(db: Session = Depends(get_db)):
    future_appointments = db.query(Appointment).filter().all()
    return future_appointments


@appointment_router.post("/create")
def create_appointment(appointment: Appointments, db: Session = Depends(get_db)):
    try:
        with lock:
            if not queue.empty():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Another appointment is currently being booked for the same time slot."
                )
            queue.put(appointment)
        payment_link = stripe.PaymentLink.create(
            line_items=[{"price": "price_1PEOfxSAvVXoO7CAy9do3eWS", "quantity": 1}],
        )
        db_appointment = Appointment(appointment_id=generate_app_id(),
                                     patient_phone_no=appointment.patient_phone_no,
                                     start=appointment.start,
                                     date=appointment.date,
                                     end=appointment.end,
                                     note=appointment.note if appointment.note else None,
                                     practitioner_id=appointment.practitioner_id,
                                     payment_link=payment_link.url)

        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)
        print("db_appointment", db_appointment)
        with lock:
            queue.get()

        return {"msg": "appointment created"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create appointment: {str(e)}"
        )


@appointment_router.put("/appointment/{appointment_id}")
def update_user_by_email(appointment_id: int, appointment: Appointments, db: Session = Depends(get_db)):
    db_appointment = db.query(Appointment).filter(Appointment.appointment_id == appointment_id).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db_appointment.start = appointment.start
    db_appointment.end = appointment.end
    db.commit()
    return {"message": "Appointment updated successfully"}


@appointment_router.get("/get/{id}")
def get_appointment_by_id(id: str, db: Session = Depends(get_db)):
    db_appointment = db.query(Appointment).filter(Appointment.practitioner_id == id or Appointment.patient_phone_no == id).first()

    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"appointment": db_appointment, "message": "Appointment retrieved successfully"}


@appointment_router.delete("/appointment/{appointment_id}")
def delete_user_by_email(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(db_appointment)
    db.commit()
    return {"message": "Appointment deleted successfully"}


def generate_app_id() -> str:
    uu_id = uuid.uuid4()
    app_id = f"APP:{uu_id}"
    return app_id
