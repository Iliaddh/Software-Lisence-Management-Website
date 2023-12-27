import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , updateProfile , updateEmail , reauthenticateWithCredential, EmailAuthProvider} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js"
import { getDatabase , set , ref , get , push , update} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js"

var firebaseConfig = {
    apiKey: "AIzaSyByo8gYcjxjt7QqaGbi3FhL6cf_EC8Sc6U",
    authDomain: "soen287-91968.firebaseapp.com",
    projectId: "soen287-91968",
    storageBucket: "soen287-91968.appspot.com",
    messagingSenderId: "158494012225",
    appId: "1:158494012225:web:4d3ba4e700e28d4fdfa7c0",
    measurementId: "G-RG83XL2ZWL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

  // Function to get user data based on UID
async function getUserData(userId) {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData;
    } else {
        console.log('No user data found');
    }
};

export { auth , createUserWithEmailAndPassword, signInWithEmailAndPassword , database , signOut , set , ref ,
        updateProfile , get , getUserData , push , update , updateEmail , reauthenticateWithCredential, EmailAuthProvider}
