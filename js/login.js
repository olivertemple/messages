function login(){
    username = document.getElementById("username").value
    password = document.getElementById("password").value

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/login",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        console.log(xhr.response)
        return xhr.response
    }
    xhr.send(JSON.stringify({"username":username, "password":password}))
}