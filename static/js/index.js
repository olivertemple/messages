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
    document.getElementById("message").value = ""
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
            message = document.createElement("div")
            heading = document.createElement("h1")
            heading.appendChild(document.createTextNode(messages[i][2]))
            heading2 = document.createElement("h2")
            date = new Date(parseInt(messages[i][1]))
            heading2.appendChild(document.createTextNode(date.getHours()+":"+date.getMinutes()))
            message.appendChild(heading)
            message.appendChild(heading2)

            if (messages[i][3]==username){
                message.setAttribute("style","text-align:right")
            }else if (messages[i][3]==sender){
                message.setAttribute("style","text-align:left")
            }
        
            document.getElementById("messages").appendChild(message)
        }
    };
    xhr.send(JSON.stringify({"username":username, "password":password, "sender":sender}))
}

function loginHash(){
    username = localStorage.username
    password = localStorage.password

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/loginHash",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        if (xhr.response == "invalid username or password"){
            window.location.href='./login'
        }else{
            getMessages();
        }
    }
    xhr.send(JSON.stringify({"username":username, "password":password}))
}

function getChats(){
    username = localStorage.username
    password = localStorage.password

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/getChats",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        chats = eval(xhr.response)
        for (let i=0; i < chats.length; i++){
            option = document.createElement("option")
            option.setAttribute("value",chats[i][0])
            option.appendChild(document.createTextNode(chats[i][0]))
            document.getElementById("sender").appendChild(option)
            console.log(chats[i])
        }
    }
    xhr.send(JSON.stringify({"username":username, "password":password}))
}

function addChat(){
    username = localStorage.username
    password = localStorage.password
    address = "user3"
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/addChat",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        chats = eval(xhr.response)
        
    }
    xhr.send(JSON.stringify({"username":username, "password":password, "address":address}))
}

socket = io();
document.getElementById("sender").addEventListener("change", function(){
    socket.on(localStorage.username, function(message){
        document.getElementById("messages").textContent = ""
        getMessages()
    })
})