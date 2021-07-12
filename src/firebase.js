// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";




const firebaseConfig = {
  apiKey: "AIzaSyBCAt2ePMCpcQLTaxg5go0o0HyWvc-fwKE",
  authDomain: "my-mall-582e3.firebaseapp.com",
  databaseURL: "https://my-mall-582e3.firebaseio.com",
  projectId: "my-mall-582e3",
  storageBucket: "my-mall-582e3.appspot.com",
  messagingSenderId: "279993012591",
  appId: "1:279993012591:web:c86c9c7cb93b79c205589a",
  measurementId: "G-QMCCQD806T"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseAuth = firebase.auth();

export const firestore = firebase.firestore();

export const storageRef = firebase.storage().ref();

export default firebase;