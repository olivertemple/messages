function addChat() {
	document.getElementById("main").setAttribute("style", "display:none");
	document.getElementById("users").innerHTML = "";
	document.getElementById("chatName").style = "";
	document
		.getElementById("addChatDivWrapper")
		.setAttribute("style", "top:0;");
	input = document.getElementById("addChat");
	document.getElementById("createChat").style = "";
	

	input.addEventListener("input", () => {
		input.setAttribute("style", "");
	});

	input.addEventListener(
		"change",
		(changeListenerCallback = () => {
			var username = input.value;
			checkUsername(username).then(function (res) {
				if (res) {
					document.getElementById("createChat").style =
						"display:block";
					document
						.getElementById("addChat")
						.setAttribute("style", "color:#44B700");
					setTimeout(function () {
						getUserDataFromUsername(username).then((data) => {
							if (data) {
								user = document.getElementById("addChat").value;
								document
									.getElementById("addChat")
									.setAttribute("style", "");
								document.getElementById("addChat").value = "";
								div = document.createElement("div");
								div.setAttribute("class", "user");
								heading = document.createElement("h1");
								heading.innerText = data[0].username;
								div.appendChild(heading);
								div.setAttribute("onclick", "removeUser(this)");
								div.setAttribute("value", data[1]);
								document
									.getElementById("users")
									.appendChild(div);

								document
									.getElementById("send")
									.setAttribute("style", "display:flex");
								document
									.getElementById("messageToSend")
									.setAttribute("style", "display:none");
								document
									.getElementById("submit")
									.setAttribute("onclick", "createChat()");
								document
									.getElementById("submit")
									.setAttribute(
										"style",
										"display:block; transform:rotate(180deg)"
									);

								var users = document.getElementsByClassName(
									"user"
								);
								if (users.length >= 2) {
									document.getElementById("chatName").style =
										"display:block";
								} else if (users.length == 0) {
									document.getElementById(
										"createChat"
									).style = "";
								} else {
									document.getElementById("chatName").style =
										"";
								}
							}
						});
					}, 500);
				} else {
					if (input.value != "") {
						document
							.getElementById("addChat")
							.setAttribute("style", "color:orangered");
					}
				}
			});
		})
	);
	window.setTimeout(() => {
		document.addEventListener(
			"click",
			(listenForOutsideClick = (e) => {
				if (!e.path.includes(document.getElementById("addChatDiv"))) {
					document
						.getElementById("addChatDivWrapper")
						.setAttribute("style", "");
					document.removeEventListener("touchstart", startSwipe);
					document.removeEventListener("touchend", endSwipe);
					document.removeEventListener(
						"click",
						listenForOutsideClick
					);
					input.removeEventListener("change", changeListenerCallback);
				}
			})
		);
	}, 500);

	document.addEventListener(
		"touchstart",
		(startSwipe = (e) => {
			startY = e.changedTouches[0].clientY;
		})
	);

	document.addEventListener(
		"touchend",
		(endSwipe = (e) => {
			endY = e.changedTouches[0].clientY;
			var change = endY - startY;
			if (change > 100) {
				document.removeEventListener("touchstart", startSwipe);
				document.removeEventListener("touchend", endSwipe);
				document.removeEventListener("click", listenForOutsideClick);
				document
					.getElementById("addChatDivWrapper")
					.setAttribute("style", "");
				input.removeEventListener("change", changeListenerCallback);
			}
		})
	);
}

function removeUser(item) {
	item.remove();
	var users = document.getElementsByClassName("user");
	if (users.length >= 2) {
		document.getElementById("chatName").style = "display:block";
	} else if (users.length == 0) {
		document.getElementById("createChat").style = "";
	} else {
		document.getElementById("chatName").style = "";
	}
}
function createChat(item) {
	document.getElementById("addChatDivWrapper").style = "";
	usersFromDoc = document.getElementsByClassName("user");
	document.getElementById("submit").setAttribute("onclick", "sendMessage()");
	document
		.getElementById("uploadImage")
		.setAttribute("style", "display:block");
	var users = {};
	for (let i = 0; i < usersFromDoc.length; i++) {
		var keys = [];
		for (item in users) {
			keys.push(item);
		}
		if (!keys.includes(usersFromDoc[i].getAttribute("value"))) {
			users[usersFromDoc[i].getAttribute("value")] = "user";
		}
	}

	if (!keys.includes(auth.currentUser.uid)) {
		users[auth.currentUser.uid] = "user";
	}
	var keys = [];
	for (item in users) {
		keys.push(item);
	}
	number = firebase.database().ref("chats/").push().key;
	if (keys.length <= 2) {
		firebase
			.database()
			.ref("chats/" + number)
			.set({
				people: users,
				id: number,
			});
	} else {
		var name = document.getElementById("chatName").value;
		firebase
			.database()
			.ref("chats/" + number)
			.set({
				people: users,
				id: number,
				name: name,
			});
	}
	if (keys.length <= 2) {
		for (let item = 0; item < keys.length; item++) {
			if (keys[item] != auth.currentUser.uid) {
				firebase
					.database()
					.ref("users/" + keys[item])
					.get()
					.then((res) => {
						window.setTimeout(() => {
							getChat(number, res.val().username);
						}, 500);
					});
				break;
			}
		}
	} else {
		window.setTimeout(() => {
			getChat(number, name);
		}, 500);
	}
	for (let item = 0; item < keys.length; item++) {
		firebase
			.database()
			.ref("users/" + keys[item] + "/chats")
			.push(number);
	}

	document.getElementById("messages").innerHTML = "";
}