from fastapi import FastAPI, HTTPException
from server.app.routes import auth_routes, coverletter_route, resume_route
from fastapi.middleware.cors import CORSMiddleware
from server.config import settings


# Creating the FastAPI instance
app = FastAPI(title="CV Scanner API", version="dev_1.0")


# Allow cross-origin resource sharing between client and server
origins = [settings.ORIGIN]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "PUT"],
    allow_headers=["*"],
    max_age=900, # specify the ttl for the browser to use when caching our responses, 600 seconds by default
)


# Health Check Route
@app.get("/")
def read_root():
    return {"message": "CV Sacnner API is running. 💨"}


# Include the routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
# app.include_router(coverletter_route.router, prefix="/api/coverletter", tags=["CoverLetter"])
# app.include_router(resume_route.router, prefix="/api/resume", tags=["Resume"])

