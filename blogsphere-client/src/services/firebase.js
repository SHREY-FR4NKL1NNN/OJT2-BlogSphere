import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDcDi3_cJDBBzYGs9hBBUfJmy6Z9UcCEB4",
    authDomain: "blogsphere-c6342.firebaseapp.com",
    projectId: "blogsphere-c6342",
    storageBucket: "blogsphere-c6342.appspot.com",
    messagingSenderId: "807104917233",
    appId: "1:807104917233:web:0a294a2f848ea427d20350"
  };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
