


const LogInButton = document.getElementById("signinBtn");
const signInForm = document.getElementById("signinForm");
const signUpForm = document.getElementById("signupForm");
const toggleButton = document.getElementById("toggleButton");
const toggleButton2 = document.getElementById("toggleButton2");
const signUpBtn = document.getElementById("signUpBtn");



const userPass = {
    userName: "hello@gmail.com",
    userName2: "client@gmail.com",
    password: "123456",
    password2: "7890",
    firstName: "John",
    lastName: "Doe",
    firstName2: "Mike",
    lastName2: "Dillon",
}

import { database, ref ,set , auth, createUserWithEmailAndPassword, signInWithEmailAndPassword , updateProfile} from "./firebaseConfig.js";
const passwordInput = document.getElementById("signUpPassword").value;
// Sign up
signUpBtn.addEventListener('click' , async () => {
    

    event.preventDefault();
    
    // get values from form
    const user = {
        fName: document.getElementById('firstName').value,
        lName: document.getElementById('lastName').value,
        email: document.getElementById('signUpEmail').value,
        provider: document.querySelector('input[name="provider"]:checked').value

    };

    
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordError =document.getElementById("passowrdError");
    const confirmPasswordError =document.getElementById("confirmPassowrdError");
    // if(password.length < 8){
    //     passwordError.style.display = "block";
    //     function myFunction() {
    //         passwordError.style.display = "none";
    //       }
          
    //       // Set a timeout for 2000 milliseconds (2 seconds)
    //       setTimeout(myFunction, 2000);
    // }else{
    //     if(password != confirmPassword){
    //         confirmPasswordError.style.display = "block";
    //         function myFunction() {
    //             confirmPasswordError.style.display = "none";
    //           }
              
    //           // Set a timeout for 2000 milliseconds (2 seconds)
    //           setTimeout(myFunction, 2000);
    //     }
    // }
//check inputs
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const emailInput = document.getElementById('signUpEmail').value;

    // Display a message based on the result
    const firstNameInput = document.getElementById("FirstInputEmpty");
    const lastNameInput = document.getElementById("lastInputEmpty");
    const emptyEmailError = document.getElementById("emptyEmailError");
    const invalidEmailError = document.getElementById("emailError");


    // Regular expression for a simple email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const emailRegex = /r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"/
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const gmailRegex = /^[^\s@]+@gmail\.com$/;
    const emailRegex = /^[^\s@]+@gmail\.com$/;





    if (firstName === '') {
        
        firstNameInput.style.display = "block";
        function FirstInputEmptyFunction(){
            firstNameInput.style.display = "none";
        }

        setTimeout(FirstInputEmptyFunction, 2000);
    } else if(lastName === ''){
        lastNameInput.style.display = "block";
        function LastInputEmptyFunction(){
            lastNameInput.style.display = "none";
        }

        setTimeout(LastInputEmptyFunction, 2000);
    }else if(emailInput === ''){
        emptyEmailError.style.display = "block";
        function LastInputEmptyFunction(){
            emptyEmailError.style.display = "none";
        }

        setTimeout(LastInputEmptyFunction, 2000);
    }
    
    if(emailRegex.test(emailInput) && password.length >= 6 && password == confirmPassword){
    try {
        
            console.log("hi")
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
        // User creation successful
        console.log('User created successfully:', userCredential.user);

        await updateProfile(userCredential.user, {
            displayName: `${user.fName} ${user.lName}`
        });

        // Add user to Database
        await set(ref(database , `users/${userCredential.user.uid}`) , {
            firstName: user.fName,
            lastName: user.lName,
            email: user.email,
            provider: user.provider === 'true'
        });

        window.location.href = "index.html";
    

    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error.code, error.message);
    }


    // Check if user is signed in
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user);
        } else {
            // User is signed out
            console.log('User is signed out');
        }
    });
}else if(!(emailRegex.test(emailInput))){
    invalidEmailError.style.display = "block";
    function LastInputEmptyFunction(){
        invalidEmailError.style.display = "none";
    }

    setTimeout(LastInputEmptyFunction, 2000);
}else if(password.length < 6){
    passwordError.style.display = "block";
    function myFunction() {
        passwordError.style.display = "none";
      }
      
      // Set a timeout for 2000 milliseconds (2 seconds)
      setTimeout(myFunction, 2000);
}else if(password != confirmPassword){
        confirmPasswordError.style.display = "block";
        function myFunction() {
            confirmPasswordError.style.display = "none";
          }
          
          // Set a timeout for 2000 milliseconds (2 seconds)
          setTimeout(myFunction, 2000);
    
}
})


// Sign In 
LogInButton.addEventListener('click' , async (event) => {

    event.preventDefault();

    // Get data from form   
    const userEmail = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const signInError = document.getElementById("logInError");
    // Sign in user
    try{
        await signInWithEmailAndPassword(auth , userEmail , password);
    }catch(error){
        signInError.style.display = "block";
            function myFunction() {
                signInError.style.display = "none";
            }
          
          // Set a timeout for 2000 milliseconds (2 seconds)
          setTimeout(myFunction, 2000);
    }

    // Check if user is signed in
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user);
            window.location.href = 'index.html';
        } else {
            
            // User is signed out
            console.log('User is signed out');
        }
    });
})



toggleButton.addEventListener("click", () => {
        signInForm.style.display = "none"; 
        signUpForm.style.display = "block"; 

        clearInputFields(signInForm);
});

toggleButton2.addEventListener("click", () => {

    signInForm.style.display = "block"; 
    signUpForm.style.display = "none"; 

    clearInputFields(signUpForm);
});


function clearInputFields(form){
    const inputFields = form.querySelectorAll("input[type='text']")
    inputFields.forEach((input) => {
        input.value = "";
    });
}

// function LogInHandler(event) {

//     event.preventDefault();
//     const emailInput = document.getElementById("email").value;
//     const passwordInput = document.getElementById("password").value;
    
//     if(emailInput === userPass.userName && passwordInput === userPass.password){
//         window.location.href = "index.html";
//         ProviderisLoggedIn = true;
//         localStorage.setItem('ProviderisLoggedIn' , ProviderisLoggedIn);
//         console.log(ProviderisLoggedIn)
//     }else if(emailInput === userPass.userName2 && passwordInput === userPass.password2){

//         window.location.href = "index.html";
//         ClientisLoggedIn = true;
//         localStorage.setItem('ClientisLoggedIn' , ClientisLoggedIn);
//         console.log(ClientisLoggedIn)

//     }
//     else{
//         alert("Password or email incorrect!")
//     }
// }


// LogInButton.addEventListener("click", LogInHandler);
