import { GameObjects, Scene } from "phaser";

import { GAME_CONFIG } from "@/config/constants";
import { EventBus } from "@/game/EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    startButton: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y, "background");

        this.title = this.add
            .text(GAME_CONFIG.CENTER_X, GAME_CONFIG.HEIGHT / 3, "Bubble Game", {
                fontFamily: '"Press Start 2P"',
                fontSize: GAME_CONFIG.FONT_SIZE_TITLE,
                color: "#fff",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.startButton = this.add
            .text(GAME_CONFIG.CENTER_X, GAME_CONFIG.HEIGHT / 1.7, "Start", {
                fontFamily: '"Press Start 2P"',
                fontSize: GAME_CONFIG.FONT_SIZE_BUTTON,
                color: "#e0e0e0",
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(0, 2, "#000000", 2);

        this.startButton.on("pointerover", () => this.startButton.setStyle({ color: "#ffffff" }));
        this.startButton.on("pointerout", () => this.startButton.setStyle({ color: "#e0e0e0" }));
        this.startButton.on("pointerdown", () => this.scene.start("Game"));

        EventBus.emit("current-scene-ready", this);
    }
}
