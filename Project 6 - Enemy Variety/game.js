/*window*/document.addEventListener(/*load*/'DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-el')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Game {
        constructor (ctx, width, height) {
            this.ctx = ctx
            this.width = width
            this.height = height
            this.enemies = []
            this.enemyInterval = 500
            this.enemyTimer = 0
            this.enemyTypes = ['worm', 'ghost', 'spider']
        }

        update(deltaTime){
           this.enemies = this.enemies.filter((object) => !object.markedForDeletion)
            if(this.enemyTimer > this.enemyInterval){
                this.#addNewEnemy()
                this.enemyTimer = 0
                console.log(this.enemies)
            }else {
                this.enemyTimer += deltaTime
            }

            this.enemies.forEach((object) => object.update(deltaTime))
        }

        draw() {
            this.enemies.forEach((object) => object.draw(this.ctx))
        }

        #addNewEnemy(){
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)]
            if(randomEnemy == 'worm') this.enemies.push(new Worm(this))
            if(randomEnemy == 'ghost') this.enemies.push(new Ghost(this))
            if(randomEnemy == 'spider') this.enemies.push(new Spider(this))
            // this.enemies.sort((a,b) =>{
            //     return a.y - b.y
            // })
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game
            this.markedForDeletion = false

            //animation
            this.frameX = 0
            this.maxFrame = 5
            this.frameInterval = 100
            this.frameTimer = 0
        }

        update(deltaTime){
            this.x -= this.velocityX * deltaTime
            if(this.x < 0 - this.width) this.markedForDeletion = true
            if(this.frameTimer > this.frameInterval){
                if(this.frameX < this.maxFrame) this.frameX++
                else this.frameX = 0
                this.frameTimer = 0
            }else {
                this.frameTimer += deltaTime
            }
        }

        draw(ctx){
            // ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
        }
    }
    
    //subclass of Enemy
    class Worm extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 229
            this.spriteHeight = 171
            this.width = this.spriteWidth * 0.5
            this.height = this.spriteHeight * 0.5
            this.x = this.game.width
            this.y = this.game.height - this.height
            this.image = worm // from index.html
            this.velocityX = Math.random() * 0.1 + 0.1

        }
    }

    //subclass of Enemy
    class Ghost extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 261
            this.spriteHeight = 209
            this.width = this.spriteWidth * 0.5
            this.height = this.spriteHeight * 0.5
            this.x = this.game.width
            this.y = Math.random() * (this.game.height * 0.7)
            this.image = ghost // from index.html
            this.velocityX = Math.random() * 0.2 + 0.1
            this.angle = 0
            this.curve = Math.random() * 3

        }
        update(deltaTime){
            ctx.save()
            super.update(deltaTime)
            this.y += Math.sin(this.angle) * this.curve
            this.angle += 0.04
            ctx.restore()
        }
        draw(ctx){
            ctx.save()
            ctx.globalAlpha = 0.7
            super.draw(ctx) //enemy.draw()
            ctx.restore()
        }
    }

    //subclass of Enemy
    class Spider extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 310
            this.spriteHeight = 175
            this.width = this.spriteWidth * 0.5
            this.height = this.spriteHeight * 0.5
            this.x = Math.random() * this.game.width
            this.y = 0 - this.height
            this.image = spider // from index.html
            this.velocityX = 0
            this.velocityY = Math.random() * 0.1 + 0.1
            this.maxLength = Math.random() * this.game.height

        }
        update (deltaTime){
            ctx.save()
            if(this.y < 0 - this.height * 2) this.markedForDeletion = true
            super.update(deltaTime)
            this.y += this.velocityY * deltaTime
            if(this.y > this.maxLength) this.velocityY *= -1
            ctx.restore()
        }
        draw(ctx){
            ctx.save()
            //spider path
            ctx.beginPath()
            ctx.moveTo(this.x + this.width * 0.5, 0)
            ctx.lineTo(this.x + this.width * 0.5, this.y + 10)
            ctx.stroke()
            super.draw(ctx)
            ctx.restore()
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height)
    let lastTime = 1
    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        game.update(deltaTime)
        game.draw()
        requestAnimationFrame(animate)
    }
    animate(0)
})