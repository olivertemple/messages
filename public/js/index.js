//TODO:
//!Make it so that you cannot create a chat that already exists.
//!when sending images dont wait for the image to send before removing it from the input box
//!offline stuff
//TODO

let globalChats = {};

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



function logout() {
	firebase.auth().signOut();
}

firebase
	.database()
	.ref("usernames")
	.on("value", res => {
		for (user in res.val()) {
			if (user != localStorage.username) {
				option = document.createElement("option");
				option.innerText = user;
				document
					.getElementById("availableUsers")
					.appendChild(option);
			}
		}
	})



function exit() {
	console.log("exit")
	document.getElementById("back").style = ""
	document.getElementById("send").style = ""
	document.getElementById("address").innerText = ""
	document.getElementById("sender").setAttribute("style", "display:flex");
	document.getElementById("rightHeader").style=""
	document.getElementById("header").setAttribute("style", "display:flex");
	id = document.getElementById("messageToSend").getAttribute("value");
	for (var chat in globalChats){
		globalChats[chat].messagesDiv.style="display:none"
	}
	window.location = "#home";

	if (window.innerWidth < 600){
		document.getElementById("sender").style=""
		document.getElementById("header").style=""
		document.getElementById("main").style=""
	}
}

function checkUsername(username) {
	return new Promise(function (resolve) {
		firebase
			.database()
			.ref("usernames/"+username)
			.get()
			.then((data) => {
				data = data.val();
				if (data != null){
					resolve(true)
				}else{
					resolve(false)
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

function exitSettings() {
	var id = document.getElementById("messageToSend").getAttribute("value")
	document.getElementById(id+"messages").setAttribute("style", "display:flex");
	document.getElementById("send").setAttribute("style", "display:flex");
	document.getElementById("rightHeader").style="display: flex"

	window.location = "#chat";
	document
		.getElementById("chatSettings")
		.setAttribute("style", "display:none");
	document.getElementById("back").setAttribute("onclick", "exit()");
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
			return messaging.getToken({
				vapidKey:
					"BPqHexpEZnaY6ibpPtC_iLTSHmxfnDeVAikQEN-lTuJs-mfeI9WG78riHLUn6_ZcT2aYWBF-F2aqpXMB08G1Ddc",
			});
		})
		.then((token) => {
			firebase
				.database()
				.ref("users/" + auth.currentUser.uid + "/regToken/"+token)
				.set("token");
		})
		.catch((err) => {
			alert(err);
		});
}

