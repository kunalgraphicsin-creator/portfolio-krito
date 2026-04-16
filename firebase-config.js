// ============================================================
//  KRITO — Firebase + Cloudinary Configuration
// ============================================================

// ── Firebase (for data sync — fill in after creating Firebase project) ──
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ── Cloudinary (for FREE audio/image storage — ALREADY SET UP) ──
const CLOUDINARY_CONFIG = {
  cloudName:    "dl1paq19e",
  uploadPreset: "krito_beats"
};

// ============================================================
//  FIREBASE SETUP (one-time):
//  1. console.firebase.google.com → New project
//  2. Left menu → Realtime Database → Create → Test mode
//  3. ⚙ Project Settings → Your apps → </> Web → Copy config above
//
//  REALTIME DATABASE RULES:
//  {
//    "rules": {
//      "krito_portfolio": {
//        "data":        { ".read": true,  ".write": "auth != null" },
//        "submissions": { ".read": "auth != null", ".write": true  }
//      }
//    }
//  }
// ============================================================

function isFirebaseConfigured() {
  return FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
}

function isCloudinaryConfigured() {
  return CLOUDINARY_CONFIG.cloudName !== "" && CLOUDINARY_CONFIG.uploadPreset !== "";
}
