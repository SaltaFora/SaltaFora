document.addEventListener('DOMContentLoaded', () => {
    let keysDown = {}

    const grid=document.querySelector(".gridAve");
    const ave = document.createElement("div");
    let isGameOver = false;
    let platformCount = 13;
    let platforms = [];                                                                          //Objeto
    let score = 0
    let aveLeftSpace = 50
    let startPoint = 400
    let aveBottomSpace = startPoint
    let upTimerId
    let downTimerId
    let isJumping = true
    let leafFrozen = -1
    let leafCooldown = false;
    let downSpeed=7
    let audio = new Audio('../sound/salto_1.mp3');

    function createAve() {
        grid.appendChild(ave)
        ave.classList.add('ave')
        aveLeftSpace = platforms[0].left
        ave.style.left = aveLeftSpace + 'px'
        ave.style.bottom = aveBottomSpace + 'px'
    }

    function control() {
        if(keysDown['ArrowLeft'] && leafFrozen == -1) {
            aveLeftSpace -= 4
            ave.style.left = aveLeftSpace + 'px';
        } else if (keysDown['ArrowRight'] && leafFrozen == -1) {
            aveLeftSpace += 4
            ave.style.left = aveLeftSpace + 'px';
        }
        else if (keysDown[' ']) {
            if(!isJumping) {
                ave.style.backgroundImage="url('./imagens/ave.png')";
                downSpeed=4.5
            }
        }
        if(aveLeftSpace < 0) {
            aveLeftSpace = window.innerWidth
        }
        if(aveLeftSpace > window.innerWidth) {
            aveLeftSpace = 0
        }

        }


    class Platform{                                                               //Propriedades de cada objeto
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

    function createPlatforms(){                                                             // Criação de objeto
        if(isGameOver) return
        for (let i=0; i < platformCount; i++){
            let platformGap = innerWidth / platformCount;
            let newPlatBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatBottom)



            platforms.push(newPlatform)
        }
    }

    function movePlatforms() {                                                              //Plataformas descem

        for(let i in platforms) {
            let platform = platforms[i]

            if(platform.type == 'stone') {
                platform.offset +=platform.moveSpeed
                if(platform.offset < -100) platform.moveSpeed = 1.2
                if(platform.offset > 100) platform.moveSpeed = -1.2
            }

            platform.visual.style.left = platform.left + platform.offset + 'px'
            platform.bottom -= 0.7
            if(aveBottomSpace > 200) platform.bottom -=0.4
            if(aveBottomSpace > 500) platform.bottom -=2
            if(aveBottomSpace > 800) platform.bottom -=3
            if(aveBottomSpace > 1000) platform.bottom -=6

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
            ave.style.backgroundImage="url('./imagens/ave_plana.png')";
            aveBottomSpace += 20
            ave.style.bottom = aveBottomSpace + 'px'
            downSpeed=7
            if (aveBottomSpace > (startPoint + 290)) {
                fall()
                isJumping = false
            }

            platforms.forEach(platform => {
                if (
                    (aveBottomSpace >= platform.bottom) &&
                    (aveBottomSpace <= (platform.bottom + 100)) &&
                    ((aveLeftSpace + 60) >= platform.left+platform.offset) &&
                    (aveLeftSpace <= (platform.left+platform.offset + 100))
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
            aveBottomSpace -= downSpeed
            ave.style.bottom = aveBottomSpace + 'px'
            if (aveBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (aveBottomSpace >= platform.bottom) &&
                    (aveBottomSpace <= (platform.bottom + (platform.type == 'enemy'? 100 : 15))) &&
                    ((aveLeftSpace + 60) >= platform.left+platform.offset) &&
                    (aveLeftSpace <= (platform.left+platform.offset + 100))
                ) {
                    if(platform.type == 'leaf' && !isJumping) {
                        aveBottomSpace = platform.bottom+15
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
                        if(aveBottomSpace >= platform.bottom+80) {
                            jump()
                            isJumping = true
                        }
                        else {
                            console.log('hit')
                            gameOver()
                        }


                    } else if(!isJumping) {
                        startPoint = aveBottomSpace
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
        document.getElementById("home").style.display= "block"
        grid.innerHTML = '<br> Pontuação: ' + score
        grid.innerHTML += '<br>Pressiona \'R\' para jogar novamente!'
    }






    function start(){
        if (!isGameOver){
            document.getElementById("home").style.display = "none"
            document.getElementById('agua').style.display = 'block'
            grid.innerHTML = ''
            score = 0
            aveLeftSpace = 50
            startPoint = 400
            aveBottomSpace = startPoint
            createPlatforms();
            createAve();

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
        if(keysDown['m'] && isGameOver){
            window.open('../escolhaNivel.html');
        }
    })

    document.addEventListener('keyup', function(e) {
        keysDown[e.key] = false
    })





    start()

    function update() {                                                                                //loop
        control()
        movePlatforms()
        if(leafFrozen > 0 && leafCooldown)
            leafFrozen -= 1
        if(leafFrozen == 0) {
            startPoint = aveBottomSpace
            jump()
            leafFrozen = -1;
            isJumping = true
        }

        if(!isGameOver) requestAnimationFrame(update)
    }


})
