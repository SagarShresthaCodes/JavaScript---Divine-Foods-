/*Sagar Shrestha
    ICT 4510 - ADVANCED WEBSITE DESIGN & MANAGEMENT
    8/25/2019  
    JavaScript code which authenticates login upon which hides the login form, displays the admin dashboard and menu, lets the admin enter new item to the menu, and logout to go back to the login page.*/

//Function that returns the api url
function get_api_url() {
    return 'https://ict4510.herokuapp.com/';
};

//Function that returns the api key
function get_api_key() {
    return 'e48f95f554667383a2837f26144d6d9b';
};

//Function that displays the error message
function displayError() {
    document.getElementById("alertMessage").innerHTML = "Please enter correct username and password.";
}

//Function that retrieves the form field values, assigns them to an object, POSTs them in a request and retrieves info using fetch
function getData() {
    //Retreiving the form field values
    let x = document.querySelector("#username").value;
    let y = document.querySelector("#password").value;
    var check;

    //Assigning the collected form field values to an object
    let person = {
        username: x,
        password: y,
    };

    //Function to post the form field values and fetch response from the server
    const newPost = person => {
        const options = {
            method: 'POST',
            body: JSON.stringify(person),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        }
        return fetch('https://ict4510.herokuapp.com/api/login', options) //Using the JavaScript Fetch API which passes the options and fetches responses
            .then(function checkStatus(res) {
                //Case for correct credentials
                if (res.status === 200) {
                    check = true;
                    return res.json();
                }
                //Case for incorrect credentials
                else if (res.status === 401) {
                    check = false;
                    displayError();
                }
            })
            //Saving the user object found in the response to sessionStorage in case of correct credentials
            .then(function checkStatus2(data) {
                if (check === true) {
                    sessionStorage.setItem('object', JSON.stringify(data));
                    document.getElementById("alertMessage").innerHTML = "";
                    hideLoginForm();
                    showMenu();
                    displayAdminDash();
                }
            })
    }
    newPost(person);
}

//Function that displays the menu table upon successful authentication
function showMenu() {
    let url = get_api_url() + 'api/menus?api_key=' + get_api_key();
    fetch(url)
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(function(json) {
            displayMenu(json.menu);
        });
};

//Function that saves new item entered by the admin
function saveNewItem() {
    let obj = JSON.parse(window.sessionStorage.getItem('object'));
    let token = obj.user.token;
    let url = get_api_url() + 'api/menus?api_key=' + get_api_key();

    var item = {
        item: document.getElementById('item').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value
    };

    let request = new Request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        },
        body: JSON.stringify(item),
        mode: 'cors'
    });

    fetch(request)
        .then(function(response) {
            if (response.status === 201) {
                document.getElementById('item').value = '';
                document.getElementById('description').value = '';
                document.getElementById('price').value = '';

                let alertMessage = document.getElementById('alertMessage');
                alertMessage.innerHTML = '<div class="alert alert-success">The item you added has been successfully saved.</div>';

                showMenu();

                setTimeout(function() {
                    let alertMessage = document.getElementById('alertMessage');
                    alertMessage.innerHTML = '';
                }, 4000);

            } else if (response.status === 400) {
                response.json().then(function(response) {

                    let errors = '<ul>';
                    for (let i = 0; i < response.errors.length; i++) {
                        errors += '<li>' + response.errors[i].alertMessage + '</li>';
                    }
                    errors += '</ul>';

                    let alertMessage = document.getElementById('alertMessage');
                    alertMessage.innerHTML = '<div class="alert alert-danger">' + errors + '</div>';

                    setTimeout(function() {
                        let alertMessage = document.getElementById('alertMessage');
                        alertMessage.innerHTML = '';
                    }, 8000);
                });
            } else {
                let alertMessage = document.getElementById('alertMessage');
                alertMessage.innerHTML = '<div class="alert alert-danger">Sorry! Unfortunately the menu item was not saved.</div>';

                setTimeout(function() {
                    let alertMessage = document.getElementById('alertMessage');
                    alertMessage.innerHTML = '';
                }, 4000);
            }
        });
};

//Function that puts the menu items in a table
function displayMenu(menu) {
    if (menu.length === 0) {
        let alertMessage = document.getElementById('alertMessage');
        alertMessage.innerHTML = '<div class="alert alert-info">There are no menu items to display.</div>';
        return false;
    }

    let html = '<thead>';
    html += '<tr>';
    html += '<th>Item</th>';
    html += '<th>Description</th>';
    html += '<th>Price</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    for (let i = 0; i < menu.length; i++) {
        html += '<tr>';
        html += '<td>' + menu[i].item + '</td>';
        html += '<td>' + menu[i].description + '</td>';
        html += '<td>' + menu[i].price + '</td>';
        html += '</tr>';
    }

    html += '</tbody>';

    let menuTable = document.getElementById('menuTable');
    menuTable.innerHTML = html;
};

//Function that hides the admin dashboard
function hideAdminDash() {
    let adminDash = document.getElementsByClassName('adminDash');

    for (let i = 0; i < adminDash.length; i++) {
        adminDash[i].style.display = 'none';
    }
};

//Function that displays the admin dashboard
function displayAdminDash() {
    let adminDash = document.getElementsByClassName('adminDash');

    for (let i = 0; i < adminDash.length; i++) {
        adminDash[i].style.display = 'block';
    }
};

//Function that deletes the user object from sessionStorage, hides the admin dashboard, and displays the login form
function logout() {
    window.sessionStorage.removeItem('object');
    displayLoginForm();
    hideAdminDash();
    return false;
};

//Function that displays the login form
function displayLoginForm() {
    let login = document.getElementById('formId');
    login.style.display = 'block';

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
};

//Function that hides the login form
function hideLoginForm() {
    let login = document.getElementById('formId');
    login.style.display = 'none';
};

//Calling the showMenu function
showMenu();

//Hiding the admin dashboard when the login page loads
(function() {
    hideAdminDash();
}());