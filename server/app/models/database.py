from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from server.config import settings


DATABASE_URL = settings.DATABASE_URL


# Creating the starting point for our SQLAlchemy application
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# All the table models will inherit from this class
Base = declarative_base()


# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
