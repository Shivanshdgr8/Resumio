"""FastAPI application entry point."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import suggest, ats, resumes, interview, cover_letter, roaster
from app.db import connect_to_mongo, close_mongo_connection

# ... (logging setup)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Resumio API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers under /api prefix
app.include_router(suggest.router, prefix="/api/suggest", tags=["suggestions"])
app.include_router(ats.router, prefix="/api/ats", tags=["ats"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["resumes"])
app.include_router(interview.router, prefix="/api/interview", tags=["interview"])
app.include_router(cover_letter.router, prefix="/api/cover-letter", tags=["cover-letter"])
app.include_router(roaster.router, prefix="/api/roaster", tags=["roaster"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Resumio API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/api/health")
async def health():
    """
    Health check endpoint.
    
    Returns system status without exposing sensitive information.
    """
    from app.db import get_db
    
    # Check database connection (returns boolean)
    db_connected = False
    try:
        client = await get_db()
        if client is not None:
            # Test connection
            await client.admin.command('ping')
            db_connected = True
    except Exception:
        db_connected = False
    
    return {
        "status": "ok",
        "env": settings.ENV,
        "db": db_connected
    }
