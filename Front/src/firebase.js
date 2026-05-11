import { initializeApp } from "firebase/app";


import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBqg4j9bMztpT3EqMMzz5iF2mBXv_C62pk",
  authDomain: "fullstock-d8094.firebaseapp.com",
  projectId: "fullstock-d8094",
  storageBucket: "fullstock-d8094.firebasestorage.app",
  messagingSenderId: "980641119122",
  appId: "1:980641119122:web:5f92c3b9af6e8a29631f4b"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exporta para uso no front-end
export { auth, provider, signInWithPopup };
