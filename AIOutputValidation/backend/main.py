from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
from typing import Optional

from services.file_handler import extract_file_content
from services.repo_scanner import scan_repository
from services.url_scanner import scan_live_url
from services.ai_analyzer import analyze_code_with_ollama

app = FastAPI(title="AI Output Validation API", version="2.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeUrlRequest(BaseModel):
    url: str
    strict: bool = False

class RepoScanRequest(BaseModel):
    repo_url: str
    strict: bool = False

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Output Validation API v2.0 is running"}

@app.post("/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
    strict: Optional[bool] = Form(False)
):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        code_input = extract_file_content(temp_path)
        result = analyze_code_with_ollama(code_input, model="llama3", strict=bool(strict))
        return result
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/analyze/repo")
async def analyze_repo(req: RepoScanRequest):
    code_input = scan_repository(req.repo_url)
    result = analyze_code_with_ollama(code_input, model="llama3", strict=req.strict)
    return result

@app.post("/analyze/url")
async def analyze_url(req: AnalyzeUrlRequest):
    code_input = scan_live_url(req.url)
    result = analyze_code_with_ollama(code_input, model="llama3", strict=req.strict)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
