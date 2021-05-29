function expandNav(item){
    item.children[1].style="opacity:0"
    item.children[0].style="transform-origin:top right; transform: translateX(-10px) rotate(-30deg); width:50px;"
    item.children[2].style="transform-origin:top left; transform: translateY(-20px) rotate(30deg); width:50px;"
    item.setAttribute("onclick","closeNav(this)")
    document.getElementById("nav-group").classList.add("shown")
}

function closeNav(item){
    item.setAttribute("onclick","expandNav(this)")
    items = item.children
    for (let i = 0; i<items.length; i++){
        items[i].style=""
    }
    document.getElementById("nav-group").classList.remove("shown")
}

document.addEventListener("click", e=> {
    if (!e.path.includes(document.getElementById("nav"))){
        closeNav(document.getElementById("expand"))
    }
})

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector("#device").src="./assets/iphone-dark.png"
    document.querySelector("#desktop").src="./assets/desktop-dark.png"
}else{
    document.querySelector("#device").src="./assets/iphone-light.png"
    document.querySelector("#desktop").src="./assets/desktop-light.png"

}