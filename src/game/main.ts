import { AUTO, Game, Types } from "phaser";

import { GAME_CONFIG } from "@/config/constants";
import { Boot } from "@/game/scenes/Boot";
import { Game as MainGame } from "@/game/scenes/Game";
import { GameOver } from "@/game/scenes/GameOver";
import { MainMenu } from "@/game/scenes/MainMenu";
import { Preloader } from "@/game/scenes/Preloader";

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    parent: "game-container",
    backgroundColor: "#1a1a1a",
    physics: {
        default: "matter",
        matter: {
            gravity: { y: 0.6, x: 0 },
            debug: false,
            enableSleeping: true,
        },
    },
    scene: [ Boot, Preloader, MainMenu, MainGame, GameOver ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
