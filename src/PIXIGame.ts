import Game, { GameMode } from './game';
import * as PIXI from 'pixi.js';

export default class PIXIGame extends Game {
    private ballGraphics: PIXI.Graphics;
    private playerPaddleGraphics: PIXI.Graphics;
    private opponentPaddleGraphics: PIXI.Graphics;
    private wallTopGraphics: PIXI.Graphics;
    private wallBottomGraphics: PIXI.Graphics;

    constructor(app: PIXI.Application) {
        super(GameMode.CLIENT);

        this.wallTopGraphics = new PIXI.Graphics();
        this.wallTopGraphics.beginFill(0xff0000);
        this.wallTopGraphics.drawRect(this.wallTop.position.x, this.wallTop.position.y, 800, 5);
        this.wallTopGraphics.endFill();
        app.stage.addChild(this.wallTopGraphics);

        this.wallBottomGraphics = new PIXI.Graphics();
        this.wallBottomGraphics.lineStyle(1, 0xbbbbbb);
        this.wallBottomGraphics.beginFill(0x00ff00);
        this.wallBottomGraphics.drawRect(this.wallBottom.position.x, this.wallBottom.position.y, 800, 5);
        this.wallBottomGraphics.endFill();
        app.stage.addChild(this.wallBottomGraphics);

        this.playerPaddleGraphics = new PIXI.Graphics();
        this.playerPaddleGraphics.beginFill(0xffffff);
        this.playerPaddleGraphics.drawRect(0, 0, 10, 80);
        this.playerPaddleGraphics.endFill();
        this.playerPaddleGraphics.x = this.players[0].position.x;
        this.playerPaddleGraphics.y = this.players[0].position.y;
        app.stage.addChild(this.playerPaddleGraphics);

        this.opponentPaddleGraphics = new PIXI.Graphics();
        this.opponentPaddleGraphics.beginFill(0xffffff);
        this.opponentPaddleGraphics.drawRect(0, 0, 10, 80);
        this.opponentPaddleGraphics.endFill();
        this.opponentPaddleGraphics.x = this.players[1].position.x;
        this.opponentPaddleGraphics.y = this.players[1].position.y;
        app.stage.addChild(this.opponentPaddleGraphics);

        this.ballGraphics = new PIXI.Graphics();
        this.ballGraphics.beginFill(0xffffff);
        this.ballGraphics.drawCircle(0, 0, 6);
        this.ballGraphics.endFill();
        this.ballGraphics.x = this.ball.position.x;
        this.ballGraphics.y = this.ball.position.y;
        app.stage.addChild(this.wallTopGraphics, this.wallBottomGraphics, this.playerPaddleGraphics,
            this.opponentPaddleGraphics, this.ballGraphics);

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
}