//TODO:
//!Make it so that you cannot create a chat that already exists.
//!Store most recent messages in local storage so that they can be displayed when offline
//TODO



if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("./serviceWorker.js", { scope: "/" });
	});
}

var firebaseConfig = {
	apiKey: "AIzaSyD7Gabw0iS55wqJ2jJq3T6b0GX8ys-T5DA",
	authDomain: "messages-cf547.firebaseapp.com",
	databaseURL:
		"https://messages-cf547-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "messages-cf547",
	storageBucket: "messages-cf547.appspot.com",
	messagingSenderId: "410065535747",
	appId: "1:410065535747:web:318ce0834df551f5911f36",
	measurementId: "G-TLWM2Y484G",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
if (firebase.messaging.isSupported()) {
	messaging = firebase.messaging();
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
	if (!firebaseUser) {
		window.location.href = "/login.html";
	} else {
		getChats();
		firebase
			.database()
			.ref("users/" + auth.currentUser.uid + "/username")
			.get()
			.then((res) => {
				localStorage.username = res.val();
			});
		if (messaging) {
			getPermission();
		}
	}
});

function logout() {
	firebase.auth().signOut();
}

function addChat() {
	document.getElementById("main").setAttribute("style", "display:none");
	document.getElementById("users").innerHTML = "";
	document.getElementById("chatName").style = "";
	document
		.getElementById("addChatDivWrapper")
		.setAttribute("style", "top:0;");
	input = document.getElementById("addChat");
	document.getElementById("availableUsers").innerHTML = "";
	document.getElementById("createChat").style = "";
	firebase
		.database()
		.ref("usernames")
		.get()
		.then((res) => {
			for (user in res.val()) {
				if (user != localStorage.username) {
					option = document.createElement("option");
					option.innerText = user;
					document
						.getElementById("availableUsers")
						.appendChild(option);
				}
			}
		});

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
	users = {};
	for (let i = 0; i < usersFromDoc.length; i++) {
		keys = [];
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
	keys = [];
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
			console.log("run");
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
function exit() {
	document.getElementById("main").setAttribute("style", "display:none");
	document.getElementById("sender").setAttribute("style", "display:flex");
	document.getElementById("header").setAttribute("style", "display:flex");
	document.getElementById("send").setAttribute("style", "display:flex");
	document
		.getElementById("uploadImage")
		.setAttribute("style", "display:none");
	document.getElementById("messages").innerHTML = "";
	id = document.getElementById("messageToSend").getAttribute("value");
	window.location = "#home";
	firebase
		.database()
		.ref("chats/" + id +"/messages")
		.off();
	firebase
		.database()
		.ref("chats/" + id +"/typing")
		.off();
	firebase
		.database()
		.ref("chats/" + id +"/name")
		.off();
	firebase
		.database()
		.ref("chats/" + id +"/people")
		.off();

	firebase
		.database()
		.ref("chats/" + id + "/typing/" + auth.currentUser.uid)
		.remove();
}

function checkEmail(email) {
	return new Promise(function (resolve) {
		emails = [];
		firebase
			.database()
			.ref("users")
			.get()
			.then(function (data) {
				temp = data.val();
				for (item in temp) {
					emails.push(temp[item].email);
				}
			})
			.then(function () {
				if (emails.includes(email)) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
	});
}

function checkUsername(username) {
	return new Promise(function (resolve) {
		firebase
			.database()
			.ref("usernames")
			.get()
			.then((data) => {
				data = data.val();
				usernames = [];
				for (item in data) {
					usernames.push(item);
				}
				if (
					usernames.includes(username.toLowerCase()) &&
					username.toLowerCase() !=
						localStorage.username.toLowerCase()
				) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
	});
}

function getUserDataFromUsername(username) {
	return new Promise(function (resolve) {
		firebase
			.database()
			.ref("usernames/" + username)
			.get()
			.then((data) => {
				data = data.val();
				if (data) {
					resolve([{ username: username }, data]);
				} else {
					resolve(false);
				}
			});
	});
}

function getUserDataFromUID(uid) {
	return new Promise(function (resolve) {
		firebase
			.database()
			.ref("users/" + uid)
			.get()
			.then((data) => {
				resolve(data);
			});
	});
}

function getChats() {
	firebase
		.database()
		.ref("users/" + auth.currentUser.uid + "/chats")
		.on("value", (userChats) => {
			userChats = userChats.val();
			try {
				document
					.getElementById("noChats")
					.setAttribute("style", "display:none");
				for (i in userChats) {
					firebase
						.database()
						.ref("chats/" + userChats[i])
						.get()
						.then((data) => {
							chat = data.val();
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
								showChat(chat);
							}
						});
				}
			} catch {
				document
					.getElementById("noChats")
					.setAttribute("style", "display:block");
			}
			if (userChats == null) {
				document
					.getElementById("noChats")
					.setAttribute("style", "display:block");
			}
			document
				.getElementById("loading")
				.setAttribute("style", "display:none");
		});
}

function showChat(chat) {
	if (!chat.name) {
		for (person in chat.people) {
			if (person != auth.currentUser.uid) {
				firebase
					.database()
					.ref("users/" + person)
					.get()
					.then((res) => {
						firebase
							.database()
							.ref("chats/" + chat.id)
							.get()
							.then((data) => {
								h1 = document.createElement("h1");
								h1.innerText = res.val().username;
								div = document.createElement("div");
								div.setAttribute("value", chat.id);
								div.setAttribute("onclick", "getChatDiv(this)");
								div.setAttribute("id", chat.id);
								div.setAttribute("name", res.val().username);
								div.setAttribute("class", "chat");
								div.appendChild(h1);
								h2 = document.createElement("h2");
								h2.setAttribute("value", 0);
								data = data.val().messages;
								let greatest = { timestamp: 0 };
								if (data) {
									for (item in data) {
										if (
											data[item].timestamp >
											greatest.timestamp
										) {
											greatest = data[item];
										}
									}

									if (greatest.uid == auth.currentUser.uid) {
										h2.appendChild(
											document.createTextNode(
												"you: " + greatest.message
											)
										);
									} else {
										h2.appendChild(
											document.createTextNode(
												greatest.message
											)
										);
									}
									h2.setAttribute(
										"value",
										greatest.timestamp
									);
								}
								div.appendChild(h2);

								var divs = document.getElementsByClassName(
									"chat"
								);
								document
									.getElementById("sender")
									.appendChild(div);
								if (divs.length == 0) {
									document
										.getElementById("sender")
										.appendChild(div);
								} else {
									for (let i = 0; i < divs.length - 1; i++) {
										if (
											greatest.timestamp >
											divs[i].children[1].getAttribute(
												"value"
											)
										) {
											document
												.getElementById("sender")
												.insertBefore(div, divs[i]);
										}
									}
								}
								listenForLatestMessage(chat, div);
							});
					});
			}
		}
	} else {
		firebase
			.database()
			.ref("chats/" + chat.id)
			.get()
			.then((data) => {
				h1 = document.createElement("h1");
				h1.innerText = chat.name;
				div = document.createElement("div");
				div.setAttribute("value", chat.id);
				div.setAttribute("id", chat.id);
				div.setAttribute("name", chat.name);
				div.setAttribute("class", "chat");
				div.setAttribute("onclick", "getChatDiv(this)");
				div.appendChild(h1);
				h2 = document.createElement("h2");
				h2.setAttribute("value", 0);
				data = data.val().messages;
				let greatest = { timestamp: 0 };

				if (data) {
					for (item in data) {
						if (data[item].timestamp > greatest.timestamp) {
							greatest = data[item];
						}
					}
					if (greatest.uid == auth.currentUser.uid) {
						h2.appendChild(
							document.createTextNode("you: " + greatest.message)
						);
					} else {
						h2.appendChild(
							document.createTextNode(
								greatest.sender + ": " + greatest.message
							)
						);
					}
					h2.setAttribute("value", greatest.timestamp);
				}
				div.appendChild(h2);

				var divs = document.getElementsByClassName("chat");
				document.getElementById("sender").appendChild(div);
				if (divs.length == 0) {
					document.getElementById("sender").appendChild(div);
				} else {
					for (let i = 0; i < divs.length; i++) {
						if (
							greatest.timestamp >
							divs[i].children[1].getAttribute("value")
						) {
							document
								.getElementById("sender")
								.insertBefore(div, divs[i]);
						}
					}
				}
				listenForLatestMessage(chat, div);
			});
	}
}

function listenForLatestMessage(chat, div) {
	firebase
		.database()
		.ref("chats/" + chat.id + "/messages")
		.on("value", (data) => {
			id = chat.id.toString();
			messages = data.val();
			for (message in messages) {
				if (
					document
						.getElementById(id)
						.children[1].getAttribute("value")
				) {
					if (
						parseInt(
							document
								.getElementById(id)
								.children[1].getAttribute("value")
						) < messages[message].timestamp
					) {
						document
							.getElementById(id)
							.children[1].setAttribute(
								"value",
								messages[message].timestamp
							);
						reorder(div, {
							timestamp: messages[message].timestamp,
						});
						if (messages[message].uid != auth.currentUser.uid) {
							if (chat.people.length > 2) {
								if (!messages[message].type) {
									document.getElementById(
										id
									).children[1].innerText =
										messages[message].sender +
										": " +
										messages[message].message;
								}
							} else {
								document.getElementById(
									id
								).children[1].innerText =
									messages[message].message;
							}
						} else {
							document.getElementById(id).children[1].innerText =
								"you: " + messages[message].message;
						}
					}
				} else {
					document
						.getElementById(id)
						.children[1].setAttribute(
							"value",
							messages[message].timestamp
						);
					reorder(div, { timestamp: +new Date() });
					if (messages[message].uid != auth.currentUser.uid) {
						if (chat.people.length > 2) {
							document.getElementById(id).children[1].innerText =
								messages[message].sender +
								": " +
								messages[message].message;
						} else {
							document.getElementById(id).children[1].innerText =
								messages[message].message;
						}
					} else {
						document.getElementById(id).children[1].innerText =
							"you: " + messages[message].message;
					}
				}
			}
		});
}
function reorder(div, greatest) {
	div.remove();
	var divs = document.getElementsByClassName("chat");
	document.getElementById("sender").appendChild(div);
	if (divs.length == 0) {
		document.getElementById("sender").appendChild(div);
	} else {
		for (let i = 0; i < divs.length - 1; i++) {
			if (
				greatest.timestamp > divs[i].children[1].getAttribute("value")
			) {
				document.getElementById("sender").insertBefore(div, divs[i]);
			}
		}
	}
}
function getChatDiv(chat) {
	id = chat.getAttribute("value");
	var name = chat.getAttribute("name");
	getChat(id, name);
}
function getChat(id, chatName) {
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
	//!Change to "child_added" and append to prevent fetching all messages every time??
	firebase.database().ref("chats/"+id+"/people").on("value",res => {
		people = [];
		for (person in res.val()) {
			people.push(person);
		}
		if (people.length <= 2) {
			document
				.getElementById("settings")
				.setAttribute("style", "display:none");
		} else {
			document
				.getElementById("settings")
				.setAttribute("style", "display:block");
		}

	})

	firebase.database().ref("chats/"+id+"/typing").on("value", res => {
		//console.log(res.val())
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

	firebase
		.database()
		.ref("chats/" + id+"/messages")
		.on("child_added", (res) => {
			images = [];
			message = res.val();

			divs = {};

			if (!message.type) {
				messageDiv = document.createElement("div");
				messageDiv.setAttribute("class", "message");
				messageDiv.setAttribute("id", message);
				div = document.createElement("div");
				h1 = document.createElement("h1");

				h3 = document.createElement("h3");

				h1.appendChild(
					document.createTextNode(message.message)
				);

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
				div.appendChild(h1);
				div.appendChild(h3);
				messageDiv.appendChild(div);
				divs[message.timestamp] = messageDiv;
				document
					.getElementById("messages")
					.appendChild(messageDiv);
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
						.appendChild(messageDiv);
				} else if (message.type == "image") {
					messageDiv = document.createElement("div");
					messageDiv.setAttribute("class", "message");
					messageDiv.setAttribute("id", message);
					div = document.createElement("div");
					img = document.createElement("img");
					img.setAttribute("id", message.timestamp);

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
						.appendChild(messageDiv);
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
					video.setAttribute("preload", "auto");
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
						.appendChild(messageDiv);
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
								console.log("video");
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
document.addEventListener("visibilitychange", (e) => {
	if (document.visibilityState == "hidden") {
		firebase
			.database()
			.ref("users/" + auth.currentUser.uid + "/chats")
			.get()
			.then((chats) => {
				chats = chats.val();
				for (chat in chats) {
					firebase
						.database()
						.ref(
							"chats/" +
								chats[chat] +
								"/typing/" +
								auth.currentUser.uid
						)
						.remove();
				}
			});
	}
});

document.getElementById("messageToSend").addEventListener("blur",() => {
	firebase.database().ref("chats/"+document.getElementById("messageToSend").getAttribute("value")+"/typing/"+auth.currentUser.uid).remove()
})

function sendMessage() {
	item = document.getElementById("messageToSend");
	message = item.innerText;
	item.innerHTML = "";
	message = message.replaceAll("\n", "");
	chatID = item.getAttribute("value");
	if (message) {
		firebase
			.database()
			.ref("chats/" + chatID + "/messages")
			.push({
				message: message,
				sender: localStorage.username,
				uid: auth.currentUser.uid,
				timestamp: +new Date(),
			});
		firebase.database().ref("chats/"+chatID+"/typing/"+auth.currentUser.uid).remove()
	}
}
document
	.getElementById("messageToSend")
	.addEventListener("keyup", function (event) {
		if (event.code === "Enter") {
			sendMessage();
		}
	});


function showSettings() {
	chatId = document.getElementById("messageToSend").getAttribute("value");
	document.getElementById("messages").setAttribute("style", "display:none");
	document.getElementById("send").setAttribute("style", "display:none");
	document.getElementById("back").setAttribute("onclick", "exitSettings()");
	var chatName = document.getElementById(chatId).getAttribute("name");
	window.location = "#settings";
	document.getElementById("chatName").innerText = chatName;
	document
		.getElementById("chatSettings")
		.setAttribute("style", "display:block");
}

function changeChatName() {
	nameHeading = document.getElementById("chatName");
	nameHeading.setAttribute("style", "display:none");
	chatName = nameHeading.innerText;

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

function exitSettings() {
	document.getElementById("messages").setAttribute("style", "display:flex");
	document.getElementById("send").setAttribute("style", "display:flex");
	window.location = "#chat";
	document
		.getElementById("chatSettings")
		.setAttribute("style", "display:none");
	document.getElementById("back").setAttribute("onclick", "exit()");
}

function leaveChat() {
	id = document.getElementById("messageToSend").getAttribute("value");
	exitSettings();
	exit();
	document.getElementById(id).remove();
	//!possible remove and relocate, data fetch might not be completely nesecary
	firebase
		.database()
		.ref("users/" + auth.currentUser.uid + "/chats")
		.get()
		.then((res) => {
			chats = res.val();
			for (chat in chats) {
				if (chats[chat] == id) {
					firebase
						.database()
						.ref("users/" + auth.currentUser.uid + "/chats/" + chat)
						.remove();
				}
			}
		});
	firebase
		.database()
		.ref("chats/" + id + "/people")
		.get()
		.then((res) => {
			people = res.val();
			for (person in people) {
				if (people[person] == auth.currentUser.uid) {
					firebase
						.database()
						.ref("chats/" + id + "/people/" + person)
						.remove();
				}
			}
		});
	//! all the way down to here

	firebase
		.database()
		.ref("chats/" + id + "/messages")
		.push({
			message: localStorage.username + " left the chat",
			timestamp: +new Date(),
			type: "alert",
			sender: "alert",
		});
}

function addUserToChat() {
	input = document.createElement("input");
	input.setAttribute("style", "display:block");
	input.setAttribute("placeholder", "username");
	document.getElementById("people").prepend(input);

	input.addEventListener("blur", () => {
		checkUsername(input.value).then((res) => {
			if (res) {
				input.setAttribute("style", "display:none");
				h2 = document.createElement("h2");
				h2.appendChild(document.createTextNode(input.value));
				document.getElementById("people").appendChild(h2);
				getUserDataFromUsername(input.value).then((res) => {
					id = document
						.getElementById("messageToSend")
						.getAttribute("value");
					firebase
						.database()
						.ref("users/" + res[1] + "/chats/")
						.push(id);
					firebase
						.database()
						.ref("chats/" + id + "/people/" + res[1])
						.set("user");
				});
				firebase
					.database()
					.ref("chats/" + id + "/messages")
					.push({
						message: input.value + " was added to the chat",
						timestamp: +new Date(),
						type: "alert",
						sender: "alert",
					});
			} else {
				if (input.value != "") {
					input.setAttribute("style", "display:block; color:red");
				} else {
					input.setAttribute("style", "");
				}
			}
		});
	});
	input.addEventListener("input", () => {
		input.setAttribute("style", "display:block; color: black");
	});
	input.focus();
}

document.getElementById("file").addEventListener("change", function (e) {
	document.getElementById("messageToSend").removeAttribute("contenteditable");
	document.getElementById("submit").setAttribute("onclick", "sendImages()");
	files = {};
	for (let i = 0; i < e.target.files.length; i++) {
		var file = e.target.files[i];
		div = document.createElement("div");
		h1 = document.createElement("h1");
		h1.appendChild(document.createTextNode(file.name));
		img = document.createElement("img");
		img.setAttribute("src", "assets/close.png");
		img.setAttribute("onclick", "this.parentElement.remove()");
		div.appendChild(h1);
		div.appendChild(img);
		div.setAttribute("value", i);
		div.setAttribute("id", "test");
		files[i] = file;
		document.getElementById("messageToSend").appendChild(div);
	}
});

function sendImages() {
	selectedImages = document.getElementById("messageToSend").children;
	id = document.getElementById("messageToSend").getAttribute("value");
	console.log(selectedImages);
	function sendImage(i) {
		if (i < selectedImages.length) {
			var file = files[selectedImages[i].getAttribute("value")];
			var type = file.type;
			fileName = +new Date() + file.name;
			firebase
				.storage()
				.ref(fileName)
				.put(file)
				.then(() => {
					if (type.split("/")[0] == "image") {
						firebase
							.database()
							.ref("chats/" + id + "/messages")
							.push({
								timestamp: +new Date(),
								type: "image",
								sender: localStorage.username,
								fileName: fileName,
								uid: auth.currentUser.uid,
								message: "image",
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

function notification() {
	new Notification("This is a Title", {
		body: "this is some text",
		icon: "assets/new-chat.png",
	});
}

if (messaging) {
	navigator.serviceWorker.ready
		.then((registration) => registration.sync.register("syncAttendees"))
		.then(() => console.log("Registered background sync"))
		.catch((err) =>
			console.error("Error registering background sync", err)
		);
}

function getPermission() {
	messaging
		.requestPermission()
		.then(() => {
			console.log("has permission");
			return messaging.getToken({
				vapidKey:
					"BPqHexpEZnaY6ibpPtC_iLTSHmxfnDeVAikQEN-lTuJs-mfeI9WG78riHLUn6_ZcT2aYWBF-F2aqpXMB08G1Ddc",
			});
		})
		.then((token) => {
			firebase
				.database()
				.ref("users/" + auth.currentUser.uid + "/regToken")
				.set(token);
			console.log(token);
		})
		.catch((err) => {
			alert(err);
		});
}

messaging.onMessage((payload) => {
	console.log(payload);
	currentID = document.getElementById("messageToSend").getAttribute("value")
	notificationID = payload.data.id;
	if (currentID != notificationID){
		//notification(payload)
	}
	//new Notification("another name",{body:"this is a test"})
});
function notification(payload){
	new Notification(payload.notification.title, {
		body:payload.notification.body,
		icon:payload.notification.icon,
		tag:payload.notification.tag
	})
}
window.location = "#home";
window.addEventListener("hashchange", function (event) {
	oldURL = event.oldURL.split("#")[1];
	newURL = event.newURL.split("#")[1];
	if (newURL == "home" && oldURL == "chat") {
		exit();
	} else if (newURL == "chat" && oldURL == "settings") {
		exitSettings();
	}
});