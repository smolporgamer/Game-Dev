const canvas = document.getElementById('canvas-el')
const ctx = canvas.getContext('2d')
canvas.width = 500;
canvas.height = 700;
const explosions = []
let canvasPosition = canvas.getBoundingClientRect()
// console.log(canvasPosition)

function createImage(imageSrc) {
    const image = new Image();
    image.onload = function() {
        console.log("Image loaded successfully:", imageSrc);
    };
    image.onerror = function() {
        console.error("Error loading image:", imageSrc);
    };
    image.src = imageSrc; // Set the source inside the function
    return image;
}

let boomImage = createImage('./assets/img/boom.png');
let ravenImage = createImage('./assets/img/raven.png');
// console.log(boomImage)
class Explosion {
    constructor(x, y){
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.width = this.spriteWidth * 0.7
        this.height = this.spriteHeight * 0.7
        this.x = x
        this.y = y
        this.image = new Image()
        this.image.src = './assets/img/boom.png'
        this.frame = 0
        this.timer = 0
        this.angle = Math.random() * 6.2

        //sound animation
        this.sound = new Audio()
        this.sound.src = './assets/sfx/Ice attack 2.wav'
    }
    update (){
        if(this.frame ===0) this.sound.play()
        this.timer++
        if(this.timer % 10 === 0) {
            this.frame++
        }
    }

    draw(){
        // save current state to save only 1 draw call
        // rotate
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        // ctx.drawImage(image, sx, sy, sw, sh , dx, dy, dw, dh)

        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0,
            this.spriteWidth, this.spriteHeight, 0 - this.width * 0.5, 0  - this.height * 0.5,
            this.width, this.height);
        ctx.restore()
    }
    
}

window.addEventListener('click', (e) =>{
    createAnimation(e)
})

function createAnimation(e){
    let positionX = e.x - canvasPosition.left 
    let positionY = e.y - canvasPosition.top
    explosions.push(new Explosion(positionX, positionY))
    console.log(explosions)
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(let i = 0; i < explosions.length; i++){
        explosions[i].update()
        explosions[i].draw()
        if(explosions[i].frame > 5){
            explosions.splice(i, 1)
            i--
        }
    }
    requestAnimationFrame(animate)
}
animate()