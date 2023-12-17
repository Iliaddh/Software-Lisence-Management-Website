import { auth , database, get , ref , getUserData } from "./firebaseConfig.js"


const signIn = document.getElementById("signInDiv");
const signInSide = document.getElementById("signInDiv-side");
const LogOut = document.getElementById("LogOutDiv");
const LogOutSide = document.getElementById("LogOutDiv-side");
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu1");

var ProviderisLoggedIn = false;
var ClientisLoggedIn= false;
ProviderisLoggedIn = localStorage.getItem('ProviderisLoggedIn') === 'true';
ClientisLoggedIn = localStorage.getItem('ClientisLoggedIn') === 'true';


let userData;

auth.onAuthStateChanged(async (user) => {
  if (user) {
      // User is signed in
      console.log('User is signed in:', user);
      
      // Retrieve user data from the Realtime Database based on UID
      const userId = user.uid;
      userData = await getUserData(userId);
      console.log('User data retrieved:', userData);
      document.getElementById('signIn').textContent = userData.firstName[0].toUpperCase() + userData.lastName[0].toUpperCase();
  } else {
      // User is signed out
      console.log('User is signed out');
}
});

function signInHandler1() {
 if(userData && userData.provider ){
  window.location.href = "ProviderLisencesAndClients.html";
 }else if(userData && !userData.provider){
  window.location.href = "ClientPage.html";
 }else{
  window.location.href = "login.html";
 }
}

function hamburgerHandler(){
        sideMenu.style.display = "block";
        hamburger.src = "./assets/icons8-cross-50.png";

        hamburger.addEventListener("click", function() {
            hamburger.src = "./assets/icons8-hamburger-menu-48.png";
            sideMenu.style.display = "none";
        });
}

function crossHandler(){
    sideMenu.style.display = "none";
}

signIn.addEventListener("click" , signInHandler1);


// signInSide.addEventListener("click" , signInHandler2);
hamburger.addEventListener("click", hamburgerHandler);


// Function to check if the footer should be shown
function checkFooterVisibility() {
    const footer = document.getElementById("myFooter");
    const html = document.documentElement;
  
    if (html.clientHeight + html.scrollTop >= html.scrollHeight) {
      footer.classList.add("show");
    } else {
      footer.classList.remove("show");
    }
  }
  
  // Event listener for scrolling
  window.addEventListener("scroll", checkFooterVisibility);
  
  // Event listener for dragging the scrollbar
  window.addEventListener("resize", checkFooterVisibility);
  
  // Initially hide the footer
  document.addEventListener("DOMContentLoaded", function () {
    const footer = document.getElementById("myFooter");
    footer.classList.remove("show");
  });