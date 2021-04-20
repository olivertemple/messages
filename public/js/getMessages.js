
function getChatDiv(chat) {
	id = chat.getAttribute("value");
	var name = chat.getAttribute("name");
	getChat(id, name);
}
function getChat(id, chatName) {
	document.getElementById("rightHeader").style="display:flex"
	document.getElementById("typing").innerText = ""
	document.getElementById("send").style="display:flex;"
	window.location = "#chat";
	document.getElementById("header").setAttribute("style", "display:none");
	document.getElementById("sender").setAttribute("style", "display:none");
	document.getElementById("main").setAttribute("style", "display:flex");
	document
		.getElementById("messageToSend")
		.setAttribute("style", "display:block");
	document
		.getElementById("submit")
		.setAttribute("style", "transform:rotate(90deg)");
	document
		.getElementById("uploadImage")
		.setAttribute("style", "display:block");


	document.getElementById("back").style = "display:block"

	document.getElementById("messageToSend").setAttribute("value", id);
	document.getElementById("address").innerText = chatName;

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
			images = [];
			message = res.val();

			if(+ new Date() - 2592000000 > message.timestamp){
				firebase.database().ref("chats/"+id+"/messages/"+message.id).remove()
			}
			divs = {};
			if (document.getElementById(message.id) == null){
				var storedChats = (JSON.parse(localStorage.chats))
				storedChats[id].messages[message.id] = message
				localStorage.chats = JSON.stringify(storedChats)
				if (!message.type) {
					messageDiv = document.createElement("div");
					messageDiv.setAttribute("class", "message");
					messageDiv.setAttribute("id", message.id);
					div = document.createElement("div");
					h1 = document.createElement("h1");
	
					h3 = document.createElement("h3");
	
					h1.appendChild(
						document.createTextNode(message.message)
					);
	
					var date = new Date(message.timestamp);
					hours = date.getHours();
					mins = date.getMinutes();
					if (mins.toString().length == 1){
						mins = "0" + mins.toString()
					}
					time = hours + ":" + mins;
	
					h3.appendChild(document.createTextNode(time));
	
					if (message.uid == auth.currentUser.uid) {
						div.setAttribute("class", "right");
					} else {
						div.setAttribute("class", "left");
						h2 = document.createElement("h2");
						h2.appendChild(
							document.createTextNode(
								message.sender
							)
						);
						div.appendChild(h2);
					}
					div.appendChild(h1);
					div.appendChild(h3);
					messageDiv.appendChild(div);
					messageDiv.setAttribute("value",message.timestamp)
					divs[message.timestamp] = messageDiv;
					if (message.offline){
						
						console.log(message)
						displayedMessages = document.getElementsByClassName("message")
						for (let item=0; item < displayedMessages.length -1; item++){
							var timestamp = parseInt(displayedMessages[item].getAttribute("value"))
							var nextTimestamp = parseInt(displayedMessages[item+1].getAttribute("value"))
							if (message.timestamp > timestamp && message.timestamp < nextTimestamp){
								document.getElementById("messages").insertBefore(messageDiv, displayedMessages[item])
								break
							}else{
								if(item+1 == displayedMessages.length - 1){
									document.getElementById("messages").prepend(messageDiv)
								}
							}
						}
					}else{
						document
						.getElementById("messages")
						.prepend(messageDiv);
					}
					
				} else {
					if (message.type == "alert") {
						messageDiv = document.createElement("div");
						messageDiv.setAttribute("class", "message");
						messageDiv.setAttribute("id", message);
						div = document.createElement("div");
						h1 = document.createElement("h1");
	
						h1.appendChild(
							document.createTextNode(
								message.message
							)
						);
	
						div.appendChild(h1);
						div.setAttribute("id", "alert");
						messageDiv.appendChild(div);
						divs[message.timestamp] = messageDiv;
						document
							.getElementById("messages")
							.prepend(messageDiv);
					} else if (message.type == "image") {
						messageDiv = document.createElement("div");
						messageDiv.setAttribute("class", "message");
						messageDiv.setAttribute("id", message);
						div = document.createElement("div");
						img = document.createElement("img");
						img.setAttribute("id", message.timestamp);
						img.setAttribute("loading","lazy")
						h3 = document.createElement("h3");
	
						var date = new Date(message.timestamp);
						hours = date.getHours();
						mins = date.getMinutes();
	
						time = hours + ":" + mins;
	
						h3.appendChild(document.createTextNode(time));
	
						if (message.uid == auth.currentUser.uid) {
							div.setAttribute("class", "right");
						} else {
							div.setAttribute("class", "left");
							h2 = document.createElement("h2");
							h2.appendChild(
								document.createTextNode(
									message.sender
								)
							);
							div.appendChild(h2);
						}
						div.appendChild(img);
						div.appendChild(h3);
	
						messageDiv.appendChild(div);
						images.push([
							[message.timestamp],
							message.fileName,
						]);
	
						divs[message.timestamp] = messageDiv;
						document
							.getElementById("messages")
							.prepend(messageDiv);
					} else if (message.type == "video") {
						messageDiv = document.createElement("div");
						messageDiv.setAttribute("class", "message");
						messageDiv.setAttribute("id", message);
						div = document.createElement("div");
						video = document.createElement("video");
						video.setAttribute("controls", true);
						video.setAttribute(
							"id",
							message.timestamp
						);
						video.setAttribute("value", "video");
						video.setAttribute("class", "video-js");
						video.setAttribute("preload", "none");
						video.setAttribute("data-setup", "{}");
	
						h3 = document.createElement("h3");
	
						var date = new Date(message.timestamp);
						hours = date.getHours();
						mins = date.getMinutes();
	
						time = hours + ":" + mins;
	
						h3.appendChild(document.createTextNode(time));
	
						if (message.uid == auth.currentUser.uid) {
							div.setAttribute("class", "right");
						} else {
							div.setAttribute("class", "left");
							h2 = document.createElement("h2");
							h2.appendChild(
								document.createTextNode(
									message.sender
								)
							);
							div.appendChild(h2);
						}
						div.appendChild(video);
						div.appendChild(h3);
	
						messageDiv.appendChild(div);
						images.push([
							[message.timestamp],
							message.fileName
						]);
	
						divs[message.timestamp] = messageDiv;
						document
							.getElementById("messages")
							.prepend(messageDiv);
					}
				}
			}
			
			document.getElementById(
				"messages"
			).scrollTop = document.getElementById(
				"messages"
			).scrollHeight;
			let i = 0;
			loop(i, images);
			function loop(i, images) {
				if (i < images.length) {
					firebase
						.storage()
						.ref(images[i][1])
						.getDownloadURL()
						.then((url) => {
							document
								.getElementById(images[i][0])
								.setAttribute("src", url);
							if (
								document
									.getElementById(images[i][0])
									.getAttribute("value") == "video"
							) {
								try {
									document
										.getElementById(images[i][0])
										.load();
								} catch (err) {
									alert(err);
								}
							}
							i++;
							loop(i, images);
						});
				} else {
					document.getElementById(
						"messages"
					).scrollTop = document.getElementById(
						"messages"
					).scrollHeight;
				}
			}

			document.getElementById(
				"messages"
			).scrollTop = document.getElementById("messages").scrollHeight;
			
			
		});
}