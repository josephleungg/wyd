from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from crud import auth as auth_crud

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def validate_auth_token(token: str = Depends(oauth2_scheme)):
    username = auth_crud.verify_token(token)

    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username