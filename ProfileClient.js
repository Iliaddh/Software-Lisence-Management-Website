import { auth , signOut , database , updateProfile , updateEmail} from "./firebaseConfig.js"
import { getDatabase, ref, get, child , update} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';
var currUserName = null;
var currUserEmail = null;
const logOutBtn = document.getElementById("logOut")


logOutBtn.addEventListener('click' , async () => {
    try{
        await signOut(auth);
        console.log("sign out successful");
        window.location.href = 'index.html';
    }catch (error) {
        console.error('Error signing out: ' , error.message);
    }
});
var userID;
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        userID = user.uid;
        getUserData(user.uid); // Call getUserData here
    } else {
        // User is signed out
        console.log('User is signed out');
    }
});

var userData;

function getUserData(userId) {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + userId);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            userData = snapshot.val();
            renderUser(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}


function renderUser(user) {
    const tbody = document.getElementById('userTableBody');
    const pFN = document.getElementById('pFN');
    const pLN = document.getElementById('pLN');
    const pEM = document.getElementById('pEM');
    
    // Clear existing rows
    pFN.innerHTML = '';
    pLN.innerHTML = '';
    pEM.innerHTML = '';

    // Loop through users and create table rows

    console.log(user);
    console.log(auth.currentUser);

    const rowFN = document.createElement('tr');
    const rowLN = document.createElement('tr');
    const rowEM = document.createElement('tr');

    // Add user data to the row
    const firstnameCell = document.createElement('td');
    firstnameCell.textContent = user.firstName; // Assuming each user object has a 'name' property
    rowFN.appendChild(firstnameCell);

    const lastnameCell = document.createElement('td');
    lastnameCell.textContent = user.lastName; // Assuming each user object has a 'name' property
    rowLN.appendChild(lastnameCell);

    const emailCell = document.createElement('td');
    emailCell.textContent = user.email; // Assuming each user object has an 'email' property
    rowEM.appendChild(emailCell);

    // Append the row to the table body
    pFN.appendChild(rowFN);
    pLN.appendChild(rowLN);
    pEM.appendChild(rowEM);
}



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dropdownButton').addEventListener('click', myFunction);
});

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}


document.getElementById('editFN').addEventListener('click' , async () => {
    console.log(userID);
    let newFN = prompt("Please enter a new first name:", "");
    console.log(newFN);

    if (newFN == null || newFN == "") {
        console.log("User cancelled prompt")
      } else {
        const updates = {};
        updates[`/users/${userID}/firstName`] = newFN;
        update(ref(database), updates);

        const newDisplay = newFN + " " + userData.lastName;
        updateProfile(auth.currentUser, {
            displayName: newDisplay
        }).then(() => {
            console.log(auth.currentUser)
        }).catch((error) => {
            console.error("Error updating profile");
        });

        window.location.reload();
      }    
})

document.getElementById('editLN').addEventListener('click' , async () => {
    console.log(userID);
    let newLN = prompt("Please enter a new last name:", "");
    console.log(newLN);

    if (newLN == null || newLN == "") {
        console.log("User cancelled prompt")
      } else {
        const updates = {};
        updates[`/users/${userID}/lastName`] = newLN;
        update(ref(database), updates);

        const newDisplay = userData.firstName + " " + newLN;
        updateProfile(auth.currentUser, {
            displayName: newDisplay
        }).then(() => {
            console.log(auth.currentUser)
        }).catch((error) => {
            console.error("Error updating profile");
        });

        window.location.reload();
      }   
})

// document.getElementById('editEM').addEventListener('click' , async () => {
//     console.log(userID);
//     let newEM = prompt("Please enter a new last name:", "");
//     console.log (newEM);

//     if (newEM == null || newEM == "") {
//         console.log("User cancelled prompt")
//       } else {
//         const updates = {};
//         updates[`/users/${userID}/email`] = newEM;
//         update(ref(database), updates);
//         window.location.reload(); 
//       }   
// })

  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
