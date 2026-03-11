import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD88vrO4CbW4QKGfLRVQAdJLvPO8hLFGGo",
  authDomain: "product-management-dashb-7712f.firebaseapp.com",
  projectId: "product-management-dashb-7712f",
  storageBucket: "product-management-dashb-7712f.firebasestorage.app",
  messagingSenderId: "888846892471",
  appId: "1:888846892471:web:bf47f9dfcc794b808d3c32"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
