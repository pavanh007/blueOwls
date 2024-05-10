from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn
import logging
from app.routes.user import user_router
from app.routes.appointment import appointment_router
from app.routes.auth import login_router

App = FastAPI()


@App.get("/")
async def root():
    return {"message": "Hello world"}


logging.basicConfig(level=logging.INFO)

origins = [
    "*",
    "http://localhost",
    "http://localhost:3000",
    
]

App.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

App.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

App.add_middleware(GZipMiddleware, minimum_size=1000)

App.include_router(
    user_router, prefix="/api/user/v1", tags=["user"]
)
App.include_router(
    appointment_router, prefix="/api/appointment/v1", tags=["appointment"]
)
App.include_router(
    login_router, prefix="/api/auth/v1", tags=["auth"]
)

if __name__ == "__main__":
    uvicorn.run(App, host="0.0.0.0", port=8000, reload=True)
