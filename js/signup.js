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

auth.signOut();

function signup() {
	email = document.getElementById("email").value;
	pass = document.getElementById("password").value;
	username = document.getElementById("name").value
	firebase.database().ref("usernames").get().then(res => {
		usernames = res.val();
		if (!usernames.includes(username.toLowerCase())){
			const promise = auth.createUserWithEmailAndPassword(email, pass);
			promise
				.catch((e) => {
					console.log(e);
					if (e.code == "auth/invalid-email") {
						console.log("invalid email address");
						document
							.getElementById("invalidEmail")
							.setAttribute("style", "display:block");
					} else if (e.code == "auth/weak-password") {
						console.log("weak password");
						document
							.getElementById("invalidPass")
							.setAttribute("style", "display:block");
					} else if (e.code == "auth/email-already-in-use") {
						console.log("account already exists");
						document
							.getElementById("invalid")
							.setAttribute("style", "display:block");
					}
				})
				.then((e) => {
					db = firebase.database();
					db.ref("users/" + auth.currentUser.uid)
						.set({
							email: auth.currentUser.email,
							username: document.getElementById("name").value,
						})
						.then(function () {
							if (auth.currentUser) {
								window.location.href = "/index.html";
							}
						});
						console.log(usernames)
						firebase.database().ref("usernames/"+usernames.length).set(username.toLowerCase())
					});
		}else{
			document.getElementById("invalidUsername").setAttribute("style","display:block")
		}
	})
	
}
function signUpWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
	if (firebaseUser) {
		console.log(firebaseUser);
		/*
        db = firebase.database();
        db.ref("users/"+firebaseUser.uid).set({
            email:firebaseUser.email,
            username:username
        })
*/
	} else {
		console.log("not logged in");
	}
});

function addListeners(){
	document.getElementById("email").addEventListener("focus", function () {
		document
			.getElementById("invalidPass")
			.setAttribute("style", "display:none");
		document
			.getElementById("invalidEmail")
			.setAttribute("style", "display:none");
		document.getElementById("invalid").setAttribute("style", "display:none");
		document.getElementById("invalidUsername").setAttribute("style","display:none")
	});
	document.getElementById("password").addEventListener("focus", function () {
		document
			.getElementById("invalidPass")
			.setAttribute("style", "display:none");
		document
			.getElementById("invalidEmail")
			.setAttribute("style", "display:none");
		document.getElementById("invalid").setAttribute("style", "display:none");
		document.getElementById("invalidUsername").setAttribute("style","display:none")
	});
	document.getElementById("name").addEventListener("focus", function () {
		document
			.getElementById("invalidPass")
			.setAttribute("style", "display:none");
		document
			.getElementById("invalidEmail")
			.setAttribute("style", "display:none");
		document.getElementById("invalid").setAttribute("style", "display:none");
		document.getElementById("invalidUsername").setAttribute("style","display:none")
	});
}


document.getElementById("name").addEventListener("input",function(){
	firebase.database().ref("usernames").get().then(res => {
		usernames = res.val();
		if (usernames.includes(this.value.toLowerCase())){
			document.getElementById("invalidUsername").setAttribute("style","display:block")
		}else{
			document.getElementById("invalidUsername").setAttribute("style","display:none")
		}
	})
})