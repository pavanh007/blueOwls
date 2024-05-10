from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session
from app.db.models import User
from app.db.schema import loginData
from app.db.database import get_db

login_router = APIRouter()

SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVOlBBVkFOSERTQ0U6OCIsImV4cCI6MTcxNTE0NzUxOX0.93Haeni3-yIOLwdnShPQzm7KxXUlJOFFNTsbrGZ9DwE"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7




def authenticate_user(db: Session, phone: str, password: str):

    user = db.query(User).filter(User.phone == phone).first()
    print("user", user)
    if not user:
        return None
    if user.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
        )
    return user


# Generate JWT token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@login_router.post("/token")
async def login_for_access_token(user: loginData, db: Session = Depends(get_db)):
    user = authenticate_user(db, user.phone, user.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires= timedelta(minutes=REFRESH_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(
        data={"sub": user.user_id}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": user.user_id}, expires_delta=refresh_token_expires
    )
    return {"access_token": access_token, "refresh_token": refresh_token, "phone": user.phone, "token_type": "bearer"}
