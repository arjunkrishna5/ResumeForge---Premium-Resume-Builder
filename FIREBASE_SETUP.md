# Firebase Setup Guide

Follow these steps to configure Firebase for ResumeForge so it can securely store resumes and handle user authentication.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and name it "ResumeForge"
3. Disable Google Analytics (optional but recommended for a simpler setup)
4. Click "Create Project"

## 2. Enable Authentication
1. Go to Build > Authentication
2. Click "Get Started"
3. In the "Sign-in method" tab, click "Email/Password" and enable it. Save.
4. Click "Add new provider", select "Google", enable it, select a support email, and Save.

## 3. Enable Firestore Database
1. Go to Build > Firestore Database
2. Click "Create Database"
3. Start in **Test Mode** (or Production Mode if you configure rules immediately)
4. Choose a location and enable.

## 4. Get Web App Credentials
1. Go back to Project Overview (home icon, top left)
2. Click the `</>` (Web) icon to add a web app.
3. Register app with name "ResumeForge". No need for Firebase Hosting right now.
4. Copy the config values provided in the `firebaseConfig` object.

## 5. Add Credentials to `.env`
Add these values securely to your environment variables (or `.env` file):

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

## 6. Secure Firestore (Security Rules)
Once your app is working, go to Firestore > Rules and apply these basic rules to ensure users can only see and edit their own resumes:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/resumes/{document=**} {
      // Only allow users to access their own subcollection
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
