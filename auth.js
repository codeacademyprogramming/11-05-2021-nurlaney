/// auth

var username = document.getElementById('username');
var fullname = document.getElementById('fullname');
var email = document.getElementById('email');

document.getElementById('submit').addEventListener('click', function() {
    let session = {
        'username': username.value,
        'fullname': fullname.value,
        'email': email.value
    }
    let expireDate = new Date(new Date().getTime() * 1000 * 60 * 60 * 10);
    sessionStorage.setItem('user-data', JSON.stringify(session));
    document.cookie = "token=supersecuretoken; expires=" + expireDate.toUTCString() + ";";

    document.location.href = 'http://127.0.0.1:5500/index.html'
})