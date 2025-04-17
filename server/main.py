from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from server.app.models.database import SessionLocal
from server.app.routes import auth_routes, coverletter_route, resume_route


# Creating the FastAPI instance
app = FastAPI(title="CV Scanner API", version="dev_1.0")


# Dependency to get a db session per request
def get_db():
    db = SessionLocal()
    try: 
        yield db # gives control back to the route using it
    finally:
        db.close()


# Health Check Route
@app.get("/")
def read_root():
    return {"message": "CV Sacnner API is running. 💨"}


# Include the routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(coverletter_route.router, prefix="/api/coverletter", tags=["CoverLetter"])
app.include_router(resume_route.router, prefix="/api/resume", tags=["Resume"])

