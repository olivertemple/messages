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

function showMessages(item){
    if (document.body.clientWidth <= 600){
        document.getElementById("main").setAttribute("style","display:flex");
        document.getElementById("sender").setAttribute("style","display:none")
        document.getElementById("header").setAttribute("style","display:none")
    }
    getMessages(item)
    socket.on(localStorage.username, function(message){
        document.getElementById("messages").textContent = ""
        getMessages()
    })
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
        document.getElementById("address").innerText = ""
        document.getElementById("address").appendChild(document.createTextNode(sender))
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

function exit(){
    if (document.body.clientWidth <= 600){
        document.getElementById("main").setAttribute("style","display:none");
        document.getElementById("sender").setAttribute("style","display:flex")
        document.getElementById("header").setAttribute("style","display:flex")
    }
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


function promptChats(){
    if (document.body.clientWidth <= 600){
        document.getElementById("main").setAttribute("style","display:flex");
        document.getElementById("sender").setAttribute("style","display:none")
        document.getElementById("header").setAttribute("style","display:none")
        document.getElementById("address").innerText="addChat"
        document.getElementById("messages").innerHTML = ""
        document.getElementById("send").setAttribute("style","display:none")
        input=document.createElement("input")
        input.setAttribute("type","text")
        input.setAttribute("id","addChat")

        input.addEventListener("blur",function(){
            var username = this.value
            item = this
            var xhr = new XMLHttpRequest();
            xhr.open("POST","http://"+location.host+"/checkUsername",true)
            xhr.setRequestHeader("Content-Type","application/json")
            xhr.onload = function(){
                if (xhr.response == "taken"){
                    document.getElementById("send").setAttribute("style","display:flex")
                    document.getElementById("address").innerText=username
                    sender=username
                    addChat(username)
                }else{
                    console.log("user does not exist")
                }
            }
            xhr.send(JSON.stringify({"username":username}))
        })

        input.addEventListener("input",function(){
            var username = this.value
            item = this
            var xhr = new XMLHttpRequest();
            xhr.open("POST","http://"+location.host+"/checkUsername",true)
            xhr.setRequestHeader("Content-Type","application/json")
            xhr.onload = function(){
                if (xhr.response == "taken"){
                    item.setAttribute("style","color:green")
                }else{
                    item.setAttribute("style","color:red")
                }
            }
            xhr.send(JSON.stringify({"username":username}))
        })

        document.getElementById("messages").appendChild(input)
    }   
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
        img.setAttribute("onclick","promptChats()")
        document.getElementById("sender").appendChild(img)
        for (let i=0; i < chats.length; i++){
            div=document.createElement("div")
            heading = document.createElement("h1")
            heading.appendChild(document.createTextNode(chats[i][0]))
            div.appendChild(heading)
            div.setAttribute("value",chats[i][0])
            div.setAttribute("onclick","showMessages(this)")
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
        getChats()
    })
}


document.getElementById("messageToSend").addEventListener("keyup", function(event){
    if (event.key=="Enter"){
        console.log("enter is pressed")
        sendMessage()
    }
})

