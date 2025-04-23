from fastapi import FastAPI, HTTPException
from server.app.routes import auth_routes, coverletter_routes, resume_routes, findjobs_routes
from fastapi.middleware.cors import CORSMiddleware
from server.config import settings
from fastapi.staticfiles import StaticFiles
import os


os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


# Creating the FastAPI instance
app = FastAPI(title="CV Scanner API", version="dev_1.0", docs_url=None)
    

# Allow cross-origin resource sharing between client and server
origins = [settings.ORIGIN]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.ENV != "production":
    app.mount(settings.UPLOAD_MOUNT_PATH, StaticFiles(directory=settings.UPLOAD_DIR), name="upload-resumes")

# Health Check Route
@app.get("/")
def read_root():
    return {"message": "CV Sacnner API is running. 💨"}


# Include the routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(resume_routes.router, prefix="/api/resume", tags=["Resume"])
app.include_router(coverletter_routes.router, prefix="/api/coverletter", tags=["CoverLetter"])
app.include_router(findjobs_routes.router, prefix="/api/jobsroutes", tags=["FetchJobs"])