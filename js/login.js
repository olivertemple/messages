var firebaseConfig = {
    apiKey: "AIzaSyD7Gabw0iS55wqJ2jJq3T6b0GX8ys-T5DA",
    authDomain: "messages-cf547.firebaseapp.com",
    databaseURL: "https://messages-cf547-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "messages-cf547",
    storageBucket: "messages-cf547.appspot.com",
    messagingSenderId: "410065535747",
    appId: "1:410065535747:web:318ce0834df551f5911f36",
    measurementId: "G-TLWM2Y484G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth=firebase.auth()

function login(){
    email = document.getElementById("email").value
    pass = document.getElementById("password").value
    const promise = auth.signInWithEmailAndPassword(email, pass)

    promise.catch(e => {
        console.log(e)
        if (e.code == "auth/user-not-found"){
            console.log("account doesn't exist, please signup")
            document.getElementById("invalid").setAttribute("style","display:block")
        }else if (e.code == "auth/invalid-email"){
            console.log("invalid email address")
            document.getElementById("invalidEmail").setAttribute("style","display:block")
        }else if (e.code == "auth/wrong-password"){
            console.log("invalid password")
            document.getElementById("invalidPass").setAttribute("style","display:block")
        }
    })
}


firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        console.log(firebaseUser.uid)
        
        window.location.href="/index.html"
    }else{
        console.log("not logged in")
    }
})

document.getElementById("email").addEventListener("focus", function(){
    document.getElementById("invalidPass").setAttribute("style","display:none")
    document.getElementById("invalidEmail").setAttribute("style","display:none")
    document.getElementById("invalid").setAttribute("style","display:none")
})
document.getElementById("password").addEventListener("focus", function(){
    document.getElementById("invalidPass").setAttribute("style","display:none")
    document.getElementById("invalidEmail").setAttribute("style","display:none")
    document.getElementById("invalid").setAttribute("style","display:none")
})