//TODO:
//!Make it so that you cannot create a chat that allready exists.
//!Make it so you cannot create a chat with only yourself.
//!add sign in with google

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

firebase.auth().onAuthStateChanged((firebaseUser) => {
	if (!firebaseUser) {
		window.location.href = "/login.html";
	}else{
		getChats()
	}
});



function logout() {
	firebase.auth().signOut();
}



function addChat() {
	if (document.body.clientWidth <= 600) {
		document.getElementById("main").setAttribute("style", "display:flex");
		document.getElementById("sender").setAttribute("style", "display:none");
		document.getElementById("header").setAttribute("style", "display:none");
		document.getElementById("address").innerText = "addChat";
		document.getElementById("messages").innerHTML = "";
		document.getElementById("messageToSend").setAttribute("style", "display:none");
		document.getElementById("submit").setAttribute("style","display:none")

	}

	input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("id", "addChat");
	input.setAttribute("placeholder", "email");
	input.addEventListener("input", function () {
		var email = this.value;

		start = +new Date();
		setTimeout(function () {
			finnish = +new Date();
			if (finnish - start > 500) {
				checkEmail(email).then(function (res) {
					if (res) {
						document
							.getElementById("addChat")
							.setAttribute("style", "color:#44B700");
						setTimeout(function () {
							getUserDataFromEmail(email).then((data) => {
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

										
									document.getElementById("send").setAttribute("style","display:flex")
									document.getElementById("messageToSend").setAttribute("style","display:none")
									document.getElementById("submit").setAttribute("onclick","createChat()")
									document.getElementById("submit").setAttribute("style","display:block")
								}
							});
						}, 1000);
					} else {
						document
							.getElementById("addChat")
							.setAttribute("style", "color:orangered");
					}
				});
			}
		}, 500);
	});
	document.getElementById("messages").appendChild(input);
}

function createChat() {
	document.getElementById("submit").setAttribute("onclick","sendMessage()")
	users = [];
	usersFromDoc = document.getElementsByClassName("user");
	for (let i = 0; i < usersFromDoc.length; i++) {
		if (!users.includes(usersFromDoc[i].getAttribute("value"))) {
			users.push(usersFromDoc[i].getAttribute("value"));
		}
	}
	if (!users.includes(auth.currentUser.uid)) {
		users.push(auth.currentUser.uid);
	}
	firebase
		.database()
		.ref("chats")
		.get()
		.then(function (data) {
			thisVar = data.val()
			console.log(data.val())
			try {
				number = data.val().length;
			} catch {
				number = 0;
			}
			if (number == null){
				number = 0;
			}
			firebase
				.database()
				.ref("chats/" + number)
				.set({
					people: users, id:number
				});
			for (item in users){
				if (users.length <= 2 && users[item]!= auth.currentUser.uid){
					firebase.database().ref("users/"+users[item]).get().then(res => {
						res = (res.val())
						console.log(res)
						getChat(number, res.username)
					})
				}
			}
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
}
function exit() {
	if (document.body.clientWidth <= 600) {
		document.getElementById("main").setAttribute("style", "display:none");
		document.getElementById("sender").setAttribute("style", "display:flex");
		document.getElementById("header").setAttribute("style", "display:flex");
		document.getElementById("send").setAttribute("style", "display:flex");
		document.getElementById("messages").innerHTML = "";
	}
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

function getUserDataFromEmail(email) {
	return new Promise(function (resolve) {
		firebase
			.database()
			.ref("users")
			.get()
			.then(function (data) {
				var users = data.val();
				for (item in users) {
					if (users[item].email == email) {
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
	divs = []
	firebase
		.database()
		.ref("users/"+auth.currentUser.uid+"/chats")
		.on("value",userChats => {
			userChats = (userChats.val())
			console.log(userChats)
			try{
				for (let i=0; i<userChats.length; i++){
					firebase.database().ref("chats/"+userChats[i]).get().then(data => {
						chat = data.val();
						shownChats = document.getElementsByClassName("chat")
						chatIDs = []
						for (let j=0; j<shownChats.length; j++){
							chatIDs.push(shownChats[j].getAttribute("value"))
						}
						if (!chatIDs.includes((chat.id).toString())){
							showChat(chat)
						}
					})
				}
			}catch{
				console.log("user has no chats")
			}
			
		})
}

function showChat(chat) {
	if (!chat.name){
		for (person in chat.people){
			if (chat.people[person] != auth.currentUser.uid){
				firebase.database().ref("users/"+chat.people[person]).get().then(res => {
					firebase.database().ref("chats/"+chat.id).get().then(data => {
						h1 = document.createElement("h1");
						h1.innerText = res.val().username
						div = document.createElement("div");
						div.setAttribute("value",chat.id);
						div.setAttribute("onclick","getChatDiv(this)")
						div.setAttribute("id",chat.id)
						div.setAttribute("name", res.val().username)
						div.setAttribute("class","chat")
						div.appendChild(h1)
						h2 = document.createElement("h2")
						data = data.val().messages
						if (data){
							let greatest = {timestamp: 0}
							for (item in data){
							  if (data[item].timestamp > greatest.timestamp){
								  greatest = data[item]
							  }
							}
							
							if (greatest.uid == auth.currentUser.uid){
								h2.appendChild(document.createTextNode("you: "+greatest.message))
							}else{
								h2.appendChild(document.createTextNode(greatest.message))
							}
							h2.setAttribute("value",greatest.timestamp)

						}
						div.appendChild(h2)
						document.getElementById("sender").appendChild(div)
						listenForLatestMessage(chat)
					});
				})
			}
		}
	}else{
		firebase.database().ref("chats/"+chat.id).get().then(data => {
			h1 = document.createElement("h1");
			h1.innerText = chat.name;
			div = document.createElement("div");
			div.setAttribute("value",chat.id);
			div.setAttribute("id",chat.id)
			div.setAttribute("name",chat.name)
			div.setAttribute("class","chat")
			div.setAttribute("onclick","getChatDiv(this)")
			div.appendChild(h1)
			h2 = document.createElement("h2")

			data = data.val().messages
			if (data){
				let greatest = {timestamp: 0}
				for (item in data){
				  if (data[item].timestamp > greatest.timestamp){
					  greatest = data[item]
				  }
				}
				if (greatest.uid == auth.currentUser.uid){
					h2.appendChild(document.createTextNode("you: "+greatest.message))
				}else{
					h2.appendChild(document.createTextNode(greatest.sender+": "+greatest.message))
				}
				h2.setAttribute("value",greatest.timestamp)
			}
			div.appendChild(h2)
			document.getElementById("sender").appendChild(div)
			listenForLatestMessage(chat)
		})
	}
	
	//TODO sort chats by most recent message
}

function listenForLatestMessage(chat){
	console.log("listening for messages")
	console.log(chat)
	console.log(document.getElementById(chat.id))

	firebase.database().ref("chats/"+chat.id+"/messages").on("value",data => {
		console.log(data.val())
		id = chat.id.toString()
		tempVar = document.getElementById(id)
		messages = data.val()
		for (message in messages){
			console.log(parseInt(document.getElementById(id).children[1].getAttribute("value")))
			console.log(messages[message])
			if (document.getElementById(0).children[1].getAttribute("value")){
				if (parseInt(document.getElementById(id).children[1].getAttribute("value")) < messages[message].timestamp){
					document.getElementById(id).children[1].setAttribute("value", messages[message].timestamp)
					if (messages[message].uid != auth.currentUser.uid){
						if(chat.people.length > 2){
							document.getElementById(id).children[1].innerText = messages[message].sender +": "+messages[message].message
						}else{
							document.getElementById(id).children[1].innerText = messages[message].message
						}
					}else{
						document.getElementById(id).children[1].innerText = "you: "+messages[message].message
					}
				}	
			}else{
				document.getElementById(id).children[1].setAttribute("value", messages[message].timestamp)
				if (messages[message].uid != auth.currentUser.uid){
					if(chat.people.length > 2){
						document.getElementById(id).children[1].innerText = messages[message].sender +": "+messages[message].message
					}else{
						document.getElementById(id).children[1].innerText = messages[message].message
					}
				}else{
					document.getElementById(id).children[1].innerText = "you: "+messages[message].message
				}
			}
			
		}
		
	})
}
function getChatDiv(chat){
	id = chat.getAttribute("value")
	var name = chat.getAttribute("name")
	getChat(id,name)
}
function getChat(id, chatName){
	console.log("getting chat")
	document.getElementById("header").setAttribute("style","display:none")
	document.getElementById("sender").setAttribute("style","display:none")
	document.getElementById("main").setAttribute("style","display:flex")
	document.getElementById("messageToSend").setAttribute("style","display:block")
	document.getElementById("submit").setAttribute("class","rotate")

	document.getElementById("messageToSend").setAttribute("value",id)
	document.getElementById("address").innerText = chatName
	firebase.database().ref("chats/"+id).on("value", res => {
		messages = res.val().messages
		document.getElementById("messages").innerHTML = ""
		for (message in messages){
			messageDiv = document.createElement("div")
			messageDiv.setAttribute("id","message")
			div = document.createElement("div")
			h1 = document.createElement("h1")
			
			h3 = document.createElement("h3")

			h1.appendChild(document.createTextNode(messages[message].message))

			var date = new Date(messages[message].timestamp)
			hours = date.getHours()
			mins = date.getMinutes()

			time = hours+":"+mins

			h3.appendChild(document.createTextNode(time))

			if (messages[message].uid == auth.currentUser.uid){
				div.setAttribute("class","right")
			}else{
				div.setAttribute("class","left")
				h2 = document.createElement("h2")
				h2.appendChild(document.createTextNode(messages[message].sender))
				div.appendChild(h2)
			}
			div.appendChild(h1)
			div.appendChild(h3)

			messageDiv.appendChild(div)
			document.getElementById("messages").appendChild(messageDiv)	
		}
		document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight
	})
}

function sendMessage(){
	item = document.getElementById("messageToSend")
	message = item.innerText
	item.innerText = ""
	message = message.replaceAll("\n","")
	chatID = item.getAttribute("value")
	if (message){
		firebase.database().ref("users/"+auth.currentUser.uid).get().then(res => {
			firebase.database().ref("chats/"+chatID+"/messages").push({
				message:message,
				sender:res.val().username,
				uid: auth.currentUser.uid,
				timestamp: + new Date()
			})
		})
	}
	

}
document.getElementById("messageToSend").addEventListener("keyup", function(event) {
	if (event.code === 'Enter') {
		  sendMessage()
	}
});