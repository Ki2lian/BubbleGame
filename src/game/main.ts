import { AUTO, Game, Types } from "phaser";

import { Boot } from "@/game/scenes/Boot";
import { Game as MainGame } from "@/game/scenes/Game";
import { GameOver } from "@/game/scenes/GameOver";
import { MainMenu } from "@/game/scenes/MainMenu";
import { Preloader } from "@/game/scenes/Preloader";

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#1a1a1a",
    physics: {
        default: "arcade",
        arcade: { debug: false },
    },
    scene: [ Boot, Preloader, MainMenu, MainGame, GameOver ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
