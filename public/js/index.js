//TODO:
//!Make it so that you cannot create a chat that already exists.
//!Make it so you cannot create a chat with only yourself.
//TODO

if ("serviceWorker" in navigator){
	navigator.serviceWorker.register("js/serviceWorker.js")
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
const messaging = firebase.messaging();

firebase.auth().onAuthStateChanged((firebaseUser) => {
	if (!firebaseUser) {
		window.location.href = "/login.html";
	} else {
		getChats();
		firebase.database().ref("users/"+auth.currentUser.uid+"/username").get().then(res => {
			localStorage.username = (res.val())
		})
		getPermission();
	}
});

function logout() {
	firebase.auth().signOut();
}



function addChat() {
	document.getElementById("main").setAttribute("style", "display:flex");
	document.getElementById("sender").setAttribute("style", "display:none");
	document.getElementById("header").setAttribute("style", "display:none");
	document.getElementById("address").innerText = "addChat";
	document.getElementById("messages").innerHTML = "";
	document
		.getElementById("messageToSend")
		.setAttribute("style", "display:none");
	document
		.getElementById("submit")
		.setAttribute("style", "display:none; transform:rotate(180deg)");

	input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("id", "addChat");
	input.setAttribute("placeholder", "username");
	input.addEventListener("input", () => {
		input.setAttribute("style", "");
	});
	input.addEventListener("input", function () {
		var username = this.value;

		start = +new Date();
		setTimeout(function () {
			finnish = +new Date();
			if (finnish - start > 500) {
				checkUsername(username).then(function (res) {
					if (res) {
						document
							.getElementById("addChat")
							.setAttribute("style", "color:#44B700");
						setTimeout(function () {
							getUserDataFromUsername(username).then((data) => {
								if (data) {
									if (!document.getElementById("users")) {
										var div = document.createElement("div");
										div.setAttribute("id", "users");
										document
											.getElementById("messages")
											.appendChild(div);
									}
									user = document.getElementById("addChat")
										.value;
									document
										.getElementById("addChat")
										.setAttribute("style", "");
									document.getElementById("addChat").value =
										"";
									div = document.createElement("div");
									div.setAttribute("class", "user");
									heading = document.createElement("h1");
									heading.innerText = data[0].username;
									div.appendChild(heading);
									div.setAttribute(
										"onclick",
										"this.remove()"
									);
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
										.setAttribute(
											"onclick",
											"createChat()"
										);
									document
										.getElementById("submit")
										.setAttribute(
											"style",
											"display:block; transform:rotate(180deg)"
										);
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
			}
		}, 500);
	});
	document.getElementById("messages").appendChild(input);
}

function createChat() {
	usersFromDoc = document.getElementsByClassName("user");
	document.getElementById("submit").setAttribute("onclick", "sendMessage()");
	document.getElementById("uploadImage").setAttribute("style","display:block")
	users = [];
	console.log(usersFromDoc)
	for (let i = 0; i < usersFromDoc.length; i++) {
		if (!users.includes(usersFromDoc[i].getAttribute("value"))) {
			users.push(usersFromDoc[i].getAttribute("value"));
		}
	}
	if (!users.includes(auth.currentUser.uid)) {
		users.push(auth.currentUser.uid);
	}
	console.log(users)
	//! index list not needed?
	firebase
		.database()
		.ref("chats")
		.get()
		.then(function (data) {
			thisVar = data.val();
			try {
				number = data.val().length;
			} catch {
				number = 0;
			}
			if (number == null) {
				number = 0;
			}
			if (users.length <= 2) {
				firebase
					.database()
					.ref("chats/" + number)
					.set({
						people: users,
						id: number,
					});
			} else {
				var name = "group chat";
				firebase
					.database()
					.ref("chats/" + number)
					.set({
						people: users,
						id: number,
						name: name,
					});
			}

			for (item in users) {
				if (users.length <= 2 && users[item] != auth.currentUser.uid) {
					firebase
						.database()
						.ref("users/" + users[item])
						.get()
						.then((res) => {
							res = res.val();
							getChat(number, res.username);
						});
				} else {
					getChat(number, name);
				}
			}
			//! this for loop can be put inside the one above
			for (let i = 0; i < users.length; i++) {
				firebase
					.database()
					.ref("users/" + users[i] + "/chats")
					.get()
					.then(function (data) {
						try {
							length = data.val().length;
						} catch {
							length = 0;
						}
						firebase
							.database()
							.ref("users/" + users[i] + "/chats/" + length)
							.set(number);
					});
			}
		});
	document.getElementById("messages").innerHTML = ""

}
function exit() {
	document.getElementById("main").setAttribute("style", "display:none");
	document.getElementById("sender").setAttribute("style", "display:flex");
	document.getElementById("header").setAttribute("style", "display:flex");
	document.getElementById("send").setAttribute("style", "display:flex");
	document.getElementById("messages").innerHTML = "";
	id = document.getElementById("messageToSend").getAttribute("value");
	firebase
		.database()
		.ref("chats/" + id)
		.off();
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
				if (data.val().includes(username.toLowerCase())) {
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
			.ref("users")
			.get()
			.then((data) => {
				var users = data.val();
				for (item in users) {
					if (
						users[item].username.toLowerCase() ==
						username.toLowerCase()
					) {
						data = [users[item], item];
						resolve(data);
					}
				}
				resolve(false);
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
				for (let i = 0; i < userChats.length; i++) {
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
			document
				.getElementById("loading")
				.setAttribute("style", "display:none");
		});
}

function showChat(chat) {
	if (!chat.name) {
		for (person in chat.people) {
			if (chat.people[person] != auth.currentUser.uid) {
				firebase
					.database()
					.ref("users/" + chat.people[person])
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
								let greatest = {timestamp: 0 };
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
								
								var divs=document.getElementsByClassName("chat")
								document.getElementById("sender").appendChild(div);
								if (divs.length == 0){
									document.getElementById("sender").appendChild(div);
								}else{
									for(let i = 0; i<divs.length-1; i++){
										if (greatest.timestamp > divs[i].children[1].getAttribute("value")){
											document.getElementById("sender").insertBefore(div, divs[i])
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
				
				var divs=document.getElementsByClassName("chat")
				document.getElementById("sender").appendChild(div);
				if (divs.length == 0){
					document.getElementById("sender").appendChild(div);
				}else{
					for(let i = 0; i<divs.length; i++){
						if (greatest.timestamp > divs[i].children[1].getAttribute("value")){
							document.getElementById("sender").insertBefore(div, divs[i])
						}
					}
				}
				listenForLatestMessage(chat, div);

			});
	}
}

function listenForLatestMessage(chat, div) {
	console.log(chat)
	firebase
		.database()
		.ref("chats/" + chat.id + "/messages")
		.on("value", (data) => {
			id = chat.id.toString();
			messages = data.val();
			for (message in messages) {
				if (
					document.getElementById(id).children[1].getAttribute("value")
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
							reorder(div,{timestamp:messages[message].timestamp})
						if (messages[message].uid != auth.currentUser.uid) {
							if (chat.people.length > 2) {
								if (!messages[message].type){
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
						reorder(div,{timestamp:+ new Date()})
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
function reorder(div, greatest){
	div.remove()
	var divs=document.getElementsByClassName("chat")
	document.getElementById("sender").appendChild(div);
	if (divs.length == 0){
		document.getElementById("sender").appendChild(div);
	}else{
		for(let i = 0; i<divs.length-1; i++){
			if (greatest.timestamp > divs[i].children[1].getAttribute("value")){
				document.getElementById("sender").insertBefore(div, divs[i])
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
	document.getElementById("header").setAttribute("style", "display:none");
	document.getElementById("sender").setAttribute("style", "display:none");
	document.getElementById("main").setAttribute("style", "display:flex");
	document
		.getElementById("messageToSend")
		.setAttribute("style", "display:block");
	document
		.getElementById("submit")
		.setAttribute("style", "transform:rotate(90deg)");
	document.getElementById("uploadImage").setAttribute("style","display:block")

	document.getElementById("messageToSend").setAttribute("value", id);
	document.getElementById("address").innerText = chatName;
	firebase
		.database()
		.ref("chats/" + id)
		.on("value", (res) => {
			images = []
			messages = res.val().messages;
			//document.getElementById("messages").innerHTML = "";
			if (res.val().people.length <= 2){
				document.getElementById("settings").setAttribute("style","display:none")
			}else{
				document.getElementById("settings").setAttribute("style","display:block")
			}
			divs = {}
			displayedMessages = document.getElementsByClassName("message")
			ids = []
			for (item in displayedMessages){
				ids.push(displayedMessages[item].id)
			}
			for (message in messages) {
				if (!ids.includes(message)){

					if (!messages[message].type){
						messageDiv = document.createElement("div");
						messageDiv.setAttribute("class", "message");
						messageDiv.setAttribute("id",message)
						div = document.createElement("div");
						h1 = document.createElement("h1");
		
						h3 = document.createElement("h3");
		
						h1.appendChild(
							document.createTextNode(messages[message].message)
						);
		
						var date = new Date(messages[message].timestamp);
						hours = date.getHours();
						mins = date.getMinutes();
		
						time = hours + ":" + mins;
		
						h3.appendChild(document.createTextNode(time));
		
						if (messages[message].uid == auth.currentUser.uid) {
							div.setAttribute("class", "right");
						} else {
							div.setAttribute("class", "left");
							h2 = document.createElement("h2");
							h2.appendChild(
								document.createTextNode(messages[message].sender)
							);
							div.appendChild(h2);
						}
						div.appendChild(h1);
						div.appendChild(h3);
						messageDiv.appendChild(div);
						divs[messages[message].timestamp] = messageDiv
						document.getElementById("messages").appendChild(messageDiv);
					}else{
						if (messages[message].type=="alert"){
							messageDiv = document.createElement("div");
							messageDiv.setAttribute("class", "message");
							messageDiv.setAttribute("id",message)
							div = document.createElement("div");
							h1 = document.createElement("h1");
					
							h1.appendChild(
								document.createTextNode(messages[message].message))
	
							div.appendChild(h1)
							div.setAttribute("id","alert")
							messageDiv.appendChild(div)
							divs[messages[message].timestamp] = messageDiv
							document.getElementById("messages").appendChild(messageDiv)
						}else if (messages[message].type=="image"){
							messageDiv = document.createElement("div");
							messageDiv.setAttribute("class", "message");
							messageDiv.setAttribute("id",message)
							div = document.createElement("div");
							img = document.createElement("img");
							img.setAttribute("id",messages[message].timestamp)
			
							h3 = document.createElement("h3");
			
			
							var date = new Date(messages[message].timestamp);
							hours = date.getHours();
							mins = date.getMinutes();
			
							time = hours + ":" + mins;
			
							h3.appendChild(document.createTextNode(time));
			
							if (messages[message].uid == auth.currentUser.uid) {
								div.setAttribute("class", "right");
							} else {
								div.setAttribute("class", "left");
								h2 = document.createElement("h2");
								h2.appendChild(
									document.createTextNode(messages[message].sender)
								);
								div.appendChild(h2);
							}
							div.appendChild(img);
							div.appendChild(h3);
			
							messageDiv.appendChild(div);
							images.push([[messages[message].timestamp],messages[message].fileName])
	
							divs[messages[message].timestamp] = messageDiv
							document.getElementById("messages").appendChild(messageDiv);
						}
					}
					document.getElementById(
						"messages"
					).scrollTop = document.getElementById("messages").scrollHeight;
				}
			}
			
			let i = 0;
			loop(i)
			function loop(i){
				if (i < images.length){
					firebase.storage().ref(images[i][1]).getDownloadURL().then(url => {
						document.getElementById(images[i][0]).setAttribute("src",url)
						i++
						loop(i)
					})
				}else{
					document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
				}
			}
			
			


			document.getElementById(
				"messages"
			).scrollTop = document.getElementById("messages").scrollHeight;

			chatName = res.val().name;
			if (chatName){
				document.getElementById(id).children[0].innerText = chatName;
				document.getElementById(id).setAttribute("name",chatName)
			}
			people = res.val().people;
			document.getElementById("people").innerHTML = "";
			for (person in people){
				if (people[person] != auth.currentUser.uid){
					firebase.database().ref("users/"+people[person]+"/username").get().then(res => {
						h2 = document.createElement("h2")
						h2.appendChild(document.createTextNode(res.val()))
						document.getElementById("people").appendChild(h2)
					})
				}else{
					h2 = document.createElement("h2")
					h2.appendChild(document.createTextNode("you"))
					document.getElementById("people").appendChild(h2)
				}
				
			}
		});
}

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
	}
}
document
	.getElementById("messageToSend")
	.addEventListener("keyup", function (event) {
		if (event.code === "Enter") {
			sendMessage();
		}
	});
document
	.getElementById("messageToSend")
	.addEventListener("input",event => {
		console.log(document.getElementById("messageToSend").innerHTML)
		if (!event.data){
			if (event.inputType == "insertParagraph"){
				document.getElementById("messageToSend").innerText = "" 
			}
		}
	})

function showSettings() {
	chatId = document.getElementById("messageToSend").getAttribute("value")
	document.getElementById("messages").setAttribute("style", "display:none");
	document.getElementById("send").setAttribute("style", "display:none");
	document.getElementById("back").setAttribute("onclick", "exitSettings()");
	var chatName = document.getElementById(chatId).getAttribute("name");
	document.getElementById("chatName").innerText = chatName
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

	document
		.getElementById("chatSettings")
		.setAttribute("style", "display:none");
	document.getElementById("back").setAttribute("onclick", "exit()");
}

function leaveChat(){
	id = document.getElementById("messageToSend").getAttribute("value")
	exitSettings()
	exit()
	document.getElementById(id).remove()
	//!possible remove and relocate, data fetch might not be completely nesecary
	firebase.database().ref("users/"+auth.currentUser.uid+"/chats").get().then(res => {
		chats = res.val();
		for (chat in chats){
			if (chats[chat] == id){
				firebase.database().ref("users/"+auth.currentUser.uid+"/chats/"+chat).remove()
			}
		}
	})
	firebase.database().ref("chats/"+id+"/people").get().then(res => {
		people = res.val();
		for (person in people){
			if (people[person] == auth.currentUser.uid){
				firebase.database().ref("chats/"+id+"/people/"+person).remove()
			}
		}
	})
	//! all the way down to here

	firebase.database().ref("chats/"+id+"/messages").push({
		message:localStorage.username+" left the chat",
		timestamp: + new Date,
		type:"alert",
		sender:"alert"
	})
	
}

function addUserToChat(){
	input = document.createElement("input")
	input.setAttribute("style","display:block")
	input.setAttribute("placeholder","username")
	document.getElementById("people").prepend(input)

	input.addEventListener("blur",() => {
		checkUsername(input.value).then(res => {
			if (res){
				input.setAttribute("style","display:none")
				h2 = document.createElement("h2")
				h2.appendChild(document.createTextNode(input.value))
				document.getElementById("people").appendChild(h2)
				getUserDataFromUsername(input.value).then(res=>{
					id = document.getElementById("messageToSend").getAttribute("value")
					//! streamline this?
					firebase.database().ref("users/"+res[1]+"/chats").get().then(data=>{
						chats = data.val()
						firebase.database().ref("users/"+res[1]+"/chats/"+chats.length).set(id)
						firebase.database().ref("chats/"+id+"/people").get().then(people => {
							index = people.val().length
							firebase.database().ref("chats/"+id+"/people/"+index).set(res[1])
						})
					})
				})
				firebase.database().ref("chats/"+id+"/messages").push({
					message:input.value+" was added to the chat",
					timestamp: + new Date,
					type:"alert",
					sender:"alert"
				})
			}else{
				if (input.value != ""){
					input.setAttribute("style","display:block; color:red")
				}else{
					input.setAttribute("style","")
				}
			}
		})
	})
	input.addEventListener("input",()=> {
		input.setAttribute("style","display:block; color: black")
	})
	input.focus();
}


document.getElementById("file").addEventListener("change",function(e){
	document.getElementById("messageToSend").removeAttribute("contenteditable")
	document.getElementById("submit").setAttribute("onclick","sendImages()")
	files = {}
	for (let i=0; i < e.target.files.length; i++){
		var file = e.target.files[i];
		div = document.createElement("div")
		h1 = document.createElement("h1")
		h1.appendChild(document.createTextNode(file.name))
		img = document.createElement("img")
		img.setAttribute("src","assets/close.png")
		img.setAttribute("onclick","this.parentElement.remove()")
		div.appendChild(h1)
		div.appendChild(img)
		div.setAttribute("value",i)
		div.setAttribute("id","test")
		files[i] = file
		document.getElementById("messageToSend").appendChild(div)
	}
	
});

function sendImages(){
	selectedImages = document.getElementById("messageToSend").children
	id = document.getElementById("messageToSend").getAttribute("value")
	function sendImage(i){
		if (i < selectedImages.length){
			var file = (files[selectedImages[i].getAttribute("value")])
			fileName = + new Date() + file.name
			firebase.storage().ref(fileName).put(file).then(() => {
				firebase.database().ref("chats/"+id+"/messages").push({
					timestamp: + new Date(),
					type:"image",
					sender:localStorage.username,
					fileName: fileName,
					uid:auth.currentUser.uid,
					message:"image"
				})
			}).then(() => {
				i++;
				sendImage(i)
			})
		}else{
			document.getElementById("messageToSend").innerHTML = ""
			document.getElementById("submit").setAttribute("onclick","sendMessage()")
			document.getElementById("messageToSend").setAttribute("contenteditable", true)
		}
		
	}
	i=0;
	sendImage(i)
}

document.getElementById("messageToSend").addEventListener("DOMNodeRemoved", () => {
	if (document.getElementById("messageToSend").children.length <= 1){
		document.getElementById("messageToSend").setAttribute("contenteditable", true)
		document.getElementById("submit").setAttribute("onclick","sendMessage()")
	}
})

function notification(){
	new Notification("This is a Title",{body:"this is some text","icon":"assets/new-chat.png"})
}

function registerBackgroundSync() {
	navigator.serviceWorker.ready
	.then(registration => registration.sync.register('syncAttendees'))
    .then(() => console.log("Registered background sync"))
    .catch(err => console.error("Error registering background sync", err))
}

function getPermission(){
	messaging.requestPermission().then(() => {
		console.log("has permission")
		return messaging.getToken({vapidKey: "BPqHexpEZnaY6ibpPtC_iLTSHmxfnDeVAikQEN-lTuJs-mfeI9WG78riHLUn6_ZcT2aYWBF-F2aqpXMB08G1Ddc"})
	})
	.then(token => {
		firebase.database().ref("users/"+auth.currentUser.uid+"/regToken").set(token)
		console.log(token)
	})
	.catch(err => {
		alert(err)
	})
}


messaging.onMessage(payload => {
	console.log(payload)
	//new Notification("another name",{body:"this is a test"})
});