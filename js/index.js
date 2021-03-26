//TODO:
//!Make it so that you cannot create a chat that allready exists.
//!Make it so you cannot create a chat with only yourself.
//!add sign in with google

var firebaseConfig = {
    apiKey: "AIzaSyD7Gabw0iS55wqJ2jJq3T6b0GX8ys-T5DA",
    authDomain: "messages-cf547.firebaseapp.com",
    databaseURL: "https://messages-cf547-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "messages-cf547",
    storageBucket: "messages-cf547.appspot.com",
    messagingSenderId: "410065535747",
    appId: "1:410065535747:web:318ce0834df551f5911f36",
    measurementId: "G-TLWM2Y484G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth=firebase.auth()

function logout(){
    firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(!firebaseUser){
        window.location.href = "/login.html"
    }
})


function addChat(){
    if (document.body.clientWidth <= 600){
        document.getElementById("main").setAttribute("style","display:flex");
        document.getElementById("sender").setAttribute("style","display:none")
        document.getElementById("header").setAttribute("style","display:none")
        document.getElementById("address").innerText="addChat"
        document.getElementById("messages").innerHTML = ""
        document.getElementById("send").setAttribute("style","display:none")
    }

    input=document.createElement("input")
    input.setAttribute("type","text")
    input.setAttribute("id","addChat")
    input.setAttribute("placeholder","email")
    input.addEventListener("input",function(){
        var email = this.value

        start = + new Date()
        setTimeout(function(){
            finnish = + new Date()
            if (finnish-start > 500){
                checkEmail(email).then(function(res){
                    if(res){
                        document.getElementById("addChat").setAttribute("style","color:#44B700")
                        setTimeout(function(){
                            getUserDataFromEmail(email).then(data=>{
                                if (data){
                                    if(!document.getElementById("users")){
                                        var div = document.createElement("div")
                                        div.setAttribute("id","users")
                                        document.getElementById("messages").appendChild(div)
                                    }
                                    user = document.getElementById("addChat").value
                                    document.getElementById("addChat").setAttribute("style","")
                                    document.getElementById("addChat").value=""
                                    div = document.createElement("div")
                                    div.setAttribute("class","user")
                                    heading = document.createElement("h1")
                                    heading.innerText=data[0].username
                                    div.appendChild(heading)
                                    div.setAttribute("onclick","this.remove()")
                                    div.setAttribute("value",data[1])
                                    document.getElementById("users").appendChild(div)

                                    var img = document.createElement("img")
                                    img.setAttribute("src","/assets/back.png")
                                    img.setAttribute("id","submit")
                                    img.setAttribute("onclick","createChat()")
                                    document.getElementById("messages").appendChild(img)
                                }
                            });
                            
                        },1000)
                    }else{
                        document.getElementById("addChat").setAttribute("style","color:orangered")
                    }
                })
            }
        }, 500)
    })
    document.getElementById("messages").appendChild(input)
    
}

function createChat(){
    users = []
    usersFromDoc = document.getElementsByClassName("user")
    for (let i=0; i < usersFromDoc.length; i++){
        if (!users.includes(usersFromDoc[i].getAttribute("value"))){
            users.push(usersFromDoc[i].getAttribute("value"))
        }
    }
    if (!users.includes(auth.currentUser.uid)){
        users.push(auth.currentUser.uid)
    }
    firebase.database().ref("chats").get().then(function(data){
        try{
            number = (data.val().length)
        }catch{
            number=0
        }
        firebase.database().ref("chats/"+number).set({
            people:users
        });
        for (let i=0; i <users.length; i++){
            firebase.database().ref("users/"+users[i]+"/chats").get().then(function(data){
                try{
                    length = data.val().length
                }catch{
                    length=0
                }
                firebase.database().ref("users/"+users[i]+"/chats/"+length).set(number)
            })
        }
    }).then(function(){
        document.getElementById("messages").innerHTML = ""
        document.getElementById("send").setAttribute("style","display:flex")
        document.getElementById("address").innerText = "chat name"
    })
    
    
    
}
function exit(){
    if (document.body.clientWidth <= 600){
        document.getElementById("main").setAttribute("style","display:none");
        document.getElementById("sender").setAttribute("style","display:flex")
        document.getElementById("header").setAttribute("style","display:flex")
        document.getElementById("send").setAttribute("style","display:flex")
        document.getElementById("messages").innerHTML = ""
    }
}

function checkEmail(email){
    return new Promise(function(resolve){
        emails = []
        firebase.database().ref("users").get().then(function(data){
            temp = (data.val())
            for (item in temp){
                emails.push(temp[item].email)
            }
        }).then(function(){
            if (emails.includes(email)){
                resolve(true)
            }else{
                resolve(false)
            }
        })
    })
    
}

function getUserDataFromEmail(email){
    return new Promise(function(resolve){
        firebase.database().ref("users").get().then(function(data){
            var users = data.val()
            for (item in users){
                if (users[item].email == email){
                    data = [users[item],item]
                    resolve(data)
                }else{
                    resolve(false)
                }
            }
        });
    })
    
}

function getChats(){
    firebase.database().ref("users").get().then(function(data){
        userInfo = data.val()[auth.currentUser.uid]
        if (userInfo.chats){
            chats = userInfo.chats
            console.log(chats)
        }
    });
}