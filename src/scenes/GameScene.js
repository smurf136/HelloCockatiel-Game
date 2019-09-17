let bg
let player
let monster
let cursor
let monsters
let bullet
let bullets
let health = 5
let hp
let normal
let spread
let shootStatus = 1 // 0คือสถานะระหว่างยิงลูกพิเศษ 1ลูกธรรมดา 2ลูกกระจาย 3ลูกเร็ว
let fast
let monsterSpawn
let spreadCount = 0
let fastCount = 0
let fastbullets
let fires
let fastbullet
let enemyFire
let enemyBullet
let leftSpreadBullets
let middleSpreadBullets
let rightSpreadBullets
let item
let items
let cloudSpawn
let clouds
let cloud
let bigFires
let bigFire
let scoreText
let score = 0
let seaAndItemSpawn
let sea
let seas
let bush
let bushs
let randomBush
let fired = false
let checkAmount

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
        
    }

    preload() {
        this.load.spritesheet('player', 'src/image/player.png', {
            frameWidth: 410,
            frameHeight: 310
        })
        this.load.image('bg', 'src/image/background.png')
        this.load.image('bullet', 'src/image/Bullet.png')
        this.load.spritesheet('monster', 'src/image/botSpriteSheet.png', {
            frameWidth: 2232,
            frameHeight: 2232
        })
        this.load.spritesheet('hp', 'src/image/HP.png', {
            frameWidth: 2510,
            frameHeight: 1510
        })
        this.load.spritesheet('fire', 'src/image/Fire.png', {
            frameWidth: 492,
            frameHeight: 703
        })
        this.load.image('cloud1', 'src/image/cloud1.png')
        this.load.image('cloud2', 'src/image/cloud2.png')
        this.load.image('cloud3', 'src/image/cloud3.png')
        this.load.image('cloud4', 'src/image/cloud4.png')
        this.load.image('cloud5', 'src/image/cloud5.png')
        this.load.image('bigFire', 'src/image/bigfire.png')
        this.load.image('sea1', 'src/image/Sea-1.png')
        this.load.image('sea2', 'src/image/Sea-2.png')
        this.load.image('bush1', 'src/image/bush-1.png')
        this.load.image('bush2', 'src/image/bush-2.png')
        this.load.image('bush3', 'src/image/bush-3.png')
        this.load.image('separate', 'src/image/Separate.png')
        this.load.image('rapid', 'src/image/Rapid.png')
    }

    create() {
        bg = this.add.tileSprite(0, 0, 600, 900, 'bg').setOrigin(0, 0)
        player = this.physics.add.sprite(300, 850, 'player').setCollideWorldBounds(true).setDepth(10).setScale(0.4)
        hp = this.physics.add.sprite(450, 50, 'hp').setScale(0.1).setDepth(10)
        var style = {
            font: '32px Arial',
            fill: '#FFFFFF'
        };
        scoreText = this.add.text(16, 16, "Score : 0", style).setDepth(10)

        cursor = this.input.keyboard.createCursorKeys()
        monsters = this.physics.add.group()
        bullets = this.physics.add.group()
        leftSpreadBullets = this.physics.add.group()
        middleSpreadBullets = this.physics.add.group()
        rightSpreadBullets = this.physics.add.group()
        fastbullets = this.physics.add.group()
        fires = this.physics.add.group()
        items = this.physics.add.group()
        clouds = this.physics.add.group()
        bigFires = this.physics.add.group()
        seas = this.physics.add.group()
        bushs = this.physics.add.group()



        this.anims.create({
            key: 'playerAni',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 7
            }),
            framerate: 10,
            repeat: -1
        })


        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('monster', {
                start: 0,
                end: 2
            }),
            framerate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'fireAni',
            frames: this.anims.generateFrameNumbers('fire', {
                start: 0,
                end: 2
            }),
            framerate: 10,
            repeat: -1
        })



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

        monsterSpawn = this.time.addEvent({
            delay: 1500 - score * 0.7,
            callback: function () {
                monster = this.physics.add.sprite(Phaser.Math.Between(50, this.game.config.width - 50), -50, 'monster').setScale(0.05).setDepth(5)
                monsters.add(monster)
                monsters.setVelocityY(200)
            },
            callbackScope: this,
            loop: true
        });


        enemyFire = this.time.addEvent({
            delay: 2500 - score * 0.7,
            callback: function () {
                var position = monsters.getLength()
                for (var i = 0; i < position; i++) {
                    if (!(monsters.getChildren()[i].y >= 650)) {
                        enemyBullet = this.physics.add.sprite(monsters.getChildren()[i].x, monsters.getChildren()[i].y + 50, 'fire').setScale(0.08).setDepth(5)
                        fires.add(enemyBullet)
                    }
                }
                fires.setVelocityY(300)
            },
            callbackScope: this,
            loop: true,
            paused: false
        })

        normal = this.time.addEvent({
            delay: 1000,
            callback: function () {
                bullet = this.physics.add.image(player.x, player.y - 50, 'bullet').setScale(0.2).setDepth(5)
                bullets.add(bullet)
                bullets.setVelocityY(-200)
            },
            callbackScope: this,
            loop: true,
            paused: false
        })


        spreadCount = 0
        spread = this.time.addEvent({
            delay: 1000,
            callback: function () {
                var bullet1 = this.physics.add.image(player.x - 30, player.y - 100, 'bullet').setScale(0.2).setDepth(5)

                var bullet2 = this.physics.add.image(player.x, player.y - 100, 'bullet').setScale(0.2).setDepth(5)

                var bullet3 = this.physics.add.image(player.x + 30, player.y - 100, 'bullet').setScale(0.2).setDepth(5)

                leftSpreadBullets.add(bullet1)
                middleSpreadBullets.add(bullet2)
                rightSpreadBullets.add(bullet3)
                leftSpreadBullets.setVelocity(-120, -150)
                middleSpreadBullets.setVelocity(0, -150)
                rightSpreadBullets.setVelocity(120, -150)
                spreadCount++
                if (spreadCount >= 10) {
                    shootStatus = 1
                    spread.paused = true
                }
            },
            callbackScope: this,
            paused: true,
            loop: true
        })

        fastCount = 0
        fast = this.time.addEvent({
            delay: 300,
            callback: function () {
                fastbullet = this.physics.add.image(player.x, player.y - 100, 'bullet').setScale(0.2).setDepth(5)
                fastbullets.add(fastbullet)
                fastbullets.setVelocityY(-300)
                fastCount++
                if (fastCount == 25) {
                    shootStatus = 1
                    fast.paused = true
                }
            },
            callbackScope: this,
            paused: true,
            loop: true
        })

        seaAndItemSpawn = this.time.addEvent({
            delay: 30000,
            callback: function () {
                if (seas.getLength() < 1) {
                    var whichSea = 'sea' + Phaser.Math.Between(1, 2)
                    if (whichSea == 'sea1') {
                        sea = this.physics.add.image(300, -1700, whichSea).setScale(0.33).setDepth(1)
                    } else {
                        sea = this.physics.add.image(300, -1200, whichSea).setScale(0.33).setDepth(1)
                    }
                    seas.add(sea)
                    seas.setVelocityY(100)
                    var itemSpawn = Phaser.Math.Between(0, 1) // 0 is item will not spawn, 1 is spawn.
                    if (itemSpawn == 1) {
                        var which = Phaser.Math.Between(1, 2)
                        if (which == 1) {
                            if (whichSea == 'sea1') {
                                item = this.physics.add.image(sea.x, sea.y + 100, 'separate').setDepth(2).setScale(0.2)
                                item.setData('type', 'spread')
                                items.add(item)
                                items.setVelocityY(100)
                            } else {
                                item = this.physics.add.image(sea.x, sea.y - 100, 'separate').setDepth(2).setScale(0.2)
                                item.setData('type', 'spread')
                                items.add(item)
                                items.setVelocityY(100)
                            }
                        } else {
                            if (whichSea == 'sea1') {
                                item = this.physics.add.image(sea.x, sea.y + 100, 'rapid').setDepth(2).setScale(0.2)
                                item.setData('type', 'fast')
                                items.add(item)
                                items.setVelocityY(100)
                            } else {
                                item = this.physics.add.image(sea.x, sea.y - 100, 'rapid').setDepth(2).setScale(0.2)
                                item.setData('type', 'fast')
                                items.add(item)
                                items.setVelocityY(100)
                            }
                        }
                    }
                }
            },
            callbackScope: this,
            loop: true
        });


        randomBush = this.time.addEvent({
            delay: 14000 - score * 0.8,
            callback: function () {
                var whichBush = Phaser.Math.Between(1, 3)
                if (whichBush == 1) {
                    bush = this.physics.add.image(465, -100, 'bush1').setScale(0.8).setDepth(1)
                    bushs.add(bush)
                } else if (whichBush == 2) {
                    bush = this.physics.add.image(135, -100, 'bush2').setScale(0.3).setDepth(1)
                    bushs.add(bush)
                } else {
                    bush = this.physics.add.image(465, -100, 'bush3').setScale(0.3).setDepth(1)
                    bushs.add(bush)
                }
                bushs.setVelocityY(100)
            },
            callbackScope: this,
            loop: true
        });

        checkAmount = this.time.addEvent({
            delay: 1000,
            callback: function () {
                /* console.log('number of monsters ' + monsters.getLength())
                 console.log('number of fires ' + fires.getLength())
                 console.log('number of bullets ' + bullets.getLength())
                 console.log('number of fastbullets ' + fastbullets.getLength())
                 console.log('number of leftspreadbullets ' + leftSpreadBullets.getLength())
                 console.log('number of middlespreadbullets ' + middleSpreadBullets.getLength())
                 console.log('number of rightspreadbullets ' + rightSpreadBullets.getLength())
                 console.log('shoot status ' + shootStatus)
                 console.log('amount of items ' + items.getLength())
                 console.log('cloud amount ' + clouds.getLength())
                 console.log('bigfire amount ' + bigFires.getLength())
                 console.log('sea amount ' + seas.getLength())
                 console.log('bush amount ' + bushs.getLength())
                 console.log('-----------------------------------------------')*/
            },
            callbackScope: this,
            loop: true
        })

        this.physics.add.overlap(bullets, monsters, this.kill)

        this.physics.add.overlap(leftSpreadBullets, monsters, this.kill)

        this.physics.add.overlap(middleSpreadBullets, monsters, this.kill)

        this.physics.add.overlap(rightSpreadBullets, monsters, this.kill)

        this.physics.add.overlap(fastbullets, monsters, this.kill)

        this.physics.add.overlap(player, monsters, this.monsterHit)

        this.physics.add.overlap(bullets, bigFires, this.killBigFire.bind(this))

        this.physics.add.overlap(leftSpreadBullets, bigFires, this.killBigFire.bind(this))

        this.physics.add.overlap(middleSpreadBullets, bigFires, this.killBigFire.bind(this))

        this.physics.add.overlap(rightSpreadBullets, bigFires, this.killBigFire.bind(this))

        this.physics.add.overlap(fastbullets, bigFires, this.killBigFire.bind(this))

        this.physics.add.overlap(player, bigFires, this.bigFireHit)

        this.physics.add.overlap(player, fires, this.firesHit)

        this.physics.add.overlap(player, items, this.getItem)

        this.physics.add.overlap(bushs, seas, this.checkSeaAndBush)

        this.physics.add.overlap(fires, bushs, (fire, forest) => {
            if (Phaser.Math.Between(1, 70) == 1) { //random bigFire spawn 
                if (!fired) {
                    if (forest.y <= 450) {
                        fire.destroy(true)
                        fired = true
                        bigFire = this.physics.add.image(forest.x, forest.y - 25, 'bigFire').setScale(0.06).setDepth(4)
                        bigFire.setData('health', '3')
                        bigFires.add(bigFire)
                        bigFires.setVelocityY(100)
                    }
                }
            }
        })

    }

    update() {
        bg.tilePositionY -= 1.65
        monsters.playAnimation('fly', '0')
        fires.playAnimation('fireAni', '0')
        player.anims.play('playerAni', true)

        for (var i = 0; i < clouds.getLength(); i++) {
            var cloud = clouds.getChildren()[i]
            if (cloud.y > this.game.config.height + 100) {
                cloud.destroy(true)
            }
        }
        for (var i = 0; i < fires.getLength(); i++) {
            var fire = fires.getChildren()[i]
            if (fire.y > this.game.config.height + 100) {
                fire.destroy(true)
            }
        }

        for (var i = 0; i < bullets.getLength(); i++) {
            /*var bullet = bullets.getChildren()[i]
            if (bullet.y <= -100) {
                bullet.destroy(true)
            }*/
            var bull = bullets.getChildren()[0]
            if (bull.y <= -50) {
                bull.destroy(true)
            }
        }
        for (var i = 0; i < fastbullets.getLength(); i++) {
            var fastBul = fastbullets.getChildren()[i]
            if (fastBul.y <= -100) {
                fastBul.destroy(true)
            }
        }
        for (var i = 0; i < leftSpreadBullets.getLength(); i++) {
            var left = leftSpreadBullets.getChildren()[i]
            if (left.y <= -100) {
                left.destroy(true)
            }
        }
        for (var i = 0; i < middleSpreadBullets.getLength(); i++) {
            var mid = middleSpreadBullets.getChildren()[i]
            if (mid.y <= -100) {
                mid.destroy(true)
            }
        }
        for (var i = 0; i < rightSpreadBullets.getLength(); i++) {
            var right = rightSpreadBullets.getChildren()[i]
            if (right.y <= -100) {
                right.destroy(true)
            }
        }
        for (var i = 0; i < items.getLength(); i++) {
            var item = items.getChildren()[i]
            if (item.y > this.game.config.height + 100) {
                item.destroy(true)
            }
        }
        for (var i = 0; i < seas.getLength(); i++) {
            var sea = seas.getChildren()[i]
            if (sea.y > this.game.config.height + 500) {
                sea.destroy(true)
            }
        }
        for (var i = 0; i < monsters.getLength(); i++) {
            var mons = monsters.getChildren()[i]
            if (mons.y > this.game.config.height + 100) {
                mons.destroy(true)
                score -= 50;
                scoreText.setText('Score: ' + score);
            }
        }
        for (var i = 0; i < bigFires.getLength(); i++) {

            var bigFi = bigFires.getChildren()[i]
            if (bigFi.y > this.game.config.height + 100) {
                bigFi.destroy(true)
                fired = false
                score -= 150;
                scoreText.setText('Score: ' + score);
            }
        }
        for (var i = 0; i < bushs.getLength(); i++) {
            var bush = bushs.getChildren()[i]
            if (bush.y > this.game.config.height + 100) {
                bush.destroy(true)
            }
        }



        if (health <= 0) {
            this.gameOver()
        }

        if (score < -500) {
            this.gameOver()
        }

        if (monsterSpawn.delay < 500) {
            monsterSpawn.delay = 500
        }
        if (enemyFire.delay < 800) {
            enemyFire.delay = 800
        }
        if (randomBush.delay < 700) {
            enemyFire.delay = 700
        }



        if (cursor.left.isDown) {
            player.setVelocityX(-400)
        } else if (cursor.right.isDown) {
            player.setVelocityX(400)
        } else {
            player.setVelocityX(0)
        }


        if (shootStatus == 1) {
            fast.paused = true
            spread.paused = true
            normal.paused = false
        }

        if (shootStatus == 2) {
            shootStatus = 0
            spreadCount = 0
            normal.paused = true
            fast.paused = true
            spread.paused = false
        }

        if (shootStatus == 3) {
            shootStatus = 0
            fastCount = 0
            normal.paused = true
            spread.paused = true
            fast.paused = false
        }



    }



    gameOver() {
        this.scene.start('Restart')
        console.log('Game Over')
    }

    kill(bullet, monster) {
        bullet.destroy(true)
        monster.destroy(true)
        score += 100;
        scoreText.setText('Score: ' + score);
    }

    killBigFire(bullet, bigFire) {
        bullet.destroy(true)
        var health = bigFire.getData('health')
        if (health == 1) {
            bigFire.destroy(true)
            fired = false
            score += 300;
            scoreText.setText('Score: ' + score);
            if (Phaser.Math.Between(1, 3) == 1) { //random item spawn 
                if (Phaser.Math.Between(1, 2) == 1) { //random item type
                    item = this.physics.add.image(bigFire.x, bigFire.y, 'separate').setDepth(2).setScale(0.2)
                    item.setData('type', 'spread')
                    items.add(item)
                    items.setVelocityY(100)
                } else {
                    item = this.physics.add.image(bigFire.x, bigFire.y, 'rapid').setDepth(2).setScale(0.2)
                    item.setData('type', 'fast')
                    items.add(item)
                    items.setVelocityY(100)
                }
            }
        } else if (health == 3) {
            bigFire.setData('health', '2')
        } else {
            bigFire.setData('health', '1')
        }
    }

    monsterHit(player, monster) {
        monster.destroy(true)
        hp.setFrame(5)
        health = 0
    }


    bigFireHit(player, bigFire) {
        bigFire.destroy(true)
        fired = false
        hp.setFrame(5)
        health = 0
    }

    firesHit(player, fire) {
        switch (health) {
            case 5:
                hp.setFrame(1)
                break;
            case 4:
                hp.setFrame(2)
                break;
            case 3:
                hp.setFrame(3)
                break;
            case 2:
                hp.setFrame(4)
                break;
            case 1:
                hp.setFrame(5)
                break;
            case 0:
                break;
        }
        health -= 1
        fire.destroy(true)
    }

    getItem(player, item) {
        var which = item.getData('type')
        item.destroy(true)
        switch (which) {
            case 'spread':
                normal.paused = true
                fast.paused = true
                spread.paused = true
                shootStatus = 2
                break;
            case 'fast':
                normal.paused = true
                fast.paused = true
                spread.paused = true
                shootStatus = 3;
                break;
        }
    }



    checkSeaAndBush(bush, sea) {
        bush.destroy(true)
    }
}







export default GameScene;
