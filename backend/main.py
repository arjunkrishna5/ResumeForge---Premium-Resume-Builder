import os
import io
import json
import re
import logging
import time
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import httpx
import pypdf
import docx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ResumeForgeBackend")

# Load environment variables
load_dotenv(".env.local")
load_dotenv(".env")

logger.info(f"Loaded environment keys: {[k for k in os.environ.keys() if 'API' in k or 'KEY' in k]}")
logger.info(f"GROQ_API_KEY present: {bool(os.getenv('GROQ_API_KEY'))}")
logger.info(f"GEMINI_API_KEYS present: {bool(os.getenv('GEMINI_API_KEYS') or os.getenv('GEMINI_API_KEY'))}")
logger.info(f"OPENROUTER_API_KEY present: {bool(os.getenv('OPENROUTER_API_KEY'))}")

app = FastAPI(title="ResumeForge API Server")

# Restrict CORS origins (useful for dev and cross-origin calls)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "").strip()
]
origins = [o for o in origins if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple rolling window rate limiter in memory
ip_rate_limits = {}  # format: {ip: [timestamp1, timestamp2, ...]}

async def rate_limit_dependency(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Clean up older timestamps (older than 60s)
    if ip in ip_rate_limits:
        ip_rate_limits[ip] = [t for t in ip_rate_limits[ip] if now - t < 60]
    else:
        ip_rate_limits[ip] = []
        
    if len(ip_rate_limits[ip]) >= 15:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait and try again."
        )
    ip_rate_limits[ip].append(now)

@app.middleware("http")
async def verify_keys_middleware(request: Request, call_next):
    # Verify API keys are present before allowing /api/gemini requests
    if request.url.path == "/api/gemini" and request.method == "POST":
        has_keys = any([
            os.getenv("GROQ_API_KEY"),
            os.getenv("GEMINI_API_KEYS"),
            os.getenv("GEMINI_API_KEY"),
            os.getenv("OPENROUTER_API_KEY")
        ])
        if not has_keys:
            logger.error("No AI API Keys are configured")
            return JSONResponse(
                status_code=500,
                content={"error": "AI service not configured. API keys are missing."}
            )
    return await call_next(request)

async def generate_with_fallback(prompt: str, json_mode: bool = False) -> str:
    groq_api_key = os.getenv("GROQ_API_KEY")
    gemini_keys_str = os.getenv("GEMINI_API_KEYS", os.getenv("GEMINI_API_KEY", ""))
    gemini_keys = [k.strip() for k in gemini_keys_str.split(",") if k.strip()]
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

    providers = []

    # 1. Groq (Primary)
    if groq_api_key:
        async def run_groq(p: str, j: bool) -> str:
            async with httpx.AsyncClient(timeout=15.0) as client:
                headers = {
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": [{"role": "user", "content": p}],
                    "temperature": 0.1
                }
                if j:
                    payload["response_format"] = {"type": "json_object"}
                
                resp = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                if resp.status_code != 200:
                    raise Exception(f"Groq returned {resp.status_code}: {resp.text}")
                data = resp.json()
                return data["choices"][0]["message"]["content"] or ""
        providers.append(("Groq", run_groq))

    # 2. Gemini Keys (Backup 1 - rotating list)
    for idx, key in enumerate(gemini_keys):
        def make_run_gemini(k=key, index=idx):
            async def run_gemini(p: str, j: bool) -> str:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={k}"
                    headers = {"Content-Type": "application/json"}
                    payload = {
                        "contents": [{"parts": [{"text": p}]}]
                    }
                    if j:
                        payload["generationConfig"] = {"responseMimeType": "application/json"}
                    
                    resp = await client.post(url, headers=headers, json=payload)
                    if resp.status_code != 200:
                        raise Exception(f"Gemini Key {index + 1} returned {resp.status_code}: {resp.text}")
                    data = resp.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"] or ""
            return run_gemini
        providers.append((f"Gemini (Key {idx + 1})", make_run_gemini()))

    # 3. OpenRouter (Backup 2)
    if openrouter_api_key:
        async def run_openrouter(p: str, j: bool) -> str:
            async with httpx.AsyncClient(timeout=15.0) as client:
                headers = {
                    "Authorization": f"Bearer {openrouter_api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://resumeforge.com",
                    "X-Title": "ResumeForge"
                }
                payload = {
                    "model": "google/gemini-2.0-flash:free",
                    "messages": [{"role": "user", "content": p}],
                    "temperature": 0.1
                }
                if j:
                    payload["response_format"] = {"type": "json_object"}
                
                resp = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
                if resp.status_code != 200:
                    raise Exception(f"OpenRouter returned {resp.status_code}: {resp.text}")
                data = resp.json()
                return data["choices"][0]["message"]["content"] or ""
        providers.append(("OpenRouter", run_openrouter))

    if not providers:
        raise Exception("No AI providers configured. Please set GROQ_API_KEY, GEMINI_API_KEYS, or OPENROUTER_API_KEY.")

    last_error = None
    for name, run_func in providers:
        try:
            logger.info(f"[AI Engine] Attempting request using {name}...")
            result = await run_func(prompt, json_mode)
            logger.info(f"[AI Engine] Request succeeded using {name}")
            return result
        except Exception as err:
            logger.warning(f"[AI Engine] {name} failed: {str(err)}")
            last_error = err

    raise Exception(f"All configured AI providers failed. Last error: {str(last_error)}")

@app.post("/api/gemini")
async def gemini_endpoint(request: Request, _ = Depends(rate_limit_dependency)):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    action = body.get("action")
    if not action:
        raise HTTPException(status_code=400, detail="Missing action parameter")

    try:
        result = ""
        if action == "improveJobDescription":
            desc = body.get("description", "")
            prompt = (
                f"Rewrite this job description as 3 strong resume bullet points using action verbs and quantifiable metrics. "
                f"Return only the bullet points with a dash prefix, no extra text: {desc}"
            )
            result = await generate_with_fallback(prompt)
            return {"text": result}

        elif action == "suggestSkills":
            job_title = body.get("jobTitle", "")
            prompt = f"List 8 key technical and soft skills for a {job_title} role. Return only a comma-separated list, nothing else."
            response_text = await generate_with_fallback(prompt)
            skills = [s.strip() for s in response_text.split(",") if s.strip()]
            return {"skills": skills}

        elif action == "generateSummary":
            name = body.get("name", "")
            role = body.get("role", "")
            experience = body.get("experience", [])
            skills = body.get("skills", [])
            
            exp_text = f"{experience[0].get('title')} at {experience[0].get('company')}" if experience else "various roles"
            skills_text = ", ".join(skills[:5]) if skills else ""
            
            prompt = (
                f"Write a 3-sentence professional summary for a resume. "
                f"Name: {name}, Role: {role}, Experience: {exp_text}, Skills: {skills_text}. "
                f"Make it impactful and ATS-friendly. Return only the summary paragraph."
            )
            result = await generate_with_fallback(prompt)
            return {"text": result}

        elif action == "generateCoverLetter":
            name = body.get("name", "")
            job_title = body.get("jobTitle", "")
            company = body.get("company", "")
            tone = body.get("tone", "")
            summary = body.get("summary", "")
            skills = body.get("skills", [])
            
            skills_str = ", ".join(skills) if skills else ""
            prompt = (
                f"Write a professional cover letter for {name} applying for {job_title} at {company}. "
                f"Tone: {tone}. Summary context: {summary}. Skills: {skills_str}. "
                f"Keep it to 3 paragraphs under 300 words. Return only the letter body."
            )
            result = await generate_with_fallback(prompt)
            return {"text": result}

        elif action == "parseResume":
            text = body.get("text", "")
            prompt = (
                f"Extract resume information from this text and return ONLY a valid JSON object, no markdown:\n"
                f"{{name, role, email, phone, location, linkedin, portfolio, summary, experience: [{{title, company, startDate, endDate, current, description}}], education: [{{institution, degree, field, startYear, endYear, grade}}], technicalSkills: [string], softSkills: [string], projects: [{{name, description, techStack: [string], liveUrl, githubUrl}}]}}\n"
                f"Resume text: {text}"
            )
            response_text = await generate_with_fallback(prompt, json_mode=True)
            try:
                cleaned = response_text.replace("```json", "").replace("```", "").strip()
                data = json.loads(cleaned)
                return {"data": data}
            except Exception:
                raise HTTPException(status_code=400, detail="Could not parse resume data")

        elif action == "calculateATSScore":
            name = body.get("name", "")
            role = body.get("role", "")
            summary = body.get("summary", "")
            experience = body.get("experience", [])
            technical_skills = body.get("technicalSkills", [])
            soft_skills = body.get("softSkills", [])
            education = body.get("education", [])
            
            exp_text = "\n".join([f"{e.get('title')} at {e.get('company')}: {e.get('description')}" for e in experience])
            skills_text = ", ".join(technical_skills + soft_skills)
            edu_text = "\n".join([f"{e.get('degree')} from {e.get('institution')}" for e in education])
            
            resume_text = f"""
            Name: {name}
            Role: {role}
            Summary: {summary}
            Experience: {exp_text}
            Skills: {skills_text}
            Education: {edu_text}
            """
            
            prompt = (
                f"Analyze this resume for ATS compatibility and return ONLY a JSON object (no markdown):\n"
                f"{{\n"
                f"  \"score\": <number 0-100>,\n"
                f"  \"grade\": <\"A\"|\"B\"|\"C\"|\"D\">,\n"
                f"  \"issues\": [<up to 4 short strings describing problems>],\n"
                f"  \"suggestions\": [<up to 3 short improvement tips>]\n"
                f"}}\n\n"
                f"Score based on:\n"
                f"- Has professional summary (20 points)\n"
                f"- Has measurable achievements with numbers (20 points)\n"
                f"- Skills section present and relevant (20 points)\n"
                f"- Consistent date formatting (15 points)\n"
                f"- Contact info complete (15 points)\n"
                f"- No spelling/grammar issues visible (10 points)\n\n"
                f"Resume: {resume_text}"
            )
            response_text = await generate_with_fallback(prompt, json_mode=True)
            try:
                cleaned = response_text.replace("```json", "").replace("```", "").strip()
                ats_data = json.loads(cleaned)
                return {"atsData": ats_data}
            except Exception:
                return {
                    "atsData": {"score": 70, "grade": "B", "issues": [], "suggestions": []}
                }

        else:
            raise HTTPException(status_code=400, detail="Unknown action")

    except Exception as err:
        logger.error(f"Gemini error: {str(err)}")
        err_msg = str(err)
        if "429" in err_msg or "quota" in err_msg.lower():
            return JSONResponse(
                status_code=429,
                content={"error": "AI rate limit exceeded. Please wait and try again."}
            )
        return JSONResponse(
            status_code=500,
            content={"error": err_msg or "AI request failed"}
        )

@app.post("/api/extractText")
async def extract_text_endpoint(file: UploadFile = File(...), _ = Depends(rate_limit_dependency)):
    filename = file.filename or ""
    file_type = filename.split(".")[-1].lower() if "." in filename else ""
    
    if file_type not in ["docx", "pdf"]:
        content_type = file.content_type or ""
        if "pdf" in content_type:
            file_type = "pdf"
        elif "word" in content_type or "wordprocessingml" in content_type:
            file_type = "docx"
        else:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    try:
        file_bytes = await file.read()
        
        # Enforce 5MB upload size limit on backend
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds the 5MB limit.")
            
        extracted_text = ""

        if file_type == "pdf":
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_list = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_list.append(page_text)
            extracted_text = "\n".join(text_list)
            
        elif file_type == "docx":
            doc = docx.Document(io.BytesIO(file_bytes))
            text_list = []
            for para in doc.paragraphs:
                if para.text:
                    text_list.append(para.text)
            extracted_text = "\n".join(text_list)

        # Replaces spaces with newlines if they block readability
        cleaned = re.sub(r'\s{3,}', '\n\n', extracted_text).strip()
        
        if len(cleaned) < 20:
            raise Exception("Could not extract readable text. The file may be image-based or protected.")

        return {"text": cleaned}

    except Exception as err:
        logger.error(f"extractText error: {str(err)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to process file: {str(err)}"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
