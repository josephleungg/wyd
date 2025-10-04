from fastapi import FastAPI
from routers import auth, convai

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(convai.router, prefix="/convai", tags=["convai"])

@app.get("/")
async def root():
    return {"message": "Hello World"}