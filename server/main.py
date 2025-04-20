from fastapi import FastAPI, HTTPException
from server.app.routes import auth_routes, coverletter_route, resume_routes
from fastapi.middleware.cors import CORSMiddleware
from server.config import settings


# Creating the FastAPI instance
app = FastAPI(title="CV Scanner API", version="dev_1.0")


# Allow cross-origin resource sharing between client and server
origins = [settings.ORIGIN]
print("Allowed origin: ",origins[0])
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Route
@app.get("/")
def read_root():
    return {"message": "CV Sacnner API is running. 💨"}


# Include the routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(resume_routes.router, prefix="/api/resume", tags=["Resume"])
# app.include_router(coverletter_route.router, prefix="/api/coverletter", tags=["CoverLetter"])


