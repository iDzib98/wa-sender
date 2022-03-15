// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'


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

const provider = new GoogleAuthProvider();

btnGoogle.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            M.toast({ html: error.code, classes: "red" })
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
})



onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log(user.email)
        localStorage.setItem('correo', user.email)
        location.href = "/";
    } else {
        console.log("No se ha iniciado sesión")
        progressBar.classList.add('hide')
    }
});


// Listeners
btn_login.addEventListener("click", async (e) => {
    e.preventDefault();
    iniciar_sesion(user_email.value, user_password.value);
})

const iniciar_sesion = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            M.toast({ html: error.code, classes: "red" })
        });
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});


//Inicializamos Materialize
M.AutoInit();


(function () {
    // TODO add service worker code here
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js')
            .then(function () { console.log('Service Worker Registered'); });
    }
})();