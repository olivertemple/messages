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

        var months = [
            "jan",
            "feb",
            "march",
            "april",
            "may",
            "june",
            "july",
            "aug",
            "nov",
            "dec"
        ]

        var date = new Date(this.timestamp);
        var hours = date.getHours();
        var mins = date.getMinutes();
        var dateNum = date.getDate()
        var day = months[date.getDay()]
        if (mins.toString().length == 1){
            mins = "0" + mins.toString()
        }
        if (+ new Date() - 8.64e+7 > this.timestamp){
            var time = day+" "+dateNum+" "+hours + ":" + mins;
        }else{
            var time = hours+":"+mins
        }

        this.h3.innerText = time

        if (this.uid == auth.currentUser.uid){
            this.div.classList = ["right"]
        }else{
            this.div.classList = ["left"];
            this.h2 = document.createElement("h2")
            this.h2.innerText = this.sender
            this.div.appendChild(this.h2)
        }
        this.messageDiv.appendChild(this.div)
        return this.messageDiv
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


class Video extends Message{
    constructor(message){
        super(message)
        this.video = document.createElement("video")
        this.video.setAttribute("controls","true")
        this.video.id = this.timestamp
        this.video.setAttribute("value","video")
        this.video.setAttribute("preload", "none");
        this.video.setAttribute("data-setup", "{}");

        firebase.storage().ref(this.filename).getDownloadURL().then(url => {
            this.video.src = url
        })

        this.div.appendChild(this.video)
        this.div.appendChild(this.h3)

    }
}

class ImageChat extends Message{
    constructor(message) {
        super(message)
        this.img = document.createElement("img")
        //this.img.setAttribute("loading","lazy")
        this.img.id = this.timestamp
        firebase.storage().ref(this.filename).getDownloadURL().then(url => {
            this.img.src = url
        })

        this.div.appendChild(this.img)
        this.div.appendChild(this.h3)
        this.div.setAttribute("onclick","showImage(this)")
    }
}

class TextChat extends Message{
    constructor(message){
        super(message)
        this.h1 = document.createElement("h1")
        this.h1.innerText = this.message
        this.div.appendChild(this.h1)
        this.div.appendChild(this.h3)
    }
}



class FileChat extends Message{
    constructor(message){
        super(message)
        console.log(message)
        var div = document.createElement("div")
        div.id="fileOptionsDiv"
        this.h1 = document.createElement("a")
        this.h1.innerText = this.filename
        this.h1.setAttribute("download",true)
        div.appendChild(this.h1)
        this.img = document.createElement("img")
        this.img.src = "./assets/download.svg"
        this.img.id = "fileOptions"
        this.img.setAttribute("onclick","this.parentElement.children[0].click()")
        firebase.storage().ref(this.filename).getDownloadURL().then(url => {
            this.h1.setAttribute("href",url)
        })
        div.appendChild(this.img)
        this.div.appendChild(div)
        this.div.appendChild(this.h3)

    }
}




function showImage(item){
    for (child in item.children){
        if (item.children[child].nodeName=="IMG"){
            item = item.children[child]
            break
        }
    }
    window.location = "#image"
    let imageDiv = document.createElement("div")
    let div = document.createElement("div")
    let image = document.createElement("img")
    image.src = item.src
    div.appendChild(image)
    div.id = "imageWrapper"
    imageDiv.appendChild(div)
    imageDiv.classList = ["viewImage"]
    imageDiv.id = "viewImage"
    document.getElementById("main").appendChild(imageDiv)

    document.getElementById("back").setAttribute("onclick","hideImage()")

    imageDiv.addEventListener("click",event => {
        if (!event.path.includes(document.getElementById("imageWrapper"))){
            hideImage()
        }
    })
    div.addEventListener("touchstart", e => {
        y = e.changedTouches[0].clientY
    })
    div.addEventListener("touchmove", e => {
        if (window.innerWidth < 600){
            change = e.changedTouches[0].clientY - y
            document.getElementById("imageWrapper").style="margin-top:"+change+"px"
            document.getElementById("imageWrapper").children[0].style="max-width: calc(100vw - "+(Math.abs(change) + 20)+"px";

        }
        
    })
    div.addEventListener("touchend", e => {
        if (Math.abs(change) > 200){
            hideImage()
        }else{
            document.getElementById("imageWrapper").style=""
            document.getElementById("imageWrapper").children[0].style="";
        }
    })
}

function hideImage(){
    window.location = "#chat"
    if (document.getElementById("viewImage")){ 
        document.getElementById("viewImage").remove()
    }
    document.getElementById("back").setAttribute("onclick","exit()")
}