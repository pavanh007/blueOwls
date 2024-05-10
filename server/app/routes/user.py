from fastapi import APIRouter
from fastapi import HTTPException, Depends, status
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.db.schema import UserCreate, UserUpdate

user_router = APIRouter()


@user_router.get("/users/{patient_phone_no}")
def get_user_by_email(patient_phone_no: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == patient_phone_no).first()
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")


@user_router.get("/users/")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role == "doctor").all()
    if len(users) < 0:
        raise HTTPException(status_code=404, detail="Users not found")
    return users


@user_router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    print("user", user)
    existing_user = db.query(User).filter(User.phone == user.phone).first()
    if existing_user:
        return;
    new_user = User(email=user.email, password=user.password, name=user.name, user_id=generate_user_id(), age=user.age, phone=user.phone, role=user.role )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "user created"}


@user_router.put("/users/{phone}")
def update_user_by_phone(phone: str, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.phone == phone).first()
    print("user", user.address, user.email, user.age)
    print("db_user", db_user.address, db_user.email, db_user.age)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.address = user.address
    db_user.email = user.email
    db_user.age = user.age
    db.commit()
    print("db_user", db_user.address, db_user.email, db_user.age)
    return {"detail": "User updated successfully"}


def generate_user_id() -> str:
    current_day = datetime.now().microsecond
    user_id = f"U:{current_day}"
    return user_id
