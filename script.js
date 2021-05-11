async function getData(url) {
    let res = await fetch(url);
    return await res.json()
}

const data = await getData('./db.json');

let tableData = [];
let modalData = [];
//data part end

//g variables
var modal = document.getElementById('modal-content');
var body = document.getElementsByTagName("body")[0];
var isSorted = false;
var isSortedActive = false;

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

function Test() {
    document.getElementById('nameSort').addEventListener('click', function() {
        data[0].id = 2;
        console.log(data[0].id)
    })
}
Test();

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

//find id of clicked row
document.querySelector('#container').addEventListener('click', function(e) {
    let target = e.target;
    let rowId = target.parentElement.id
    if (target.innerHTML == 'View Loan History') {
        generate_modal_table(rowId);
    }
});

//generate modal table
function generate_modal_table(id) {
    document.getElementById('overlay').classList.remove('d-none')
    document.getElementById('overlay').classList.add('d-block')
    document.getElementById('modal').classList.remove('d-none')
    document.getElementById('modal').classList.add('d-block')
    var modal_table = document.createElement("table");
    modal_table.setAttribute('id', 'modalTable');
    var modal_theader = document.createElement('thead');
    var modal_tableBody = document.createElement("tbody");

    var modal_thead_row = document.createElement("tr");

    for (var b = 0; b < Object.keys(modalData[0]).length; b++) {
        var th = document.createElement('th');
        th.innerHTML = Object.keys(modalData[0])[b];
        modal_thead_row.appendChild(th);
        modal_theader.appendChild(modal_thead_row);
        modal_table.appendChild(modal_theader);
    }
    var modal_tbody_row = document.createElement("tr");

    for (var i = 0; i < modalData.filter(x => x.CustomerId == id).length; i++) {
        var modal_tbody_row = document.createElement("tr");
        modal_tbody_row.setAttribute('id', `${modalData[i].id}`)
        modal_tbody_row.setAttribute('class', 'tableRow')
        for (var j = 0; j < Object.keys(modalData[0]).length; j++) {
            var cell = document.createElement("td");
            cell.innerHTML = Object.values(modalData.filter(x => x.CustomerId == id)[i])[j]

            modal_tbody_row.appendChild(cell);
            console.log(Object.values(modalData.filter(x => x.CustomerId == id)))
        }
        modal_tableBody.appendChild(modal_tbody_row);
    }

    modal_table.appendChild(modal_tableBody);
    modal.appendChild(modal_table);
}

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

generate_table(tableData);

//theme switcher
localStorage.setItem('theme', 'dark');
let colorChanger = document.getElementById('colorChanger');
var darkMode = true;
if (localStorage.getItem('theme') === 'dark') {
    darkMode = false;
} else if (localStorage.getItem('theme') === 'light') {
    darkMode = true;
}

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
    localStorage.setItem('theme', document.body.classList.contains('white') ? 'light' : 'dark');
    document.body.classList.contains('white') ? colorChanger.innerHTML = 'Dark mode' : colorChanger.innerHTML = 'Light mode';
});

//lang switcher

var selectBox = document.getElementById('languageSelect');
localStorage.setItem('lang', 'AZ');
selectBox.addEventListener('change', function() {
    localStorage.setItem('lang', selectBox.value)
})