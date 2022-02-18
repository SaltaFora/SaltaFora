document.addEventListener('DOMContentLoaded', () => {

    const grid=document.querySelector(".grid");
    const doodler = document.createElement("div");
    let isGameOver = false;
    let platformCount = 13;
    let platforms = [];
    let score = 0
    let doodlerLeftSpace = 50
    let startPoint = 200
    let doodlerBottomSpace = startPoint
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function control(e) {
        if(e.key === 'ArrowLeft') {
            moveLeft()
        } else if (e.key === 'ArrowRight') {
            moveRight()
        } else if (e.key === 'ArrowUp') {
            moveStraight()
        }
         else if (e.key === 'r') {
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
    function moveLeft() {
        clearInterval(rightTimerId)
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                console.log('going left')
                doodlerLeftSpace -=5
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                doodlerLeftSpace= 1500
            }
        },20)
    }
    function moveRight() {
        clearInterval(leftTimerId)
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function () {
            //changed to 313 to fit doodle image
            if (doodlerLeftSpace <= 1500) {
                console.log('going right')
                doodlerLeftSpace +=5
                doodler.style.left = doodlerLeftSpace + 'px'

            } else{
                doodlerLeftSpace= 0
            }
        },20)
    }
    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        if (isJumping){

        }
    }

class Platform{
    constructor(newPlatBottom) {
        this.bottom= newPlatBottom;
        this.left = Math.random() * 1400;
        this.visual= document.createElement('div');

        const visual = this.visual;
        visual.classList.add('platform');
        visual.style.left = this.left+ "px";
        visual.style.bottom = this.bottom + "px";
        grid.appendChild(visual);

        }
    }

function createPlatforms(){
    for (let i=0; i < platformCount; i++){
        let platformGap = 1280 / platformCount;
        let newPlatBottom = 100 + i * platformGap;
        let newPlatform = new Platform(newPlatBottom)
        platforms.push(newPlatform)
    }
}

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    console.log(platforms)
                    score++
                    var newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }

    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            console.log(startPoint)
            console.log('1', doodlerBottomSpace)
            doodler.style.backgroundImage="url('imagens/sapoSalta_100x102.png')";
            doodlerBottomSpace += 30
            doodler.style.bottom = doodlerBottomSpace + 'px'
            console.log('2',doodlerBottomSpace)
            console.log('s',startPoint)
            if (doodlerBottomSpace > (startPoint + 270)) {
                fall()
                isJumping = false
            }
        },30)
    }

    function fall() {
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5
            doodler.style.backgroundImage="url('imagens/sapo_1_100x101.png')";
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 15)) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 100)) &&
                    !isJumping
                ) {
                    console.log('tick')
                    startPoint = doodlerBottomSpace
                    jump()
                    console.log('start', startPoint)
                    isJumping = true
                }
            })

        },20)
    }
    jump()
    function gameOver() {
        isGameOver = true
        document.addEventListener('keydown', control)
        while (grid.firstChild) {
            console.log('remove')
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        }






function start(){
    if (!isGameOver){
        createPlatforms();
        createDoodler();
        setInterval(movePlatforms,30)
        document.addEventListener('keydown', control)
        document.addEventListener('keyup', bugfix)
    }

}

start() // botão




})