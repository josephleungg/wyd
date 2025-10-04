from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from db import schema, conn
from sqlalchemy.orm import Session
from crud import auth as auth_crud
from dependencies import validate_auth_token

router = APIRouter()

@router.post("/register", response_model=schema.user.UserResponse)
async def register(user_data: schema.user.UserRegisterRequest, db: Session = Depends(conn.get_db)):
    if auth_crud.check_user_exists(user_data.username, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="User already exists"
        )
    
    return auth_crud.register_user(user_data, db)

@router.post("/login", response_model=schema.user.TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(conn.get_db)):
    token = auth_crud.login_user(db, form_data.username, form_data.password)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/user", response_model=schema.user.UserResponse)
async def user_info(username: str = Depends(validate_auth_token), db: Session = Depends(conn.get_db)):
    user = auth_crud.check_user_exists(username, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user