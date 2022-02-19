document.addEventListener('DOMContentLoaded', () => {
    let keysDown = {}

    const grid=document.querySelector(".gridCaranguejo");
    const caranguejo = document.createElement("div");
    let isGameOver = false;
    let platformCount = 13;
    let platforms = [];                                                                          //Objeto
    let score = 0
    let caranguejoLeftSpace = 50
    let startPoint = 400
    let caranguejoBottomSpace = startPoint
    let upTimerId
    let downTimerId
    let isJumping = true
    let leftTimerId
    let rightTimerId
    let leafFrozen = -1
    let leafCooldown = false;
    let doubleJumped = false


    function createCaranguejo() {
        grid.appendChild(caranguejo)
        caranguejo.classList.add('caranguejo')
        caranguejoLeftSpace = platforms[0].left
        caranguejo.style.left = caranguejoLeftSpace + 'px'
        caranguejo.style.bottom = caranguejoBottomSpace + 'px'
    }

    function control() {
        if(keysDown['ArrowLeft'] && leafFrozen == -1) {
            caranguejoLeftSpace -= 4
            caranguejo.style.left = caranguejoLeftSpace + 'px';
        } else if (keysDown['ArrowRight'] && leafFrozen == -1) {
            caranguejoLeftSpace += 4
            caranguejo.style.left = caranguejoLeftSpace + 'px';
        }

            caranguejo.style.left = caranguejoLeftSpace + 'px';
        }
        if(caranguejoLeftSpace < -100) {
            caranguejoLeftSpace = window.innerWidth
        }
        if(caranguejoLeftSpace > window.innerWidth) {
            caranguejoLeftSpace = -100
        }
        else if (keysDown['r']) {
            if (isGameOver) {
                isGameOver=false
                caranguejoLeftSpace = 50
                startPoint = 150
                caranguejoBottomSpace = startPoint
                clearInterval(rightTimerId)
                clearInterval(leftTimerId)
                grid.innerHTML = ""

                start()
            }

    }



    class Platform{
        constructor(newPlatBottom) {
            this.bottom= newPlatBottom;
            this.left = Math.random() * innerWidth;
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
        //if (caranguejoBottomSpace > 200) {
        for(let i in platforms) {
            let platform = platforms[i]

            if(platform.type == 'stone') {
                platform.offset +=platform.moveSpeed
                if(platform.offset < -100) platform.moveSpeed = 1.2
                if(platform.offset > 100) platform.moveSpeed = -1.2
            }

            platform.visual.style.left = platform.left + platform.offset + 'px'
            platform.bottom -= 0.7
            if(caranguejoBottomSpace > 200) platform.bottom -=0.4
            if(caranguejoBottomSpace > 500) platform.bottom -=2
            if(caranguejoBottomSpace > 800) platform.bottom -=3
            if(caranguejoBottomSpace > 1000) platform.bottom -=6

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
            caranguejoBottomSpace += 20
            caranguejo.style.bottom = caranguejoBottomSpace + 'px'
            if (caranguejoBottomSpace > (startPoint + 270)) {
                fall()
                isJumping = false
            }

            platforms.forEach(platform => {
                if (
                    (caranguejoBottomSpace >= platform.bottom) &&
                    (caranguejoBottomSpace <= (platform.bottom + 100)) &&
                    ((caranguejoLeftSpace + 60) >= platform.left+platform.offset) &&
                    (caranguejoLeftSpace <= (platform.left+platform.offset + 100))
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
            console.log("fall")
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(function () {
            caranguejoBottomSpace -= 7
            caranguejo.style.bottom = caranguejoBottomSpace + 'px'
            if (caranguejoBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (caranguejoBottomSpace >= platform.bottom) &&
                    (caranguejoBottomSpace <= (platform.bottom + (platform.type == 'enemy'? 100 : 15))) &&
                    ((caranguejoLeftSpace + 60) >= platform.left+platform.offset) &&
                    (caranguejoLeftSpace <= (platform.left+platform.offset + 100))
                ) {
                    if(platform.type == 'leaf' && !isJumping) {
                        caranguejoBottomSpace = platform.bottom+15
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
                        if(caranguejoBottomSpace >= platform.bottom+80) {
                            jump()
                            isJumping = true
                        }
                        else {
                            console.log('hit')
                            gameOver()
                        }


                    } else if(!isJumping) {
                        startPoint = caranguejoBottomSpace
                        jump()
                        isJumping = true
                        doubleJumped = false
                    }


                }
            })

        },20)
    }

    function gameOver() {
        clearInterval(downTimerId)
         caranguejoBottomSpace = startPoint
        isGameOver = true
        platforms = []
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = 'Score: ' + score
        grid.innerHTML += '<br><br><br>Pressiona \'r\' para jogar novamente!'
        doubleJumped=false
    }






    function start(){
        if (!isGameOver){
            grid.innerHTML = ''
            score = 0
            caranguejoLeftSpace = 50
            startPoint = 400
            caranguejoBottomSpace = startPoint
            createPlatforms();
            createCaranguejo();

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
    document.addEventListener('keyup', logKey);
    function logKey(e) {
        if (e.key === ' ' && !isJumping && !doublejumped ) {
            console.log("keyup")
           jump()
            doubleJumped=true

        }
        }






    start()

    function update() {   // loop
        control()
        movePlatforms()
        if(leafFrozen > 0 && leafCooldown) leafFrozen -= 1
        if(leafFrozen == 0) {
            startPoint = caranguejoBottomSpace
            jump()
            leafFrozen = -1;
            isJumping = true
        }

        if(!isGameOver) requestAnimationFrame(update)
    }
    jump()

})