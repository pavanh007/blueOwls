from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base  # Import the Base class containing your model definitions

# Define the path where you want to create the users.db file
DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
