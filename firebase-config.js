// ============================================================
//  KRITO — Firebase Configuration
//  Fill in YOUR project values from Firebase Console
//  Firebase Console → Project Settings → Your Apps → SDK setup
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ============================================================
//  HOW TO SET UP FIREBASE
//  1. Go to https://console.firebase.google.com/
//  2. Create a new project (e.g., "krito-portfolio")
//  3. Enable Realtime Database (Start in test mode, then add rules below)
//  4. Enable Storage (Start in test mode)
//  5. Click gear ⚙ → Project Settings → General → Your apps
//  6. Click </> (Web app) → Register app → copy the config above
//
//  REALTIME DATABASE RULES (paste in Firebase Console → Realtime DB → Rules):
//  {
//    "rules": {
//      "krito_portfolio": {
//        "data": { ".read": true, ".write": false },
//        "submissions": { ".read": false, ".write": true },
//        "admin": { ".read": false, ".write": false }
//      }
//    }
//  }
//
//  STORAGE RULES (Firebase Console → Storage → Rules):
//  rules_version = '2';
//  service firebase.storage {
//    match /b/{bucket}/o {
//      match /beats/{allPaths=**} { allow read; allow write: if false; }
//    }
//  }
//
//  ADMIN WRITE ACCESS: Use Firebase Console → Realtime DB → manually set
//  data via the admin panel (it uses Service Account logic — see admin.html).
//
//  ⚠ Once filled in, push to GitHub — Cloudflare will auto-deploy.
// ============================================================

// Checks if Firebase config is filled in (not placeholder)
function isFirebaseConfigured() {
  return FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
}
