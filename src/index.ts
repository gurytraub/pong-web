import { Application, Loader, Texture, AnimatedSprite } from "pixi.js";
import * as PIXI from 'pixi.js';
import io from 'socket.io-client';
import "./style.css";
import PIXIGame from './PIXIGame';

const gameHeight = 400;
const gameWidth = 800;

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

let game: PIXIGame;
let playerNumber: number;

game = new PIXIGame(app);
game.start();

const socket = io('http://localhost:3000/');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnection', () => {
    console.log('Disconnected from server');
});

socket.on('player', p => {
    console.log('setting player info', { p });
    game.setPlayer(p.i, p.y, p.vy);
});

socket.on('ball', b => {
    console.log('setting ball info', { b });
    game.setBall(b.x, b.y, b.vx, b.vy);
});

socket.on('start', () => {
    console.log('Game started!');
});

let direction = 0;
function onKeyDown(event: KeyboardEvent) {
    if (event.code === "ArrowUp") {
        if (direction !== -1) {
            socket.emit("move", { v: -1 });
            direction = -1;
        }
    } else if (event.code === "ArrowDown") {
        if (direction !== 1) {
            socket.emit("move", { v: 1 });
            direction = 1;
        }
    }
}
function onKeyUp(event: KeyboardEvent) {
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        socket.emit('move', { v: 0 });
        direction = 0;
    }
}

// Attach event listeners
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    resizeCanvas();
};

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };
    resize();
    window.addEventListener("resize", resize);
}

