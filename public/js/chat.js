class Chat{
    constructor(id, people, name, chatid) {
        this.chatid = chatid
        this.id = id
        this.people = people
        this.name = name
        this.greatestMessage = {timestamp : 0}
        globalChats[this.id] = this
        this.messagesDiv = document.createElement("div")
        this.messagesDiv.id = this.id+"messages"
        this.messagesDiv.classList = ["messages"]
        this.messagesDiv.style="display:none"
        document.getElementById("main").insertBefore(this.messagesDiv, document.getElementById("send"))
        this.createBaseChatDiv()
        this.showChat()
        this.getMessages()
    }

    getMessages(){
        this.messages = {}
        firebase.database().ref("chats/"+this.id+"/messages").on("child_added", res => {
            if (res.val().type=="video"){
                var message = new Video(res.val())
            }else if (res.val().type=="image"){
                var message = new ImageChat(res.val())
            }else if (res.val().type=="file"){
                var message = new FileChat(res.val())
            }else if (!res.val().type){
                var message = new TextChat(res.val())
            }else{
                var message = new Message(res.val())
            }
            this.messages[res.val().id] = message
            this.messagesDiv.prepend(message.messageEl)
            this.greatestMessage = message
            this.updateLatestMessage()
            this.reorder()
        })  
    }

    showMessages(){
    	window.location = "#chat";
        this.messagesDiv.style=""
        document.getElementById("send").style="display:flex"
        document.getElementById("back").style="display:block"
        document.getElementById("rightHeader").style="display:flex"
        document.getElementById("address").innerText = this.name

        document.getElementById("messageToSend").setAttribute("value", this.id)
    }

    createBaseChatDiv(){
        this.div = document.createElement("div")
        this.div.setAttribute("value",this.id)
        this.div.id = this.id
        this.div.classList = ["chat"]
        this.div.setAttribute("onclick","getChatDiv(this)")
        this.div.setAttribute("people",JSON.stringify(this.people))
        this.h1 = document.createElement("h1")
        this.div.appendChild(this.h1)
        this.h2 = document.createElement("h2")
        this.h2.setAttribute("value",0)
        this.div.appendChild(this.h2)
    }

    showChat(){
        if (this.name){
            this.div.setAttribute("name",this.name)
            this.h1.innerText = this.name
            this.reorder()
        }else{
            for (var person in this.people){
                if (this.people[person] != auth.currentUser.uid){
                    firebase.database().ref("users/"+this.people[person]+"/username").get().then(username => {
                        var username = username.val()
                        this.name = username
                        this.div.setAttribute("name",this.name)
                        this.h1.innerText = username
                        this.reorder()
                    })
                }
            }
        }
        
    }
    updateSettings(){
        var peopleDiv = document.getElementById("people")
        peopleDiv.innerHTML = ""
        for (var person in this.people){
            firebase.database().ref("users/"+this.people[person]+"/username").get().then(res => {
                var h1 = document.createElement("h2")
                h1.innerText = res.val()
                peopleDiv.append(h1)
            })
        }
        document.getElementById("currentChatName").innerText = this.name
        if (this.people.length == 2){
            document.getElementById("leave").style="display:none"
            document.getElementById("addUserToChat").style=""
            document.getElementById("changeChatName").style="display:none"
        }else{
            document.getElementById("leave").style=""
            document.getElementById("addUserToChat").style=""
            document.getElementById("changeChatName").style=""
        }
    }

    reorder(){
        this.div.remove()
        var shownDivs = document.getElementsByClassName("chat")
        var shown = false
        for (let i = 0; i<shownDivs.length; i++){
            if (this.greatestMessage.timestamp > shownDivs[i].children[1].getAttribute("value")){
                    document.getElementById("sender").insertBefore(this.div, shownDivs[i])
                    shown = true
                    break
            }
            
            
        }
        
        if (!shown){
            if (this.messages){
                document.getElementById("sender").appendChild(this.div)
            }else{
                document.getElementById("sender").prepend(this.div)
            }
            shown = true

            
        }
        
        

    }

    updateLatestMessage(){
        this.h2.setAttribute("value",this.greatestMessage.timestamp)
        if (this.greatestMessage.uid == auth.currentUser.uid){
            this.h2.innerText = "you: "+this.greatestMessage.message
        }else{
            if (this.people.length == 2){
                this.h2.innerText = this.greatestMessage.message
            }else{
                this.h2.innerText = this.greatestMessage.sender+": "+this.greatestMessage.message
            }
        }
    }

    addUser(){
        var input = document.createElement("input");
        input.setAttribute("style", "display:block");
        input.setAttribute("placeholder", "username");
        input.setAttribute("list","availableUsers")
        input.setAttribute("autocomplete","off")
        document.getElementById("people").prepend(input);
    }

    leaveChat(){
        exitSettings()
        exit()
        document.getElementById(this.id).remove()
        var key = firebase.database().ref("chats/"+this.id+"/messages").push().key
		var messageToSend = {
            message: localStorage.username+" left the chat",
            sender: "alert",
            uid: auth.currentUser.uid,
            timestamp: +new Date(),
            id:key,
            offline: !navigator.onLine,
            type:"alert"
        }
		firebase
			.database()
			.ref("chats/" + this.id + "/messages/"+key)
			.set(messageToSend);

        firebase.database().ref("users/"+auth.currentUser.uid+"/chats/"+this.chatid).remove()
        firebase.database().ref("chats/"+this.id+"/people/"+auth.currentUser.uid).remove()
    }
}


function showSettings(){
    var id = document.getElementById("messageToSend").getAttribute("value")
    document.getElementById(id+"messages").style="display:none";
    document.getElementById("send").style="display:none"
    document.getElementById("back").setAttribute("onclick","exitSettings()")
    document.getElementById("rightHeader").style="display:none"
    window.location = "#settings"
    document.getElementById("chatSettings").style="display:block"
}



function changeChatName() {
	nameHeading = document.getElementById("currentChatName");
	nameHeading.setAttribute("style", "display:none");
	var chatName = nameHeading.innerText;

	document.getElementById("newChatName").value = chatName;
	document
		.getElementById("newChatName")
		.setAttribute("style", "display:block");
	document.getElementById("newChatName").focus();
	document.getElementById("newChatName").addEventListener("blur", change);
}

function change() {
	var newName = document.getElementById("newChatName").value;
	nameHeading.setAttribute("style", "display:block");
	nameHeading.innerText = newName;
	document
		.getElementById("newChatName")
		.setAttribute("style", "display:none");

	if (newName != chatName) {
		document.getElementById("address").innerText = newName;
		firebase
			.database()
			.ref(
				"chats/" +
					document
						.getElementById("messageToSend")
						.getAttribute("value") +
					"/name"
			)
			.set(newName);
	}
}

function addUserToChat() {
    var input = document.createElement("input");
    input.setAttribute("style", "display:block");
    input.setAttribute("placeholder", "username");
    input.setAttribute("list","availableUsers")
    input.setAttribute("autocomplete","off")
    document.getElementById("people").prepend(input);

	input.addEventListener("blur", () => {
        if (input.value != ""){
            checkUsername(input.value).then((res) => {
                if (res) {
                    input.setAttribute("style", "display:none");
                    
                    getUserDataFromUsername(input.value).then((res) => {
                        id = document.getElementById("messageToSend").getAttribute("value");
                        firebase.database().ref("chats/"+id+"/people").get().then(pep => {
                            pep = pep.val()
                            people = []
                            for (key in pep){
                                people.push(key)
                            }
                            if (!people.includes(res[1])){
                                h2 = document.createElement("h2");
                                h2.appendChild(document.createTextNode(input.value));
                                document.getElementById("people").appendChild(h2);
                                firebase
                                    .database()
                                    .ref("users/" + res[1] + "/chats/")
                                    .push(id);
                                firebase
                                    .database()
                                    .ref("chats/" + id + "/people/" + res[1])
                                    .set("user");
                            }
                        })
                        
                        
                    });
                    let key = firebase.database().ref("chats/"+id+"/messages").push().key
                    firebase
                        .database()
                        .ref("chats/" + id + "/messages/"+key)
                        .set({
                            id:key,
                            message: input.value + " was added to the chat",
                            timestamp: +new Date(),
                            type: "alert",
                            sender: "alert",
                            uid:0
                        });
                    
                } else {
                    if (input.value != "") {
                        input.setAttribute("style", "display:block; color:red");
                    } else {
                        input.setAttribute("style", "");
                    }
                }
            });
        }else{
            input.setAttribute("style", "display:none");
        }
		
	});
	input.addEventListener("input", () => {
		input.setAttribute("style", "display:block; color: black");
	});
	input.focus();
}
