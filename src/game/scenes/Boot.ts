import { Scene } from "phaser";

import { GAME_CONFIG } from "@/config/constants";


export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.add.graphics()
            .fillStyle(0x1e2d4d, 1)
            .fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
            .generateTexture("background", GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
            .destroy();
        this.add.image(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y, "background");
    }

    create() {
        this.scene.start("Preloader");
    }
}
