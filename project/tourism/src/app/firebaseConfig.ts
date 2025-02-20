// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcbQAbvsv3el1AWOEZL1TAF8orjJbAzBs",
  authDomain: "tourism-cee0f.firebaseapp.com",
  projectId: "tourism-cee0f",
  storageBucket: "tourism-cee0f.appspot.com", // Fixed typo here
  messagingSenderId: "265123397833",
  appId: "1:265123397833:web:26bac02616871a51b48d18",
  measurementId: "G-XVRV0V4BN1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Add authentication
const googleProvider = new GoogleAuthProvider(); // Add Google provider

// Export auth and googleProvider
export { auth, googleProvider };
export default app;
