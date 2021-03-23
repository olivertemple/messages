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
    message = document.getElementById("messageToSend").innerText
    document.getElementById("messageToSend").innerText = ""
    username = localStorage.username
    password = localStorage.password
    address=sender

    if (message != ""){
        var xhr = new XMLHttpRequest();
        xhr.open("POST","http://"+location.host+"/sendMessage",true)
        xhr.setRequestHeader("Content-Type","application/json")
        xhr.onload = function(){
            console.log(xhr.response)
            getMessages()
        }
        xhr.send(JSON.stringify({"username":username, "password":password, "address":address, "message":message, "timestamp":(+ new Date()).toString()}))
    }
}

function getMessages(item){
    username = localStorage.username
    password = localStorage.password
    try{
        sender=item.getAttribute("value")
    }catch{
        sender=sender
    }

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
            mins = date.getMinutes()
            if (String(mins).length == 1){
                mins = "0"+String(mins)
            }
            heading2.appendChild(document.createTextNode(date.getHours()+":"+mins))
            message.appendChild(heading)
            message.appendChild(heading2)

            if (messages[i][3]==username){
                message.setAttribute("class","right")
            }else if (messages[i][3]==sender){
                message.setAttribute("class","left")
            }
            messageDiv = document.createElement("div")
            messageDiv.setAttribute("id","message")
            messageDiv.appendChild(message)
        
            document.getElementById("messages").appendChild(messageDiv)
            document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
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
            getChats();
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
        document.getElementById("sender").innerText = ""
        chats = eval(xhr.response)
        img = document.createElement("img")
        img.setAttribute("src","/static/assets/new-email.png")
        img.setAttribute("onclick","addChat()")
        document.getElementById("sender").appendChild(img)
        for (let i=0; i < chats.length; i++){
            div=document.createElement("div")
            heading = document.createElement("h1")
            heading.appendChild(document.createTextNode(chats[i][0]))
            div.appendChild(heading)
            div.setAttribute("value",chats[i][0])
            div.setAttribute("onclick","getMessages(this)")
            document.getElementById("sender").appendChild(div)
        }
    }
    xhr.send(JSON.stringify({"username":username, "password":password}))
}


function addChat(address){
    username = localStorage.username
    password = localStorage.password

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/addChat",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        chats = eval(xhr.response)
        document.getElementById("addChat").setAttribute("style","display:none")
        getChats()
    }
    xhr.send(JSON.stringify({"username":username, "password":password, "address":address}))
}

function onload(){
    loginHash();
    socket = io();
    socket.on(localStorage.username, function(message){
        document.getElementById("messages").textContent = ""
        getMessages()
    })
}

document.getElementById("sender").addEventListener("change", function(){
    socket.on(localStorage.username, function(message){
        document.getElementById("messages").textContent = ""
        getMessages()
    })
})
document.getElementById("messageToSend").addEventListener("keyup", function(event){
    if (event.key=="Enter"){
        console.log("enter is pressed")
        sendMessage()
    }
})

