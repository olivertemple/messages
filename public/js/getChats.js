function getChatDiv(chatIn) {
	if (document.getElementById("viewImage")){
		hideImage()
	}
	for (var chat in globalChats){
		globalChats[chat].messagesDiv.style="display:none"
	}
	id = chatIn.getAttribute("value");
	var name = chatIn.getAttribute("name");
	document.getElementById("chatSettings").style=""
	globalChats[id].showMessages()
	globalChats[id].updateSettings()
	if (window.screen.width < 600){
		document.getElementById("sender").style="display:none"
		document.getElementById("header").style="display:none"
		document.getElementById("main").style="display:flex"
	}
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

