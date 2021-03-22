function addUser(username, email, password){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/addUser",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        console.log(xhr.response)
        return xhr.response
    }

    xhr.send(JSON.stringify({"username":username,"email":email,"password":password}))
}

function checkUsername(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/checkUsername",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        console.log(xhr.response)
        return xhr.response
    }
    xhr.send(JSON.stringify({"username":localStorage.username}))
}

function changeUsername(newUsername){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/changeUsername",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        console.log(xhr.response)
        if (xhr.response=="success"){
            localStorage.username = newUsername
        }
        return xhr.response
    }
    xhr.send(JSON.stringify({"username":localStorage.username, "newUsername":newUsername, "password":localStorage.password}))
}

function changeEmail(newEmail){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/changeEmail",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        console.log(xhr.response)
        if (xhr.response=="success"){
            localStorage.email=newEmail
        }
        return xhr.response
    }
    xhr.send(JSON.stringify({"username":localStorage.username, "newEmail":newEmail, "password":localStorage.password}))
}

function changePassword(newPassword){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/changePassword",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        console.log(xhr.response)
        if (xhr.response!="invalid password"){
            localStorage.password = xhr.response
        }
        return xhr.response
    }
    xhr.send(JSON.stringify({"username":localStorage.username, "newPassword":newPassword, "password":localStorage.password}))
}

var socket = io();
socket.on('connect', function() {
    socket.emmit('my event', {data: "i am connected!"})
})
