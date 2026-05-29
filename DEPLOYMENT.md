# Deploying ResumeForge to Vercel

## Step 1: Create Vercel Project
1. Go to vercel.com
2. Click "New Project"
3. Import from GitHub — select your ResumeForge repo
4. Framework preset: Other (not Vite — we use Express)

## Step 2: Add Environment Variables
In Vercel → Project Settings → Environment Variables,
add these 7 variables:

| Variable | Where to get it |
|---|---|
| GEMINI_API_KEY | aistudio.google.com → API Keys |
| VITE_FIREBASE_API_KEY | Firebase Console → Project Settings |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase Console → Project Settings |
| VITE_FIREBASE_PROJECT_ID | Firebase Console → Project Settings |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase Console → Project Settings |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase Console → Project Settings |
| VITE_FIREBASE_APP_ID | Firebase Console → Project Settings |

## Step 3: Update Firebase Auth Domain
After deploying, you will get a Vercel URL like:
your-project.vercel.app

Go to Firebase Console → Authentication → Settings →
Authorized domains → Add your Vercel domain.

## Step 4: Deploy
Click "Deploy" in Vercel. That's it.

## Troubleshooting
- If auth doesn't work: check Firebase authorized domains
- If AI features don't work: check GEMINI_API_KEY is set
- If database doesn't work: check all VITE_FIREBASE_*
  variables are set correctly
