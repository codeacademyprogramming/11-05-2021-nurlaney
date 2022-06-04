async function getData(url) {
    let res = await fetch(url);
    return await res.json()
}
async function main() {
    const data = await getData('./db.json');
    let tableData = [];
    let modalData = [];
    // preparing table data to show
    data.forEach(function(el) {
        let tableObj = {
            'id': el.id,
            'Name': el.name,
            'Surname': el.surname,
            'image': el.img,
            'Salary': el.salary.value + ' ' + el.salary.currency,
            'Hasactiveloan': !el.loans.every((item) => item.closed == true),
            'Total monthly pay': !el.loans.every((item) => item.closed == true) ? el.loans.reduce((accum, el) => accum + el.perMonth.value, 0) + ' AZN' : 0,
            'Can apply for loan': el.loans.reduce((accum, el) => accum + el.perMonth.value, 0) < (el.salary.value / 100) * 45 ? true : false,
            '': 'View Loan History'
        }
        for (var i = 0; i < el.loans.length; i++) {
            let modalObj = {
                'CustomerId': el.id,
                'Loaner': el.loans[i].loaner,
                'Amount': el.loans[i].amount.value + ' AZN',
                'Has active loan': !el.loans.every((item) => item.closed == true),
                'Monthly pay': el.loans[i].perMonth.value + ' AZN',
                'Due amount': el.loans[i].dueAmount.value + ' AZN',
                'Time interval': el.loans[i].loanPeriod.start + ' - ' + el.loans[i].loanPeriod.end
            }
            modalData.push(modalObj);
        }

        tableData.push(tableObj);
    });
    //data part end
    generate_table(tableData);
    //find id of clicked row
    document.querySelector('#container').addEventListener('click', function(e) {
        let target = e.target;
        let rowId = target.parentElement.id
        if (target.innerHTML == 'View Loan History') {
            generate_modal_table(modalData, rowId);
        }
    });

    if (document.cookie.indexOf('token=') == -1 && !sessionStorage.getItem('user_register_data')) {
        document.getElementById('bigTable').setAttribute('class', 'd-none');
        document.getElementById('options').setAttribute('class', 'd-none');
        document.getElementById('form-div-register').classList.remove('d-none');
    } else if (sessionStorage.getItem('user_register_data') && document.cookie.indexOf('token=') == -1) {
        document.getElementById('bigTable').setAttribute('class', 'd-none');
        document.getElementById('options').setAttribute('class', 'd-none');
        document.getElementById('form-div').classList.remove('d-none');
    } else {
        const user = await getData('https://randomuser.me/api/');
        sessionStorage.setItem('employee-data', JSON.stringify(user.results[0]));
        var name = document.getElementById('employeeName');
        var email = document.getElementById('employeeEmail');
        var location = document.getElementById('Location');
        var photo = document.getElementById('employeeImg');
        name.innerHTML = `<b>Fullname:</b> <span>${user.results[0].name.first}</span> <span>${user.results[0].name.last}</span>`;
        location.innerHTML = `<b>Country:</b> <span>${user.results[0].location.country}</span> <b>City:</b> <span>${user.results[0].location.city}</span>`;
        email.innerHTML = `<b>Email:</b> <span>${user.results[0].email}</span>`;
        photo.src = `${user.results[0].picture.medium}`
        console.log(user.results[0])
    }
    closeModal();
    changeLang();
    changeTheme();
    register();
    login();
    logout();
}
// generating showing table
function generate_table(data) {
    var body_table = document.getElementById('bigTable');
    var body_tableBody = document.getElementById('tableBody')
    for (var i = 0; i < data.length; i++) {
        var body_tbody_row = document.createElement("tr");
        body_tbody_row.setAttribute('id', `${data[i].id}`)
        body_tbody_row.setAttribute('class', 'tableRow')
        for (var j = 0; j < Object.keys(data[0]).length; j++) {
            var cell = document.createElement("td");
            Object.values(data[i])[j].toString().includes('https') ? cell.innerHTML = `<img src= '${Object.values(data[i])[j]}'>` : cell.innerHTML = Object.values(data[i])[j];
            body_tbody_row.appendChild(cell);
        }

        body_tableBody.appendChild(body_tbody_row);
    }
    body_table.appendChild(body_tableBody);
    document.getElementById('container').appendChild(body_table);
}
//generate modal table
function generate_modal_table(data, id) {
    document.getElementById('overlay').classList.remove('d-none')
    document.getElementById('overlay').classList.add('d-block')
    document.getElementById('modal').classList.remove('d-none')
    document.getElementById('modal').classList.add('d-block')
    var modal_table = document.createElement("table");
    modal_table.setAttribute('id', 'modalTable');
    var modal_theader = document.createElement('thead');
    var modal_tableBody = document.createElement("tbody");

    var modal_thead_row = document.createElement("tr");

    for (var b = 0; b < Object.keys(data[0]).length; b++) {
        var th = document.createElement('th');
        th.innerHTML = Object.keys(data[0])[b];
        modal_thead_row.appendChild(th);
        modal_theader.appendChild(modal_thead_row);
        modal_table.appendChild(modal_theader);
    }
    var modal_tbody_row = document.createElement("tr");

    for (var i = 0; i < data.filter(x => x.CustomerId == id).length; i++) {
        var modal_tbody_row = document.createElement("tr");
        modal_tbody_row.setAttribute('id', `${data[i].id}`)
        modal_tbody_row.setAttribute('class', 'tableRow')
        for (var j = 0; j < Object.keys(data[0]).length; j++) {
            var cell = document.createElement("td");
            cell.innerHTML = Object.values(data.filter(x => x.CustomerId == id)[i])[j]

            modal_tbody_row.appendChild(cell);
            console.log(Object.values(data.filter(x => x.CustomerId == id)))
        }
        modal_tableBody.appendChild(modal_tbody_row);
    }

    modal_table.appendChild(modal_tableBody);
    modal.appendChild(modal_table);
}

function closeModal() {
    //modal close functions
    document.getElementById('overlay').addEventListener('click', function() {
        document.getElementById('overlay').classList.remove('d-block');
        document.getElementById('overlay').classList.add('d-none');
        document.getElementById('modal').classList.remove('d-block');
        document.getElementById('modal').classList.add('d-none');
        var table = document.getElementById('modalTable');
        table.parentNode.removeChild(table);
    });
    document.getElementById('times').addEventListener('click', function() {
        document.getElementById('overlay').classList.remove('d-block')
        document.getElementById('overlay').classList.add('d-none')
        document.getElementById('modal').classList.remove('d-block')
        document.getElementById('modal').classList.add('d-none')
        var table = document.getElementById('modalTable');
        table.parentNode.removeChild(table);
    });
}
localStorage.setItem('theme', 'dark');

function changeTheme() {
    //theme switcher
    let colorChanger = document.getElementById('colorChanger');
    var darkMode = true;
    if (localStorage.getItem('theme') === 'dark') {
        darkMode = false;
    } else if (localStorage.getItem('theme') === 'light') {
        darkMode = true;
    }
    var body = document.getElementsByTagName("body")[0];
    colorChanger.addEventListener('click', function() {
        body.classList.toggle('white')
        document.querySelectorAll('th').forEach(el => {
            el.classList.toggle('text-blacker')
        })
        document.querySelectorAll('td').forEach(el => {
            el.classList.toggle('text-blacker')
        })
        document.querySelectorAll('tr').forEach(el => {
            el.classList.toggle('trr')
        })
        document.querySelectorAll('td').forEach(el => {
            el.classList.toggle('tdd')
        })
        document.querySelectorAll('a').forEach(el => {
            el.classList.toggle('text-blacker')
        })
        localStorage.setItem('theme', document.body.classList.contains('white') ? 'light' : 'dark');
        document.body.classList.contains('white') ? colorChanger.innerHTML = 'Dark mode' : colorChanger.innerHTML = 'Light mode';
    });
}

function changeLang() {
    var selectBox = document.getElementById('languageSelect');
    localStorage.setItem('lang', 'AZ');
    selectBox.addEventListener('change', function() {
        localStorage.setItem('lang', selectBox.value)
    });
}



function register() {
    //register
    var username = document.getElementById('username-reg');
    var fullname = document.getElementById('fullname-reg');
    var email = document.getElementById('email-reg');
    var password = document.getElementById('password-reg');
    document.getElementById('submit').addEventListener('click', function() {
        let session = {
            'username': username.value,
            'fullname': fullname.value,
            'email': email.value,
            'password': password.value
        }
        sessionStorage.setItem('user_register_data', JSON.stringify(session));
    });
}

function login() {
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let error_message = document.getElementById('error-message');
    let dummy_user_data = JSON.parse(sessionStorage.getItem('user_register_data'));
    //login
    document.getElementById('submit-login').addEventListener('click', function() {
        if (username.value == '' || password.value == '') {
            error_message.innerHTML = 'All fields are required'
        } else if (username.value == dummy_user_data.username && password.value == dummy_user_data.password) {
            let expireDate = new Date(new Date().getTime() * 1000 * 60 * 60 * 10);
            document.cookie = "token=supersecuretoken; expires=" + expireDate.toUTCString() + ";";
            const user = getData('https://randomuser.me/api/');
        } else {
            error_message.innerHTML = 'Username or password is wrong'
        }
    });
}

function logout() {
    document.getElementById('logOut').addEventListener('click', function() {
        var d = new Date();
        d.setTime(d.getTime() - (1 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = `token=supersecuretoken;${expires};path=/`;
        window.location.reload();
    });
}

main();