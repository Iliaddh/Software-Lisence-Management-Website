import { auth , signOut , database, set } from "./firebaseConfig.js"
import { ref, get , child , update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";


const logOutBtn = document.getElementById("logOut")

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
    } else {
        // User is signed out
        console.log('User is signed out');
    }
});

logOutBtn.addEventListener('click' , async () => {
    try{
        await signOut(auth);
        console.log("sign out successful");
        window.location.href = 'index.html';
    }catch (error) {
        console.error('Error signing out: ' , error.message);
    }
});


var softwareLicenses;
var softwareKeys;

async function getLicenses(){
    const softwareRef = ref(database, 'softwareLicenses/');

    try {
        const snapshot = await get(child(softwareRef, '/'));
        if (snapshot.val()) {
            softwareLicenses = Object.values(snapshot.val());
            softwareKeys = Object.keys(snapshot.val());
        } else {
            console.log('No software found in the database.');
        }
    } catch (error) {
        console.error('Error retrieving software:', error.message);
    }
}

async function displayLicenses() {

    await getLicenses();

    const licenseTableBody = document.getElementById("license-table-body");

    licenseTableBody.innerHTML = "";
    softwareLicenses.forEach((license , index) => {
        if(license.user == auth.currentUser.uid){
            const expiration = (2023 + Number(softwareLicenses[index].duration)).toString();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${license.softwareName}</td>
                <td>${softwareKeys[index]}</td>
                <td>${expiration}</td>
                <td><button class="delete-button" data-key="${softwareKeys[index]}">Delete</button><button class="renew-button">Renew</button></td>      
            `;

            licenseTableBody.appendChild(row);
        }
    });
}


document.getElementById("license-table-body").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        const licenseKey = event.target.getAttribute('data-key');
        deleteLicenseHandler(licenseKey);
    }
});


async function deleteLicenseHandler(key){
    await getLicenses();

    const updates = {};
    updates[`/softwareLicenses/${key}/user`] = "";
    update(ref(database), updates);
    const row = document.querySelector(`[data-key="${key}"]`);
    if(row){
        row.parentElement.parentElement.remove();
    }
    
}

// Define a function to add a license to the table
async function addLicense(event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    const softwareRef = ref(database, 'softwareLicenses');

    const name = document.getElementById("name").value;
    const key = document.getElementById("key").value;
    const duration = document.getElementById("duration").value;


    if (name && key && duration) {
        const newLicense = { 
            softwareName: name,
            duration: duration,
            user: auth.currentUser.uid,
            cost: 1000,
            userEntry: true
         };

        set(child(softwareRef , key) , newLicense)
            .then(() => {
                console.log('Software added successfully');
            })
            .catch((error) => {
                console.error('Error adding software:', error.message);
            });

        showLicenseForm();
        displayLicenses();
    }
}

// Event listener for the form submission
document.getElementById("add-license-form").addEventListener("submit", addLicense);

function showLicenseForm(){
    if(document.getElementById('add-license-form').style.display == "inline-block")
        document.getElementById("add-license-form").style.display = "none";
    document.getElementById("add-license-form").style.display = "inline-block";
}
document.getElementById("add-license-button").addEventListener("click", showLicenseForm);



async function displayAvailableLicenses() {
    await getLicenses();

    const storeLicensesDiv = document.getElementById("store-licenses");

    storeLicensesDiv.innerHTML = "";
    softwareLicenses.forEach((license, index) => {
        // Check if the license has no user assigned
        if (!license.user && !license.userEntry) {
            const licenseItem = document.createElement("div");
            licenseItem.classList.add("store-license-item");
            licenseItem.innerHTML = `
                <div class="license-details">
                    <h3 id>${license.softwareName}</h3>
                    <p>Price: $${license.cost}</p>
                    <p>Duration: ${license.duration}</p>
                </div>
                <button class="purchase-button" data-name="${license.softwareName}">Purchase</button>
            `;

            storeLicensesDiv.appendChild(licenseItem);
        }
    });
}




async function moveLicenseToUserTable(name) {
    await getLicenses();
    const index = softwareLicenses.findIndex((license) => license.softwareName === name)
    const key = softwareKeys[index];
    const expiration = (2023 + Number(softwareLicenses[index].duration)).toString();

    console.log(softwareKeys);
    const licenseToAdd = {
        name: softwareLicenses[index].softwareName,
        key: key,
        expiration: expiration,
    }
    softwareLicenses.splice(index, 1);

    const updates = {};
    updates[`/softwareLicenses/${key}/user`] = auth.currentUser.uid;
    update(ref(database), updates);

    console.log(softwareLicenses); 

    displayLicenses();
    displayAvailableLicenses();
}

// Event listener for the "Purchase" button clicks
document.getElementById("store-licenses").addEventListener("click", (event) => {
    if (event.target.classList.contains("purchase-button")) {
        const name = event.target.getAttribute("data-name");
        moveLicenseToUserTable(name);
    }
});


window.onload = () => {
    displayLicenses();
    displayAvailableLicenses();
}


// Event listener for the form submission
document.getElementById("add-license-form").addEventListener("submit", addLicense);

document.getElementById("license-table-body").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        const licenseKey = event.target.getAttribute('data-key');
        deleteLicenseHandler(licenseKey);
    } else if (event.target.classList.contains("renew-button")) {
        const licenseKey = event.target.parentElement.querySelector(".delete-button").getAttribute('data-key');
        renewLicenseHandler(licenseKey);
    }
});


async function renewLicenseHandler(key) {
    await getLicenses();


    const yearsToRenew = prompt("Enter the number of years to renew:");

    if (yearsToRenew !== null && !isNaN(yearsToRenew) && parseInt(yearsToRenew) > 0) {
        const updates = {};
        const index = softwareKeys.findIndex((license) => license === key);

        console.log(index)

        softwareLicenses[index].duration = parseInt(softwareLicenses[index].duration) + parseInt(yearsToRenew);
        updates[`/softwareLicenses/${key}/duration`] = softwareLicenses[index].duration;
        update(ref(database) , updates);


        console.log("Updates:", updates);

        displayLicenses();

    } else {
        alert("Invalid input. Please enter a valid number of years.");
    }
}

// ClientDashboard.js
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dropdownButton').addEventListener('click', myFunction);
});


function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

  
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
