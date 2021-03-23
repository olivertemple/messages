document.getElementById("username").addEventListener("input", function(){
    username = this.value
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://"+location.host+"/checkUsername",true)
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
    if (phone.length>0 && username.length>0 && password.length>0){
        var xhr = new XMLHttpRequest();
        xhr.open("POST","http://"+location.host+"/addUser",true)
        xhr.setRequestHeader("Content-Type","application/json")
        xhr.onload = function(){
            if (xhr.response != "username already exists"){
                localStorage.password = xhr.response
                localStorage.username = username
                localStorage.phone = phone
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
        xhr.send(JSON.stringify({"username":username, "email":phone, "password":password}))
    }else{
        document.getElementById("invalid").setAttribute("style","display:block")
        document.getElementById("username").addEventListener("focus", function(){
            document.getElementById("invalid").setAttribute("style","display:none")
        })
        document.getElementById("password").addEventListener("focus", function(){
            document.getElementById("invalid").setAttribute("style","display:none")
        })
        document.getElementById("phone").addEventListener("focus", function(){
            document.getElementById("invalid").setAttribute("style","display:none")
        })
    }
}

document.addEventListener("keyup",function(event){
    if (event.key=="Enter"){
        signup()
    }
})