function sendMessage() {
	item = document.getElementById("messageToSend");
	message = item.innerText;
	item.innerHTML = "";
	message = message.replaceAll("\n", "");
	chatID = item.getAttribute("value");
	if (message) {
		var key = firebase.database().ref("chats/"+chatID+"/messages").push().key
		var messageToSend = {
            message: message,
            sender: localStorage.username,
            uid: auth.currentUser.uid,
            timestamp: +new Date(),
            id:key,
            offline: !navigator.onLine
        }
		firebase
			.database()
			.ref("chats/" + chatID + "/messages/"+key)
			.set(messageToSend);
		
	}
	firebase.database().ref("chats/"+chatID+"/typing/"+auth.currentUser.uid).remove()
}

function sendImages() {
	selectedImages = document.getElementById("messageToSend").children;
	id = document.getElementById("messageToSend").getAttribute("value");
	function sendImage(i) {
		if (i < selectedImages.length) {
			var file = files[selectedImages[i].getAttribute("value")];
			var type = file.type;
			var chatID = document.getElementById("messageToSend").getAttribute("value")
			fileName = +new Date() + file.name;
			firebase
				.storage()
				.ref(fileName)
				.put(file)
				.then(() => {
					var key = firebase.database().ref("chats/"+chatID+"/messages").push().key
					if (type.split("/")[0] == "image") {
						firebase
							.database()
							.ref("chats/" + id + "/messages/"+key)
							.set({
								timestamp: +new Date(),
								type: "image",
								sender: localStorage.username,
								fileName: fileName,
								uid: auth.currentUser.uid,
								message: "image",
								id:key,
								offline: !navigator.onLine
							});
					} else if (type.split("/")[0] == "video") {
						firebase
							.database()
							.ref("chats/" + id + "/messages")
							.push({
								timestamp: +new Date(),
								type: "video",
								sender: localStorage.username,
								fileName: fileName,
								uid: auth.currentUser.uid,
								message: "video",
								id:key,
								offline: !navigator.onLine
							});
					}
				})
				.then(() => {
					i++;
					sendImage(i);
				});
		} else {
			document.getElementById("messageToSend").innerHTML = "";
			document
				.getElementById("submit")
				.setAttribute("onclick", "sendMessage()");
			document
				.getElementById("messageToSend")
				.setAttribute("contenteditable", true);
		}
	}
	i = 0;
	sendImage(i);
}

document
	.getElementById("messageToSend")
	.addEventListener("DOMNodeRemoved", () => {
		if (document.getElementById("messageToSend").children.length <= 1) {
			document
				.getElementById("messageToSend")
				.setAttribute("contenteditable", true);
			document
				.getElementById("submit")
				.setAttribute("onclick", "sendMessage()");
		}
	});