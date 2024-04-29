import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbC6KF94i5NcjVovs-vYLZwAJ0kXHDEvQ",
  authDomain: "fairshare-ca802.firebaseapp.com",
  projectId: "fairshare-ca802",
  storageBucket: "fairshare-ca802.appspot.com",
  messagingSenderId: "794414846093",
  appId: "1:794414846093:web:c99399888ecb6f621a92c4"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();

export { auth };