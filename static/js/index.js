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

function sendMessage(){
    message = document.getElementById("message").value
    username = localStorage.username
    password = localStorage.password
    address=document.getElementById("sender").value

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/sendMessage",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        console.log(xhr.response)
        getMessages()
    }
    xhr.send(JSON.stringify({"username":username, "password":password, "address":address, "message":message, "timestamp":(+ new Date()).toString()}))
}

function getMessages(){
    username = localStorage.username
    password = localStorage.password
    sender=document.getElementById("sender").value

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/getMessages",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        messages = eval(xhr.response)
        document.getElementById("messages").textContent = ""
        for (let i =0; i < messages.length; i++){
            heading = document.createElement("h1")
            heading.appendChild(document.createTextNode(messages[i][2]+" at "+messages[i][1]))

            if (messages[i][3]==username){
                heading.setAttribute("style","text-align:right")
            }else if (messages[i][3]==sender){
                heading.setAttribute("style","text-align:left")
            }

            document.getElementById("messages").appendChild(heading)
        }
    };
    xhr.send(JSON.stringify({"username":username, "password":password, "sender":sender}))
}

socket = io();
document.getElementById("sender").addEventListener("change", function(){
    socket.on(localStorage.username, function(message){
        document.getElementById("messages").textContent = ""
        getMessages()
    })
})