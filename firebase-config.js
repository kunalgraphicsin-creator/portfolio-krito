// ============================================================
//  KRITO — Firebase + Cloudinary Configuration
// ============================================================

// ── Firebase (Realtime Database for global data sync) ──
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyB54uP9ucP66iaqK7zka1CWXb9XcT4aKQ4",
  authDomain:        "krito-portfolio.firebaseapp.com",
  databaseURL:       "https://krito-portfolio-default-rtdb.firebaseio.com",
  projectId:         "krito-portfolio",
  storageBucket:     "krito-portfolio.firebasestorage.app",
  messagingSenderId: "562337654289",
  appId:             "1:562337654289:web:a384ea65d6c01f81daf3b0",
  measurementId:     "G-JP3WNZ2FBV"
};

// ── Cloudinary (FREE audio storage — no credit card) ──
const CLOUDINARY_CONFIG = {
  cloudName:    "dl1paq19e",
  uploadPreset: "krito_beats"
};

// ============================================================
function isFirebaseConfigured() {
  return FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
}
function isCloudinaryConfigured() {
  return CLOUDINARY_CONFIG.cloudName !== "" && CLOUDINARY_CONFIG.uploadPreset !== "";
}
