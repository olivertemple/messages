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
				localStorage.uid = auth.currentUser.uid
			});
		if (messaging) {
			getPermission();
		}
	}
});

document.getElementById("messageToSend").addEventListener("blur",() => {
	firebase.database().ref("chats/"+document.getElementById("messageToSend").getAttribute("value")+"/typing/"+auth.currentUser.uid).remove()
})

window.addEventListener("online", () => {
    console.log("back online")
	if (document.getElementById("send").getAttribute("style") != null && document.getElementById("send").getAttribute("style")!=""){
		id = document.getElementById("messageToSend").getAttribute("value")
		getChatDiv(document.getElementById(id))
	}
})


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

document
	.getElementById("messageToSend")
	.addEventListener("keyup", function (event) {
		if (event.code === "Enter") {
			sendMessage();
		}
	});

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

    