document.getElementById("username").addEventListener("input", function(){
    username = this.value
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/checkUsername",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        if (xhr.response == "taken"){
            document.getElementById("usernameTaken").setAttribute("style","display:block")
            console.log("taken")
        }else{
            document.getElementById("usernameTaken").setAttribute("style","display:none")
        }
    }
    xhr.send(JSON.stringify({"username":username}))
})

function signup(){
    username = document.getElementById("username").value
    password = document.getElementById("password").value
    phone = document.getElementById("phone").value
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://127.0.0.1:5000/addUser",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        if (xhr.response != "username already exists"){
            localStorage.password = xhr.response
            localStorage.username = username
            localStorage.phone = phone
            window.location.href='./login.html'
        }else{
            alert("invalid username")
        }
    }
    xhr.send(JSON.stringify({"username":username, "email":phone, "password":password}))
}
