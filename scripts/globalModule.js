// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5w0xZIRjyixjgFbhYRqiCLoCIaKQngGo",
  authDomain: "wa-poster.firebaseapp.com",
  projectId: "wa-poster",
  storageBucket: "wa-poster.appspot.com",
  messagingSenderId: "876119684182",
  appId: "1:876119684182:web:ef57c097da8d75899ab7f7",
  measurementId: "G-YD7XGBDRK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(user.email)
      localStorage.setItem('correo', user.email)
      // ...
    } else {
      location.href = "/login";
      M.toast({ html: "Es necesario iniciar sesión para acceder a la información." })
      // User is signed out
      localStorage.setItem('correo', "")
      // ...
    }
  });