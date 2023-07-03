import * as PIXI from 'pixi.js';
// import * as particles from '@pixi/particle-emitter'
import gsap from 'gsap';
import { sound } from '@pixi/sound';



export default class PIXIGame {
    // private slapSound = PIXI.Sound.from('resources/boing.mp3');
    readonly BOARD_WIDTH = 800;
    readonly BOARD_HEIGHT = 400;
    readonly BOARD_HCENTER = this.BOARD_WIDTH * 0.5;
    readonly BOARD_VCENTER = this.BOARD_HEIGHT * 0.5;
    readonly PADDLE_WIDTH = 10;
    readonly PADDLE_HEIGHT = 80;
    readonly BALL_RADIUS = 5;
    readonly BALL_SPEED = 300;

    private app: PIXI.Application;
    private ball: PIXI.Graphics;
    private players: PIXI.Graphics[];

    private scoreText: PIXI.Text;
    private playerText: PIXI.Text;
    private connectedRect: PIXI.Graphics;

    // protected scores: number[];
    protected active: boolean = false;
    protected lastUpdate: number = 0;
    protected ballAnimation: any = null;

    constructor(app: PIXI.Application) {
        this.app = app;
        sound.add('slap', 'assets/slap.mp3')

        const [pw, ph] = [this.PADDLE_WIDTH, this.PADDLE_HEIGHT];
        this.players = [];
        for (let i = 0; i < 2; i++) {
            this.players[i] = new PIXI.Graphics();
            this.players[i].beginFill(0xffffff);
            this.players[i].drawRect(0, 0, pw, ph);
            this.players[i].endFill();
            app.stage.addChild(this.players[i]);
        }
        this.players[0].x = pw;
        this.players[1].x = this.BOARD_WIDTH - (2 * pw);
        this.players[0].y = this.players[1].y = this.BOARD_VCENTER - (this.PADDLE_HEIGHT * 0.5);

        const ball = new PIXI.Graphics();
        ball.beginFill(0xffffff);
        ball.drawRect(
            0,
            0,
            this.BALL_RADIUS * 2,
            this.BALL_RADIUS * 2
        );
        ball.endFill();
        ball.x = this.BOARD_HCENTER - this.BALL_RADIUS;
        ball.y = this.BOARD_VCENTER - this.BALL_RADIUS;
        this.ball = ball;

        app.stage.addChild(this.ball);

        this.connectedRect = new PIXI.Graphics();
        this.connectedRect.beginFill(0xff0000);
        this.connectedRect.drawRect(5, 5, 2, 2);
        this.connectedRect.endFill();
        app.stage.addChild(this.connectedRect);

        this.playerText = new PIXI.Text(``, {
            fill: 'white', fontSize: 24,
        });
        this.playerText.scale = { x: .5, y: .5 };
        this.playerText.x = 20;
        this.playerText.y = 2;
        app.stage.addChild(this.playerText);

        this.scoreText = new PIXI.Text(`0 - 0`, {
            fill: 'red',
            fontSize: 24
        });
        this.scoreText.scale = { x: .5, y: .5 };
        this.scoreText.x = app.stage.width / 2 - 5;
        this.scoreText.y = 44;
        app.stage.addChild(this.scoreText);

        // this.addEventListener('collide', (event: any) => {
        //     const { detail } = event;
        //     this.onPaddleCollision(detail.player);
        // });
    }

    public setBall(x: number, y: number, vx: number, vy: number): void {
        this.ball.x = x;
        this.ball.y = y;

        const dt = 10000; // should be long enough to reach out of the screen
        const tx = this.ball.x + vx * dt;
        const ty = this.ball.y + vy * dt;
        if (this.ballAnimation) {
            this.ballAnimation.kill();
        }
        this.ballAnimation = gsap.to(this.ball, { x: tx, y: ty, duration: dt, ease: 'linear' })
    }

    public setPlayer(index: number, y: number, vy: number): void {
        this.players[index].y = y;
    }

    public popupText(app: PIXI.Application, txt: string): void {
        const text = new PIXI.Text(txt, {
            fontFamily: 'Roboto',
            fill: 'white',
            fontSize: 32,
        });

        // Set the initial position and visibility of the text
        text.position.set(app.screen.width / 2, app.screen.height / 2);
        text.anchor.set(0.5);
        text.x = app.screen.width / 3;
        text.y = app.screen.height / 4;
        text.visible = false;

        // Add the text to the stage
        app.stage.addChild(text);

        // Function to animate the text
        function animateText() {
            text.visible = true;
            text.scale = { x: .5, y: .5 };
            gsap.to(text.scale, {
                x: .8,
                y: .8,
                duration: 0.5,
                ease: 'power1.inOut',
                onComplete: () => {
                    app.stage.removeChild(text);
                }
            });
        }
        // Start the animation
        animateText();
    }

    public setHudText(app: PIXI.Application, connected: boolean, playerNumber: number, score: string): void {
        this.connectedRect.clear();
        this.connectedRect.beginFill(connected ? 0x00ff00 : 0xff0000);
        this.connectedRect.drawRect(5, 5, 2, 2);
        this.connectedRect.endFill();
        if (connected && playerNumber) {
            this.playerText.text = `Player ${playerNumber}`;
        } else {
            this.playerText.text = `----- `
        }
        if (score) {
            this.scoreText.text = `${score.replace(',', ' - ')}`;
        }
    }

    // private onPaddleCollision(player: any): void {
    //     //first move the paddle a bit
    //     sound.play('slap');
    //     // const idleAnimation = gsap.to(this.playerPaddleGraphics, {
    //     //     rotation: (Math.random() < 0.5 ? -1 : 1) * .05,
    //     //     duration: .25,
    //     //     repeat: 1, // -1 means repeat indefinitely
    //     //     yoyo: true, // Makes the animation reverse back and forth
    //     //     ease: 'power2.inOut' // Easing function for smooth animation
    //     // });
    //     //now shoot some particles
    //     const particleGraphics = new PIXI.Graphics();
    //     particleGraphics.beginFill(0xFFFFFF); // Set the fill color of the rectangle
    //     particleGraphics.drawRect(0, 0, 8, 8); // Set the size of the rectangle
    //     particleGraphics.endFill();

    //     // Create a texture from the graphics object
    //     const particleTexture = this.app.renderer.generateTexture(particleGraphics);
    //     const emitterConfiguration = {
    //         emit: true,
    //         destroyWhenComplete: true,
    //         autoUpdate: true,
    //         lifetime: {
    //             min: 0.5,
    //             max: 0.5
    //         },
    //         frequency: 0.08,
    //         spawnChance: 1,
    //         particlesPerWave: 1,
    //         emitterLifetime: 0.5,
    //         maxParticles: 5,
    //         pos: {
    //             x: this.playerPaddleGraphics.position.x,
    //             y: this.playerPaddleGraphics.position.y
    //         },
    //         addAtBack: false,
    //         behaviors: [
    //             {
    //                 type: 'alpha',
    //                 config: {
    //                     alpha: {
    //                         list: [
    //                             {
    //                                 value: 0.8,
    //                                 time: 0
    //                             },
    //                             {
    //                                 value: 0.1,
    //                                 time: 1
    //                             }
    //                         ],
    //                     },
    //                 }
    //             },
    //             {
    //                 type: 'scale',
    //                 config: {
    //                     scale: {
    //                         list: [
    //                             {
    //                                 value: 1,
    //                                 time: 0
    //                             },
    //                             {
    //                                 value: 0.1,
    //                                 time: 1
    //                             }
    //                         ],
    //                     },
    //                 }
    //             },
    //             {
    //                 type: 'color',
    //                 config: {
    //                     color: {
    //                         list: [
    //                             {
    //                                 value: "FDF3F3",
    //                                 time: 0
    //                             },
    //                             {
    //                                 value: "FFFFFF",
    //                                 time: 1
    //                             }
    //                         ],
    //                     },
    //                 }
    //             },
    //             {
    //                 type: 'moveSpeed',
    //                 config: {
    //                     speed: {
    //                         list: [
    //                             {
    //                                 value: 400,
    //                                 time: 0
    //                             },
    //                             {
    //                                 value: 10,
    //                                 time: 1
    //                             }
    //                         ],
    //                         isStepped: false
    //                     },
    //                 }
    //             },
    //             {
    //                 type: 'rotationStatic',
    //                 config: {
    //                     min: -90,
    //                     max: 90
    //                 }
    //             },
    //             {
    //                 "type": "spawnPoint",
    //                 "config": {}
    //             },
    //             {
    //                 type: 'textureSingle',
    //                 config: {
    //                     texture: particleTexture
    //                 }
    //             }
    //         ],
    //     };

    //     // Create a sprite using the texture
    //     // const particleSprite = new PIXI.Sprite(particleTexture);

    //     var emitter = new particles.Emitter(this.app.stage, emitterConfiguration);

    //     // Calculate the current time
    //     var elapsed = Date.now();

    //     // Update function every frame
    //     const _app = this.app;

    //     var update = function () {
    //         // Update the next frame
    //         requestAnimationFrame(update);

    //         var now = Date.now();

    //         // The emitter requires the elapsed
    //         // number of seconds since the last update
    //         emitter.update((now - elapsed) * 0.001);
    //         elapsed = now;

    //         // Should re-render the PIXI Stage
    //         _app.renderer.render(_app.stage);
    //     };
    //     emitter.emit = true;
    //     emitter.update(elapsed);
    //     console.log(this.playerPaddleGraphics.rotation);
    // }

    public update() {
        this.app.ticker.update();
        window.requestAnimationFrame(this.update.bind(this));
    }
    public start() {
        this.app.ticker.start();
        requestAnimationFrame(this.update.bind(this));
    }

    public stop() {
        this.app.ticker.stop();
    }
}