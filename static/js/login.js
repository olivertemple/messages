function login(){
    username = document.getElementById("username").value
    password = document.getElementById("password").value

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/loginReq",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        if (xhr.response != "invalid username or password"){
            localStorage.username = username
            localStorage.password = xhr.response
            window.location.href='./'
        }else{
            document.getElementById("invalid").setAttribute("style","display:block")
            document.getElementById("username").addEventListener("focus", function(){
                document.getElementById("invalid").setAttribute("style","display:none")
            })
            document.getElementById("password").addEventListener("focus", function(){
                document.getElementById("invalid").setAttribute("style","display:none")
            })
        }
    }
    xhr.send(JSON.stringify({"username":username, "password":password}))
}

function loginHash(){
    username = localStorage.username
    password = localStorage.password

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/loginHash",true)
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
        if (xhr.response != "invalid username or password"){
            window.location.href='./'
        }
    }
    xhr.send(JSON.stringify({"username":username, "password":password}))
}
document.addEventListener("keyup",function(event){
    if (event.key=="Enter"){
        login()
    }
})