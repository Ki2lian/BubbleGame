import { Scene } from "phaser";

import { GameManager } from "@/game/GameManager";

export class Game extends Scene {
    private gameManager: GameManager;

    constructor() {
        super("Game");
        this.gameManager = new GameManager(this);
    }

    create() {
        this.gameManager.setup();
    }

    update() {
        this.gameManager.update();
    }

    togglePause() {
        this.gameManager.togglePause();
    }

    reset() {
        this.gameManager.reset();
    }
}
