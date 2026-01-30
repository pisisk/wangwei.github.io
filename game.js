const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    parent: 'game-container',
    physics: { default: 'arcade', arcade: { gravity: { y: 1000 }, debug: false } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let cursors;
let score = 0;
let scoreText;
let currentLevel = 1;
let levelGoal = 5; // 每关需要收集的目标数

function preload() {
    // 加载头像并给它一个 key
    this.load.image('hero', 'avatar.jpg');
}

function create() {
    // 设置动态背景色
    const colors = [0x4facfe, 0x667eea, 0xf093fb];
    this.cameras.main.setBackgroundColor(colors[currentLevel - 1] || 0x333333);

    // 1. 创建平台
    platforms = this.physics.add.staticGroup();
    platforms.create(200, 580, null).setScale(10, 1).refreshBody(); // 地板
    
    // 根据关卡生成不同的随机平台
    for(let i=0; i<4; i++) {
        let x = Phaser.Math.Between(50, 350);
        let y = 450 - (i * 120);
        let p = platforms.create(x, y, null).setScale(3, 0.5).refreshBody();
        p.setTint(0x000000);
    }

    // 2. 创建主角 (你的头像)
    player = this.physics.add.sprite(100, 450, 'hero');
    player.setDisplaySize(50, 50); // 强制缩放到合适大小
    player.setCircle(150); // 设置圆形碰撞体
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    // 3. 关卡目标 (星星/金币)
    const stars = this.physics.add.group({
        key: 'hero', // 也可以用头像作为收集物
        repeat: levelGoal - 1,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(child => {
        child.setDisplaySize(30, 30);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // 4. 碰撞检测
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, (p, s) => {
        s.disableBody(true, true);
        score += 10;
        scoreText.setText('分数: ' + score + ' | 关卡: ' + currentLevel);
        
        if (stars.countActive(true) === 0) {
            nextLevel.call(this);
        }
    }, null, this);

    // 5. UI
    scoreText = this.add.text(16, 16, '分数: ' + score + ' | 关卡: ' + currentLevel, { fontSize: '20px', fill: '#fff', backgroundColor: '#000' });
    
    cursors = this.input.keyboard.createCursorKeys();
    // 增加屏幕点击支持（手机端）
    this.input.on('pointerdown', () => {
        if (player.body.touching.down) player.setVelocityY(-500);
    });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-500);
    }
}

function nextLevel() {
    currentLevel++;
    levelGoal += 2; // 下一关目标更多
    if (currentLevel > 3) {
        alert("恭喜通关！你已经登峰造极！");
        currentLevel = 1;
        score = 0;
    }
    this.scene.restart();
}