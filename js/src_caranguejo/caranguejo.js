const caranguejo = document.getElementById("caranguejo")
var bottom=0
var left=0
var gravity=0.9
var air=false // caranguejo está a saltar
var andarparaesquerda = false
var andarparadireita = false
var timerdireita
var timeresquerda

function saltar(){
    if (air) return // impedir double jump
    var timerup = setInterval(function (){
        if (bottom>250){
            clearInterval(timerup);
            var timerdown =setInterval(function (){
                if (bottom <0){
                    clearInterval(timerdown)
                    air=false
                }
                bottom -=5
                caranguejo.style.bottom = bottom + "px";
            }, 20)
        }

        air= true
        bottom +=30;
        bottom= bottom * gravity
        caranguejo.style.bottom = bottom + "px";}, 20)
}

function esquerda() {
    document.getElementById("imagem").src="../imagens/andar%20esquerda.png";
    if (andarparadireita){
        clearInterval(timerdireita);
        andarparadireita= false;
    }
    andarparaesquerda = true
     timeresquerda = setInterval(function () {
         console.log("esquerda")
        left -= 5;
        caranguejo.style.left = left + "px";
    }, 20)
}

    function direita(){
        document.getElementById("imagem").src="../imagens/andar%20direita.png";
    if (andarparaesquerda){
        clearInterval(timeresquerda);
        andarparaesquerda=false;
    }
        andarparadireita=true
         timerdireita = setInterval(function (){
             console.log("direita")
            left += 5;
            caranguejo.style.left = left + "px";
        },20)

}

window.onkeydown = function(event) {
    processa_tecla(event.key)
}

function processa_tecla(key) {
    if (key === " ") {
        saltar();
    }
    else if (key === "ArrowUp"){
        saltar();
    }
    else if (key === "ArrowLeft"){
        esquerda();
    }
    else if (key === "ArrowRight"){
        direita();
    }

}