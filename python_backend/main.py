"""
Module: main.py
Description: Main FastAPI entry point for ComicCraft backend application.
"""
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables (.env)
load_dotenv()

from routes import router

app = FastAPI(
    title="ComicCraft API",
    description="AI-powered 5-panel comic story and illustration generator using Gemini models.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files mounting
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_dir, "panels"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "exports"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include application routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
