function getChatDiv(chatIn) {
	for (var chat in globalChats){
		globalChats[chat].messagesDiv.style="display:none"
	}
	id = chatIn.getAttribute("value");
	var name = chatIn.getAttribute("name");
	document.getElementById("chatSettings").style=""
	globalChats[id].showMessages()
	globalChats[id].updateSettings()
	if (window.innerWidth < 600){
		document.getElementById("sender").style="display:none"
		document.getElementById("header").style="display:none"
		document.getElementById("main").style="display:flex"
	}
}
function getChat(id, chatName) {
	document.getElementById("rightHeader").style="display:flex"
	document.getElementById("typing").innerText = ""
	document.getElementById("send").style="display:flex;"
	window.location = "#chat";
	document.getElementById("header").setAttribute("style", "display:none");
	document.getElementById("sender").setAttribute("style", "display:none");
	document.getElementById("main").setAttribute("style", "display:flex");
	document.getElementById("messageToSend").setAttribute("style", "display:block");
	document.getElementById("submit").setAttribute("style", "transform:rotate(90deg)");
	document.getElementById("uploadImage").setAttribute("style", "display:block");
	document.getElementById("back").style = "display:block"
	document.getElementById("messageToSend").setAttribute("value", id);
	document.getElementById("address").innerText = chatName;

	document.getElementById("currentChatName").innerText = document.getElementById("address").innerText

	document.getElementById("messageToSend").addEventListener("input", () => {
		if (document.getElementById("messageToSend").innerText != "") {
			firebase
				.database()
				.ref("chats/" + id + "/typing/" + auth.currentUser.uid)
				.set(localStorage.username);
		} else {
			firebase
				.database()
				.ref("chats/" + id + "/typing/" + auth.currentUser.uid)
				.remove();
		}
	});
	
	firebase.database().ref("chats/"+id+"/people").on("value",res => {
		people = [];
		for (person in res.val()) {
			people.push(person);
		}
		document.getElementById("people").innerHTML = "";
		for (person in people) {
			if (people[person] != auth.currentUser.uid) {
				firebase
					.database()
					.ref("users/" + people[person] + "/username")
					.get()
					.then((res) => {
						h2 = document.createElement("h2");
						h2.appendChild(document.createTextNode(res.val()));
						document.getElementById("people").appendChild(h2);
					});
			} else {
				h2 = document.createElement("h2");
				h2.appendChild(document.createTextNode("you"));
				document.getElementById("people").appendChild(h2);
			}
		}
	})
    
	firebase.database().ref("chats/"+id+"/typing").on("value", res => {
		document.getElementById("typing").innerText = ""
		if (res.val()) {
			h1 = document.getElementById("typing")
			typing = res.val();
			keys = [];
			for (key in typing) {
				if (key != auth.currentUser.uid) {
					keys.push(key);
				}
			}
			if (keys.length == 1) {
				h1.innerText = typing[keys[0]] + " is typing";
			} else if (keys.length == 2) {
				h1.innerText =
					typing[keys[0]] +
					" and " +
					typing[keys[1]] +
					" are typing";
			} else if (keys.length > 2) {
				h1.innerText =
					typing[keys[0]] +
					", " +
					typing[keys[1]] +
					" and " +
					(keys.length - 2).toString() +
					" more are typing";
			}
		}
	})
	
	firebase.database().ref("chats/"+id+"/name").on("value", res => {
		chatName = res.val();
		if (chatName) {
			document.getElementById(id).children[0].innerText = chatName;
			document.getElementById(id).setAttribute("name", chatName);
		}
	})

	firebase
		.database()
		.ref("chats/" + id+"/messages")
		.on("child_added", (res) => {
			message = res.val();
			if(+ new Date() - 2592000000 > message.timestamp){
				firebase.database().ref("chats/"+id+"/messages/"+message.id).remove()
			}
			if (document.getElementById(message.id) == null){
				var storedChats = (JSON.parse(localStorage.chats))
				storedChats[id].messages[message.id] = message
				localStorage.chats = JSON.stringify(storedChats)

                let messageObj = new Message(message)
                document.getElementById("messages").prepend(messageObj.messageEl)
			}
		});
}


function getChats() {
	firebase
		.database()
		.ref("users/" + auth.currentUser.uid + "/chats")
		.on("value", (userChats) => {
			userChats = userChats.val();
			try {
				for (var chat in globalChats){
					globalChats[chat].div.remove()
				}
				document
					.getElementById("noChats")
					.setAttribute("style", "display:none");

				function doAThing(id, chatid){
					firebase.database().ref("chats/"+id+"/people").get().then(res => {
						var people = []
						for (person in res.val()){
							people.push(person)
						}
						firebase.database().ref("chats/"+id+"/name").get().then(name => {
							chat = new Chat(id, people, name.val(), chatid)
						})
					})
				}
				for (id in userChats) {
					doAThing(userChats[id], id)
					
					/*
					firebase
						.database()
						.ref("chats/" + userChats[i])
						.get()
						.then((data) => {
							chat = data.val();
							if (document.getElementById(chat.id) != null){
								document.getElementById(chat.id).remove()
							}
								
							shownChats = document.getElementsByClassName(
								"chat"
							);
							chatIDs = [];
							for (let j = 0; j < shownChats.length; j++) {
								chatIDs.push(
									shownChats[j].getAttribute("value")
								);
							}
							if (!chatIDs.includes(chat.id.toString())) {
								showChat(chat)
							}
						});*/
				}
			} catch (err){
				document
					.getElementById("noChats")
					.setAttribute("style", "display:block");
			}
			if (userChats == null) {
				document
					.getElementById("noChats")
					.setAttribute("style", "display:block");
			}
			
		});
}

