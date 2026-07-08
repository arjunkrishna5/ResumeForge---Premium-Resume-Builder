# ResumeForge 🛠️ ✨

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vercel-blueviolet?style=for-the-badge)](https://resume-forge-premium-resume-builder.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**ResumeForge** is a premium, AI-powered resume and CV builder designed to help job seekers craft professional, ATS-friendly resumes in minutes. Featuring a dynamic layout engine, real-time print-scaling preview, and intelligent writing assistance, it translates your career history into a compelling narrative.

**Live URL**: [https://resume-forge-premium-resume-builder.vercel.app](https://resume-forge-premium-resume-builder.vercel.app)

---

## 🚀 Key Features

* **Guided Step-by-Step Builder**: Interactive workflow customized for both **students** (education-first) and **professionals** (experience-first).
* **Live Scaled Preview**: Real-time side-by-side rendering using a dynamic A4 scale wrapper that automatically adjusts to screen width.
* **AI Writing Co-Pilot**:
  * **AI Bullet Points**: Automatically rewrites job descriptions into action-oriented, metrics-driven bullet points.
  * **AI Skills & Summary**: Recommends relevant skills and generates summary statements tailored to your target job title.
  * **AI Cover Letter Generator**: Creates customized cover letters to match your resume data and tone of voice.
* **Resume Import**: Upload existing PDF or DOCX files to automatically parse and import your profile details.
* **Universal Export**: Export your finalized resume as a pixel-perfect **PDF** (via canvas rendering) or a raw **DOCX** file.
* **Offline-First Storage**: Secure auto-save mirroring to Firestore database and `localStorage` fallback to prevent draft loss.
* **Collapsible Desktop Sidebar**: Reclaim maximum screen estate during editing sessions with a fluid collapsible layout.

---

## 🛠️ Tech Stack

* **Frontend**: React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion
* **Backend Utilities**: Node.js (Express) · Python (FastAPI)
* **Authentication & Database**: Firebase Auth · Cloud Firestore
* **AI Engine**: Google Gemini API (with Groq and OpenRouter fallbacks)
* **Document Processing**: `html2canvas` · `jsPDF` · `docx` · `mammoth` · `pypdf`

---

## 💻 Local Setup & Run

### 1. Install Dependencies
Install frontend and backend library packages:
```bash
# Install React dependencies
npm install

# Setup Python environment
python -m venv .venv
.venv\Scripts\Activate.ps1   # (Windows PowerShell)
pip install -r backend/requirements.txt
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and add your Firebase credentials and LLM API keys:
```bash
cp .env.example .env.local
```

### 3. Run the Development Servers
In two separate terminal instances, run the frontend and backend:
```bash
# Terminal 1: Run the React Client (Vite Dev Server)
npm run dev

# Terminal 2: Run the Python API server
npm run dev:backend
```
Open **`http://localhost:3000`** in your browser.

---

## 📖 Configuration Guides
- **Firebase Configuration**: See [FIREBASE_SETUP.md](file:///c:/Users/ARJUN%20KRISHNA/Desktop/ResumeForge/FIREBASE_SETUP.md) for database rules and auth configurations.
- **Production Deployment**: See [DEPLOYMENT.md](file:///c:/Users/ARJUN%20KRISHNA/Desktop/ResumeForge/DEPLOYMENT.md) for deploying to Vercel.

## 📄 License
This project is licensed under the MIT License - see the [MIT License Details](https://opensource.org/licenses/MIT) for more information.
