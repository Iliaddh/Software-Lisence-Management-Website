import { auth , signOut , database , push } from "./firebaseConfig.js"
import { ref, get, child , remove } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';

const logOutBtn = document.getElementById("logOut")
const addBtn = document.getElementById("add-button");

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

logOutBtn.addEventListener('click' , async () => {
    try{
        await signOut(auth);
        console.log("sign out successful");
        window.location.href = 'mainPage.html';
    }catch (error) {
        console.error('Error signing out: ' , error.message);
    }
});

// Function to render users in the table
function renderUsers(users) {
    const tbody = document.getElementById('userTableBody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Loop through users and create table rows
    users.forEach(user => {
        if(!user.provider){
            const row = document.createElement('tr');

            // Add user data to the row
            const firstnameCell = document.createElement('td');
            firstnameCell.textContent = user.firstName; // Assuming each user object has a 'name' property
            row.appendChild(firstnameCell);

            const lastnameCell = document.createElement('td');
            lastnameCell.textContent = user.lastName; // Assuming each user object has a 'name' property
            row.appendChild(lastnameCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = user.email; // Assuming each user object has an 'email' property
            row.appendChild(emailCell);

            // Actions cell
            const actionsCell = document.createElement('td');

            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.setAttribute('ID' , 'viewButton');
            // Add event listener for delete button click if needed
            actionsCell.appendChild(viewButton);

            viewButton.addEventListener('click' , async () => {
                console.log(await getUserIdByEmail(user.email));
                const userId = await getUserIdByEmail(user.email);
        

                displayLicensesModal(userId , user.firstName , user.lastName);
            })

            row.appendChild(actionsCell);

            // Append the row to the table body
            tbody.appendChild(row);
        }
    });
}

// Function to get users from the database
async function getUsersFromDatabase() {
    const usersRef = ref(database, 'users'); 

    try {
        const snapshot = await get(usersRef);
        if (snapshot.val()) {
            const users = Object.values(snapshot.val()); // Assuming your data is stored as an object where keys are user IDs
            renderUsers(users);
        } else {
            console.log('No users found in the database.');
        }
    } catch (error) {
        console.error('Error retrieving users:', error.message);
    }
}

// Call the function to get users and render them in the table
getUsersFromDatabase();

async function displayLicensesModal(userId , firstName , lastName) {
    
    await getLicenses();
    
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = ''; // Clear existing content

    const userTable = document.createElement('table');
    const thead = document.createElement('thead');
    const row = document.createElement('tr');
    
    modalContent.innerHTML=`
    <section class="section-container></section>
    `
    
    userTable.innerHTML = `
    <caption class="section-subheader"> ${firstName} ${lastName}'s Licenses</caption>
    `


    row.innerHTML = `
    <th> Software </th>
    <th> Duration </th>
    <th> Cost </th>
    <th> Actions </th>
    `

    thead.appendChild(row);
    userTable.appendChild(thead);
    modalContent.appendChild(userTable);

    softwareLicenses.forEach((license , index) => {
        if(license.user === userId){
            const tbody = document.createElement('tbody');
            const row = document.createElement('tr');
            const deleteBtn = document.createElement('td');

            deleteBtn.innerHTML=`
            <button id="delete"> Delete </button> 
            `
            row.innerHTML = `
            <td> ${license.softwareName} </td>
            <td> ${license.duration} </td>
            <td> ${license.cost} </td>
            `

            row.appendChild(deleteBtn);
            tbody.appendChild(row);
            userTable.appendChild(tbody);

            deleteBtn.addEventListener('click' , async () => {
                console.log(softwareKeys[index]);
                remove(ref(database , `softwareLicenses/${softwareKeys[index]}`));
                window.location.reload();
            })
        }
    });


    modal.style.display = 'block';
}

async function getUserIdByEmail(userEmail) {
    const usersRef = ref(database, 'users');

    try {
        const snapshot = await get(child(usersRef, '/'));
        const users = snapshot.val();

        for (const userId in users) {
            if (users[userId].email === userEmail) {
                return userId; // Found the user ID
            }
        }

        console.log('User not found with email:', userEmail);
        return null; // User not found
    } catch (error) {
        console.error('Error fetching user ID by email:', error.message);
        return null;
    }
}

// Add a license code
addBtn.addEventListener('click', async () => {
    const softwareRef = ref(database, 'softwareLicenses');

    const software = {
        softwareName: document.getElementById('software-input').value,
        duration: document.getElementById('duration-input').value,
        cost: document.getElementById('cost-input').value,
        user: '', // This will fill when a user purchases the license
    };

    // Validate input values
    if (!software.softwareName || !software.duration || !software.cost) {
        confirm('Please Fill in All Fields');
        return;
    }

    try {
        await push(softwareRef, software);
        console.log('Software added successfully.');
        if(confirm('Successfully Added License')){
            window.location.reload();  
        }
        } catch (error) {
            if(confirm('Error Adding License, Please Try Again')){
                window.location.reload();  
            }
            console.error('Error adding software:', error.message);
    }
});

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