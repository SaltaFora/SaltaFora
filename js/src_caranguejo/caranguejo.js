//variáveis

const caranguejo = document.getElementById("caranguejo")
var bottom=0
var left=0
var gravity=0.9
var air=false // caranguejo está a saltar
var andarparaesquerda = false
var andarparadireita = false

andarparadireita = andarparaesquerda = false

var timerdireita
var timeresquerda

document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

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
                bottom -=10
                caranguejo.style.bottom = bottom + "px";
            }, 20)
        }

        air= true
        bottom +=30;
        bottom= bottom * gravity
        caranguejo.style.bottom = bottom + "px";}, 10)
}//final função saltar

function esquerda() {
    document.getElementById("imagem").src="../imagens/caranguejo_esquerda.png";
    if (andarparadireita){
        clearInterval(timerdireita);
    }
     timeresquerda = setInterval(function () {
         console.log("esquerda")
        left -= 10;
        caranguejo.style.left = left + "px";
    }, 20)
} //final função esquerda

    function direita(){
        document.getElementById("imagem").src="../imagens/caranguejo_direita.png";
    if (andarparaesquerda){
        clearInterval(timeresquerda);
    }
         timerdireita = setInterval(function (){
             console.log("direita")
            left += 10;
            caranguejo.style.left = left + "px";
        },20)

}//final função direita



function keyDown (evt) {
    switch (evt.keyCode) {
        case 32 :
            saltar();
            break;

        case 38:
            saltar();
            break;

        case 37 :
            clearInterval(timeresquerda)
            clearInterval(timerdireita)
            esquerda();
            andarparadireita = false;
            break;

        case 39:
            clearInterval(timerdireita)
            clearInterval(timeresquerda)
            direita();
            andarparaesquerda = false
            break;

    }
}//final função keyDown


function keyUp(evt) {
    switch(evt.keyCode) {
        case 37:
            clearInterval(timeresquerda)
            break;
        case 39:
            clearInterval(timerdireita)
            break;
    }
}//Final keyUp


