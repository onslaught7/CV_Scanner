from server.app.controllers.auth_controller import login, signup, google_login, google_signup
from server.app.middlewares.auth_middleware import verify_token
from fastapi import APIRouter


router = APIRouter()


@router.post(
        "/signup", 
        tags=["New User Creation"],
        summary="Create a new user account",
        description="This endpoint allows users to create a new account by proiding an email and password"
)
async def signup_users():
    return await signup() 


# async def signup_users(request: SignupRequest):
#     try:
#         # Call the signup function and pass the validated input
#         result = signup(request.email, request.password)
#         return {"message": "User created successfully", "data": result}
#     except ValueError as e:
#         # Handle specific errors (e.g., user already exists)
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
#     except Exception as e:
#         # Handle unexpected errors
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")