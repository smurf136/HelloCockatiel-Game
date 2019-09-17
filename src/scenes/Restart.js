let bg;
let cloudSpawn
let clouds
let cloud
class Restart extends Phaser.Scene {
    constructor(test){
        super({
            key: 'Restart'
        })
        
    }

    preload(){
        this.load.image('bg', 'src/image/background.png')
        this.load.image('cloud1', 'src/image/cloud1.png')
        this.load.image('cloud2', 'src/image/cloud2.png')
        this.load.image('cloud3', 'src/image/cloud3.png')
        this.load.image('cloud4', 'src/image/cloud4.png')
        this.load.image('cloud5', 'src/image/cloud5.png')
    }

    create(){
        bg = this.add.tileSprite(0, 0, 600, 900, 'bg').setOrigin(0, 0)
        var style = {
            fontFamily: 'font1',
            fill: '#ffffff'
        }
        this.text1 = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.5, 'Click to Restart', style).setOrigin(0.5).setFontSize(40)
        this.text1.setInteractive()
        this.text1.on('pointerdown', function(){
            this.scene.scene.start('GameScene')
        })
        this.text2 = this.add.text(this.game.config.width * 0.5, (this.game.config.height * 0.5) + 60, 'Click to Exit', style).setOrigin(0.5).setFontSize(40)
        this.text2.setInteractive()
        this.text2.on('pointerdown', function(){
            this.scene.scene.start('MainMenu')
        })
        clouds = this.physics.add.group()
        cloudSpawn = this.time.addEvent({
            delay: 4500,
            callback: function () {
                var whichCloud = 'cloud' + Phaser.Math.Between(1, 5)
                cloud = this.physics.add.sprite(Phaser.Math.Between(0, this.game.config.width), -100, whichCloud).setScale(0.2).setDepth(11)
                clouds.add(cloud)
                clouds.setVelocityY(150)
            },
            callbackScope: this,
            loop: true
        });
    }

    update(){
        bg.tilePositionY -= 1.65
        for (var i = 0; i < clouds.getLength(); i++) {
            var cloud = clouds.getChildren()[i]
            if (cloud.y > this.game.config.height + 100) {
                cloud.destroy(true)
            }
        }
        
    }

}
export default Restart