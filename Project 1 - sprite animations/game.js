let playerState = 'fall'
const dropdown = document.getElementById('animations')
dropdown.addEventListener('change', (e) =>{
    playerState = e.target.value
})

const canvas = document.getElementById('canvas-el')
const c = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.height = 600

const playerImage = new Image()
playerImage.src = './assets/img/shadow_dog.png'
//row and column sprite box
const spriteWidth = 577
const spriteHeight = 523

//animation picker
// let frameX = 0
// let frameY = 1
let gameFrame = 0;
const staggerFrames = 5 //animation speed
const spriteAnimations = []
const animationStates = [
    {
        name: 'idle',
        frames: 7, 
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'gethit',
        frames: 4,
    }
]
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth
        let positionY = index * spriteHeight
        frames.loc.push({x: positionX, y: positionY})
    }
    spriteAnimations[state.name] = frames
})
function animate (){
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // c.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) // s = source, d = destination
    // sx = row, sy = column
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length //animation speed as well
    let frameX = spriteWidth * position
    let frameY = spriteAnimations[playerState].loc[position].y
    
    c.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight)

    gameFrame++;
    requestAnimationFrame(animate)
}
animate()