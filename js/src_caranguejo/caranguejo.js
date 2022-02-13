const caranguejo = document.getElementById("caranguejo")
var bottom=0

function saltar(){
bottom +=30
    caranguejo.style.bottom = bottom + "px"
}

window.onkeydown = function(event) {
    processa_tecla(event.key)
}

function processa_tecla(key) {
    if (key == " ") {
        saltar();
    }
}