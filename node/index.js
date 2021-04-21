var admin = require("firebase-admin");

const serviceAccount = require("./messages-cf547-firebase-adminsdk-7jcuc-900b2da46d.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyD7Gabw0iS55wqJ2jJq3T6b0GX8ys-T5DA",
	authDomain: "messages-cf547.firebaseapp.com",
	databaseURL:
		"https://messages-cf547-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "messages-cf547",
	storageBucket: "messages-cf547.appspot.com",
	messagingSenderId: "410065535747",
	appId: "1:410065535747:web:318ce0834df551f5911f36",
	measurementId: "G-TLWM2Y484G",
  });
var db = admin.database();
startupTime = + new Date()

db.ref("chats/").on("child_added", res => {
    chatID = res.val().id
    people = res.val().people;
    numPeople = []
    for (person in people){
        numPeople.push(person)
    }
    numPeople = numPeople.length
    tempName(chatID, numPeople)
})

function tempName(chatID, numPeople){
    db.ref("chats/"+chatID+"/messages").on("child_added",(res) => {
        if (res.val().timestamp > startupTime){
            console.log(res.val())
            if (numPeople <= 2){
                getUsers(chatID,res.val().uid, res.val().message, res.val().sender, res.val().timestamp)
            }else{
                db.ref("chats/"+chatID+"/name").get().then(name => {
                    getUsers(chatID,res.val().uid, res.val().sender+": "+res.val().message, name.val(), res.val().timestamp)
                })
                
            }
            
        }
    })
}
function getUsers(chatID, uid, message, sender, timestamp){
    db.ref("chats/"+chatID+"/people").get().then(res => {
        people = res.val();
        for (person in people){
            
            db.ref("users/"+person+"/regToken").get().then(data => {
                if (data.val()){
                    for (token in data.val()){
                        sendNotification(token, message, sender, chatID, timestamp)
                    }
                }
            })
        }
    })
}

function sendNotification(regToken, message, sender, chatID, timestamp){
    console.log(regToken)
    var payload = {
        notification:{
            title: sender,
            body:message,
            icon:"https://firebasestorage.googleapis.com/v0/b/messages-cf547.appspot.com/o/new-chat.png?alt=media&token=bd9f8574-1ee2-4724-83e6-d6ef099f5b67",
            tag:sender,
            click_action:"https://whatsupmessaging.co.uk/",
        },
        data:{
            id: chatID,
            timestamp: String(timestamp)
        }
        //badge:"https://firebasestorage.googleapis.com/v0/b/messages-cf547.appspot.com/o/new-chat.png?alt=media&token=bd9f8574-1ee2-4724-83e6-d6ef099f5b67"
    }
    var options = {priority: "high"}

    admin.messaging().sendToDevice(regToken, payload, options).then(resp => {
        console.log(resp)
    }).catch(err => {
        console.log(err)
    })
}

/*
  var message = {
    webpush: {
      notification: {
        title: "Let's Join App",                          // Your message title
        body: messageBody,                                // Your message body
        icon: "./img/icons/android-chrome-192x192.png",   // Your App icon, up to 512x512px, any color
        badge: "./img/icons/badge.png",                   // Your app badge, 24x24px, white content on transparent background
      },
      fcmOptions: {
        link: "https://www.letsjoin.app",                 // Your Link
      },
    },
    token,
  };
*/