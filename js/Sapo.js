
document.addEventListener('DOMContentLoaded', () => {
    let keysDown = {}

    const grid=document.querySelector(".gridSapo");
    const sapo = document.createElement("div");
    let isGameOver = false;
    let platformCount = 13;
    let platforms = [];                                                                          //Objeto
    let score = 0
    let sapoLeftSpace = 50
    let startPoint = 400
    let sapoBottomSpace = startPoint
    let upTimerId
    let downTimerId
    let isJumping = true
    let leftTimerId
    let rightTimerId
    let leafFrozen = -1
    let leafCooldown = false;
    let audio = new Audio('../sound/salto_1.mp3');


    function createSapo() {
        grid.appendChild(sapo)
        sapo.classList.add('sapo')
        sapoLeftSpace = platforms[0].left
        sapo.style.left = sapoLeftSpace + 'px'
        sapo.style.bottom = sapoBottomSpace + 'px'
    }

    function control() {
        if(keysDown['ArrowLeft'] && leafFrozen == -1) {
            sapoLeftSpace -= 4
            sapo.style.left = sapoLeftSpace + 'px';
        } else if (keysDown['ArrowRight'] && leafFrozen == -1) {
            sapoLeftSpace += 4
            sapo.style.left = sapoLeftSpace + 'px';
        }
        if(sapoLeftSpace < 0) {
            sapoLeftSpace = window.innerWidth
        }
        if(sapoLeftSpace > window.innerWidth) {
            sapoLeftSpace = 0
        }
         else if (keysDown['r']) {
            if (isGameOver) {
                isGameOver=false
                sapoLeftSpace = 50
                startPoint = 150
                sapoBottomSpace = startPoint
                clearInterval(rightTimerId)
                clearInterval(leftTimerId)
                grid.innerHTML = ""

                start()
            }
        }
    }

class Platform{
    constructor(newPlatBottom) {
        this.bottom= newPlatBottom;
        this.left = Math.random() * (innerWidth-100);
        this.visual= document.createElement('div');

        this.type = 'wood';
        let random = Math.random()
        if(random < 0.25) this.type = "stone"
        else if(random < 0.35) this.type = "leaf"
        else if(random < 0.4) this.type = "enemy"

        this.offset = 0
        if(this.type == 'stone') {
            this.offset = 0
            this.moveSpeed = -1
        }

        const visual = this.visual;
        visual.classList.add('platform-' + this.type);
        visual.style.left = this.left+ "px";
        visual.style.bottom = this.bottom + "px";
        grid.appendChild(visual);

        }
    }

function createPlatforms(){     // Criação de objeto
    if(isGameOver) return
    for (let i=0; i < platformCount; i++){
        let platformGap = innerWidth / platformCount;
        let newPlatBottom = 100 + i * platformGap;
        let newPlatform = new Platform(newPlatBottom)

        

        platforms.push(newPlatform)
    }
}

    function movePlatforms() {
        if(isGameOver) return

            for(let i in platforms) {
                let platform = platforms[i]

                if(platform.type == 'stone') {
                    platform.offset +=platform.moveSpeed
                    if(platform.offset < -100) platform.moveSpeed = 1.2
                    if(platform.offset > 100) platform.moveSpeed = -1.2
                }

                platform.visual.style.left = platform.left + platform.offset + 'px'
                platform.bottom -= 0.7
                if(sapoBottomSpace > 200) platform.bottom -=0.4
                if(sapoBottomSpace > 500) platform.bottom -=2
                if(sapoBottomSpace > 800) platform.bottom -=3
                if(sapoBottomSpace > 1000) platform.bottom -=6

                platform.visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 50) {
                    platform.visual.classList.remove('platform-' + platform.type)
                    platforms.splice(i,1)
                    score= (score + 1)
                    var newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            }
        //}

    }

    function jump() {
        audio.play()
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            sapo.style.backgroundImage="url('imagens/sapoSalta_100x102.png')";
            sapoBottomSpace += 20
            sapo.style.bottom = sapoBottomSpace + 'px'
            if (sapoBottomSpace > (startPoint + 330)) {
                fall()
                isJumping = false
            }

            platforms.forEach(platform => {
                if (
                    (sapoBottomSpace >= platform.bottom) &&
                    (sapoBottomSpace <= (platform.bottom + 100)) &&
                    ((sapoLeftSpace + 60) >= platform.left+platform.offset) &&
                    (sapoLeftSpace <= (platform.left+platform.offset + 100))
                ) {
                        if(platform.type == 'enemy') {
                            platform.visual.classList.remove('platform-'+platform.type)
                            platforms.splice(platforms.indexOf(platform),1)
                            gameOver()
                            console.log('hit')
                            
                            
                        }
                    
                    
                }
            })

        },30)
    }

    function fall() {
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(function () {
            sapoBottomSpace -= 7
            sapo.style.backgroundImage="url('imagens/sapo_1_100x101.png')";
            sapo.style.bottom = sapoBottomSpace + 'px'
            if (sapoBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (sapoBottomSpace >= platform.bottom) &&
                    (sapoBottomSpace <= (platform.bottom + (platform.type == 'enemy'? 100 : 15))) &&
                    ((sapoLeftSpace + 60) >= platform.left+platform.offset) &&
                    (sapoLeftSpace <= (platform.left+platform.offset + 100))
                ) {
                        if(platform.type == 'leaf' && !isJumping) {
                            sapoBottomSpace = platform.bottom+15
                            if(leafFrozen <= 0 && leafCooldown == false) {
                                leafFrozen = 50
                                leafCooldown = true
                                setTimeout(function() {
                                    leafCooldown = false
                                }, 1000)
                            }
                        } else if(platform.type == 'enemy') {
                            platform.visual.classList.remove('platform-'+platform.type)
                            platforms.splice(platforms.indexOf(platform),1)
                            if(sapoBottomSpace >= platform.bottom+80) {
                                jump()
                                isJumping = true
                            }
                            else {
                                console.log('hit')
                                gameOver()
                            }
                            
                            
                        } else if(!isJumping) {
                            startPoint = sapoBottomSpace
                            jump()
                            isJumping = true
                        }
                    
                    
                }
            })

        },20)
    }
    jump()
    function gameOver() {
        isGameOver = true
        platforms = []
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        document.getElementById('agua').style.display = 'none'
        grid.innerHTML = '<br>Score: ' + score
        grid.innerHTML += '<br><br>Pressiona \'r\' para jogar novamente!'
    }






function start(){
    if (!isGameOver){
        document.getElementById('agua').style.display = 'block'
        grid.innerHTML = ''
        score = 0
        sapoLeftSpace = 50
        startPoint = 400
        sapoBottomSpace = startPoint
        createPlatforms();
        createSapo();
        
        update()
    }
}
document.addEventListener('keydown', function(e) {
    keysDown[e.key] = true
    if(keysDown['r'] && isGameOver) {
        isGameOver = false;
        start()
        jump()
    }
})

document.addEventListener('keyup', function(e) {
    keysDown[e.key] = false
})

        



start()

  function update() {  //loop
    control()
    movePlatforms()
    if(leafFrozen > 0 && leafCooldown) leafFrozen -= 1
    if(leafFrozen == 0) {
        startPoint = sapoBottomSpace
        jump()
        leafFrozen = -1;
        isJumping = true
    }

    if(!isGameOver) requestAnimationFrame(update)
  }


})