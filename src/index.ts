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

socket.on('player', number => {
    playerNumber = number;
    console.log(`You are Player ${playerNumber}`);
});

socket.on('start', () => {
    console.log('Game started!');
});

// socket.on('message', message => {
//     console.log(message);
// });

// socket.on('gameState', gameState => {
//     // console.log("Updating game state")
//     // updateGame(gameState);
// });

//handle keyboard
// const keys: { [key: string]: boolean } = {};

function onKeyDown(event: KeyboardEvent) {
    // keys[event.code] = true;
    if (event.code === "ArrowUp") {
        socket.emit("move", { v: -1 });
    } else if (event.code === "ArrowDown") {
        socket.emit("move", { v: 1 });
    }
}
function onKeyUp(event: KeyboardEvent) {
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        socket.emit('move', { v: 0 });
    }
}

// Attach event listeners
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// app.ticker.add(() => {
//     // Access the keyboard state
//     // keys['KeyA'] will be true if 'A' key is currently pressed
//     // keys['KeyB'] will be true if 'B' key is currently pressed
//     // Add your logic here based on the key state  
//     Object.keys(keys).forEach(k => {
//         console.log(keys[k]);
//     });

//     if (keys.ArrowUp) {
//         console.log({ keys })
//         if (game.playerPaddleGraphics.position.y - 3 > 0) {
//             socket.emit('paddleMovement', { y: game.playerPaddleGraphics.position.y - 3 });
//         }
//     }
//     if (keys.ArrowDown) {
//         console.log({ keys })
//         if (game.playerPaddleGraphics.position.y + 3 < 400) {
//             socket.emit('paddleMovement', { y: game.playerPaddleGraphics.position.y + 3 });
//         }
//     }
// });





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

