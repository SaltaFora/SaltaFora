const caranguejo = document.getElementById("caranguejo")
var bottom=0




function saltar(){
    var timerup = setInterval(function (){
        if (bottom>250){
            clearInterval(timerup);
            var timerdown =setInterval(function (){
                if (bottom === 0){
                    clearInterval(timerdown)
                }
                bottom -=20
                caranguejo.style.bottom = bottom + "px";
            }, 20)
        }
        bottom +=30;
        caranguejo.style.bottom = bottom + "px";}, 20)
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
}