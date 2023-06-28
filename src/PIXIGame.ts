import Game, { GameMode } from './game';
import * as PIXI from 'pixi.js';
import gsap from "gsap";

export default class PIXIGame extends Game {
    private ballGraphics: PIXI.Graphics;
    private playerPaddleGraphics: PIXI.Graphics;
    private opponentPaddleGraphics: PIXI.Graphics;

    private scoreText: PIXI.Text;
    private playerText: PIXI.Text;
    private connectedRect: PIXI.Graphics;

    constructor(app: PIXI.Application) {
        super(GameMode.CLIENT);
        const [pw, ph] = [this.PADDLE_WIDTH, this.PADDLE_HEIGHT];
        this.playerPaddleGraphics = new PIXI.Graphics();
        this.playerPaddleGraphics.beginFill(0xffffff);
        this.playerPaddleGraphics.drawRect(0, -ph * 0.5, pw, ph);
        this.playerPaddleGraphics.endFill();
        this.playerPaddleGraphics.x = this.players[0].position.x;
        this.playerPaddleGraphics.y = this.players[0].position.y;
        app.stage.addChild(this.playerPaddleGraphics);

        this.opponentPaddleGraphics = new PIXI.Graphics();
        this.opponentPaddleGraphics.beginFill(0xffffff);
        this.opponentPaddleGraphics.drawRect(0, -ph * 0.5, pw, ph);
        this.opponentPaddleGraphics.endFill();
        this.opponentPaddleGraphics.x = this.players[1].position.x;
        this.opponentPaddleGraphics.y = this.players[1].position.y;
        app.stage.addChild(this.opponentPaddleGraphics);

        this.ballGraphics = new PIXI.Graphics();
        this.ballGraphics.beginFill(0xffffff);
        this.ballGraphics.drawRect(0, 0, 10, 10);
        this.ballGraphics.endFill();
        this.ballGraphics.x = this.ball.position.x;
        this.ballGraphics.y = this.ball.position.y;

        app.stage.addChild(this.playerPaddleGraphics, this.opponentPaddleGraphics, this.ballGraphics);

        this.connectedRect = new PIXI.Graphics();
        this.connectedRect.beginFill(0xff0000);
        this.connectedRect.drawRect(5, 5, 2, 2);
        this.connectedRect.endFill();
        app.stage.addChild(this.connectedRect);

        this.playerText = new PIXI.Text(``, {
            fill: 'white',
            fontSize: 24,
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

        // this.playerPaddleGraphics.pivot.set(this.playerPaddleGraphics.width / 2, this.playerPaddleGraphics.height / 2);
        // const idleAnimation = gsap.to(this.playerPaddleGraphics.scale, {
        //     x: 1.12,
        //     y: 1.4,
        //     duration: 1,
        //     repeat: -1, // -1 means repeat indefinitely
        //     yoyo: true, // Makes the animation reverse back and forth
        //     ease: 'power1.inOut' // Easing function for smooth animation
        // });
    }

    protected requestAnimationFrame(): void {
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    protected gameLoop(): void {
        super.gameLoop();

        this.playerPaddleGraphics.x = this.players[0].position.x;
        this.playerPaddleGraphics.y = this.players[0].position.y;

        this.opponentPaddleGraphics.x = this.players[1].position.x;
        this.opponentPaddleGraphics.y = this.players[1].position.y;

        this.ballGraphics.x = this.ball.position.x;
        this.ballGraphics.y = this.ball.position.y;
    }

    public popupText(app: PIXI.Application, txt: string): void {
        const text = new PIXI.Text(txt, {
            fontFamily: 'Tahoma',
            fill: 'red',
            fontSize: 64,
        });

        // Set the initial position and visibility of the text
        text.position.set(app.screen.width / 2, app.screen.height / 2);
        text.anchor.set(0.5);
        text.x = app.screen.width / 2;
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
        if (playerNumber) {
            this.playerText.text = `Player ${playerNumber}`;
        }
        if (score) {
            this.scoreText.text = `${score.replace(',', ' - ')}`;
        }
    }
}