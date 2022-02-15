function spawnMonster() {
    var monsterChances = {
        "microplastico": 30
    };

    if (Math.round(Math.random() * monsterChances["microplastico"]) === 0) {
        return "microplastico";
    }
    return 0;
}

var microPlastico = new function() {
    this.img = new Image();
    this.img.src = "../imagens/inimigo_microplástico.png";
    this.xDif = 10;
    this.yDif = -30;
    this.width = 69;
    this.height = 60;

    this.draw = function(blockX, blockY) {
        ctx.drawImage(this.img, blockX + this.xDif, blockY + this.yDif, this.width, this.height);
    }
}

var monsterFunctions = {
    "smallRed": microPlastico
}