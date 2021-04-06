importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js")

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
firebase.messaging()
/*
firebase.messaging().onBackgroundMessage(payload => {
	console.log(payload)
	title = payload.notification.title;
	body = payload.notification.body;
	icon ="https://firebasestorage.googleapis.com/v0/b/messages-cf547.appspot.com/o/new-chat.png?alt=media&token=bd9f8574-1ee2-4724-83e6-d6ef099f5b67"

	self.registration.showNotification(title,
		{body:body, icon:icon});
})*/


