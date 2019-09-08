let text 
let style 
 
class MainMenu extends Phaser.Scene { 
    constructor(test) { 
        super({ key: 'MainMenu' }); 
    } 
 
    preload() { 
 
    } 
 
    create() { 
 
        style = { font: '40px Arial', fill: '#FFFFFF', align: 'center' }; 
        text = this.add.text(300, 450, 'Start', style) 
        text.setOrigin(0.5, 0.5); 
        text.setInteractive(); 
        text.on('pointerup', () => { 
            this.scene.start('GameScene'); 
        }); 
    } 
 
    update() { 
 
    } 
 
} 
export default MainMenu;