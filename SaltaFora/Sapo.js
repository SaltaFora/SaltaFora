
document.addEventListener('DOMContentLoaded', () => {
    let keysDown = {}

    const grid=document.querySelector(".grid");
    const doodler = document.createElement("div");
    let isGameOver = false;
    let platformCount = 13;
    let platforms = [];
    let score = 0
    let doodlerLeftSpace = 50
    let startPoint = 400
    let doodlerBottomSpace = startPoint
    let upTimerId
    let downTimerId
    let isJumping = true
    let leftTimerId
    let rightTimerId
    let leafFrozen = -1
    let leafCooldown = false;

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function control() {
        if(keysDown['ArrowLeft'] && leafFrozen == -1) {
            doodlerLeftSpace -= 4
            doodler.style.left = doodlerLeftSpace + 'px';
        } else if (keysDown['ArrowRight'] && leafFrozen == -1) {
            doodlerLeftSpace += 4
            doodler.style.left = doodlerLeftSpace + 'px';
        }
        if(doodlerLeftSpace < -100) {
            doodlerLeftSpace = window.innerWidth
        }
        if(doodlerLeftSpace > window.innerWidth) {
            doodlerLeftSpace = -100
        }
         else if (keysDown['r']) {
            if (isGameOver) {
                isGameOver=false
                doodlerLeftSpace = 50
                startPoint = 150
                doodlerBottomSpace = startPoint
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
        this.left = Math.random() * 1400;
        this.visual= document.createElement('div');

        this.type = 'wood';
        let random = Math.random()
        if(random < 0.25) this.type = "stone"
        else if(random < 0.35) this.type = "leaf"
        else if(random < 0.4) this.type = "enemy"

        this.offset = 0
        this.moveSpeed = 0
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

function createPlatforms(){
    if(isGameOver) return
    for (let i=0; i < platformCount; i++){
        let platformGap = 1500 / platformCount;
        let newPlatBottom = 100 + i * platformGap;
        let newPlatform = new Platform(newPlatBottom)

        

        platforms.push(newPlatform)
    }
}

    function movePlatforms() {
        if(isGameOver) return
        //if (doodlerBottomSpace > 200) {
            for(let i in platforms) {
                let platform = platforms[i]

                if(platform.type == 'stone') {
                    platform.offset +=platform.moveSpeed
                    if(platform.offset < -100) platform.moveSpeed = 1.2
                    if(platform.offset > 100) platform.moveSpeed = -1.2
                }

                platform.visual.style.left = platform.left + platform.offset + 'px'
                platform.bottom -= 0.7
                if(doodlerBottomSpace > 200) platform.bottom -=0.4
                if(doodlerBottomSpace > 500) platform.bottom -=2
                if(doodlerBottomSpace > 800) platform.bottom -=3
                if(doodlerBottomSpace > 1000) platform.bottom -=6

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
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodler.style.backgroundImage="url('imagens/sapoSalta_100x102.png')";
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > (startPoint + 270)) {
                fall()
                isJumping = false
            }

            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 100)) &&
                    ((doodlerLeftSpace + 60) >= platform.left+platform.offset) &&
                    (doodlerLeftSpace <= (platform.left+platform.offset + 100))
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
            doodlerBottomSpace -= 7
            doodler.style.backgroundImage="url('imagens/sapo_1_100x101.png')";
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + (platform.type == 'enemy'? 100 : 15))) &&
                    ((doodlerLeftSpace + 60) >= platform.left+platform.offset) &&
                    (doodlerLeftSpace <= (platform.left+platform.offset + 100))
                ) {
                        if(platform.type == 'leaf' && !isJumping) {
                            doodlerBottomSpace = platform.bottom+15
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
                            if(doodlerBottomSpace >= platform.bottom+80) {
                                jump()
                                isJumping = true
                            }
                            else {
                                console.log('hit')
                                gameOver()
                            }
                            
                            
                        } else if(!isJumping) {
                            startPoint = doodlerBottomSpace
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
        grid.innerHTML = 'Score: ' + score
        grid.innerHTML += '<br><br><br>Pressiona \'r\' para jogar novamente!'
    }






function start(){
    if (!isGameOver){
        grid.innerHTML = ''
        score = 0
        doodlerLeftSpace = 50
        startPoint = 400
        doodlerBottomSpace = startPoint
        createPlatforms();
        createDoodler();
        
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

        



start() // botão

  function update() {
    control()
    movePlatforms()
    if(leafFrozen > 0 && leafCooldown) leafFrozen -= 1
    if(leafFrozen == 0) {
        startPoint = doodlerBottomSpace
        jump()
        leafFrozen = -1;
        isJumping = true
    }

    if(!isGameOver) requestAnimationFrame(update)
  }


})