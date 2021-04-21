class Message{
    constructor(message){
        this.id = message.id
        this.type = message.type
        this.message = message.message
        if (this.type != "alert"){
            this.filename = message.fileName
            this.sender = message.sender
            this.uid = message.uid
            this.timestamp = message.timestamp
            this.messageEl = this.createBaseChat()
        }else{
            this.messageEl = this.alert()
        }
        
    }

    createBaseChat(){
        this.messageDiv = document.createElement("div")
        this.messageDiv.classList = ["message"]
        this.messageDiv.id = this.id
        this.messageDiv.setAttribute("value",this.timestamp)
        this.div = document.createElement("div")
        this.h3 = document.createElement("h3")

        var date = new Date(this.timestamp);
        var hours = date.getHours();
        var mins = date.getMinutes();
        if (mins.toString().length == 1){
            mins = "0" + mins.toString()
        }
        var time = hours + ":" + mins;

        this.h3.innerText = time

        if (this.uid == auth.currentUser.uid){
            this.div.classList = ["right"]
        }else{
            this.div.setAttribute("class", "left");
            this.h2 = document.createElement("h2")
            this.h2.innerText = this.sender
            this.div.appendChild(this.h2)
        }
        if (!this.type){
            this.textChat()
        }else if (this.type == "image"){
            this.imageChat()
        }else if (this.type == "video"){
            this.videoChat()
        }
        this.div.appendChild(this.h3)
        this.messageDiv.appendChild(this.div)
        return this.messageDiv
    }
    textChat(){
        this.h1 = document.createElement("h1")
        this.h1.innerText = this.message
        this.div.appendChild(this.h1)
    }

    imageChat(){
        this.img = document.createElement("img")
        this.img.setAttribute("loading","lazy")
        this.img.id = this.timestamp
        firebase.storage().ref(this.filename).getDownloadURL().then(url => {
            this.img.src = url
        })

        this.div.appendChild(this.img)
    }

    videoChat(){
        this.video = document.createElement("video")
        this.video.setAttribute("controls","true")
        this.video.id = this.timestamp
        this.video.setAttribute("value","video")
        this.video.setAttribute("preload", "none");
        this.video.setAttribute("data-setup", "{}");

        firebase.storage().ref(this.filename).getDownloadURL().then(url => {
            this.video.src = url
            //this.video.load()
        })

        this.div.appendChild(this.video)
    }

    alert(){
        this.messageDiv = document.createElement("div")
        this.messageDiv.classList = ["message"]
        this.messageDiv.id = this.id

        this.div = document.createElement("div")
        this.div.id = "alert"

        this.h1 = document.createElement("h1")
        this.h1.innerText = this.message

        this.div.appendChild(this.h1)
        this.messageDiv.appendChild(this.div)
        return this.messageDiv
    }
}
