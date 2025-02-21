import { GameObjects, Scene } from "phaser";

import { EventBus } from "@/game/EventBus";

export class GameOver extends Scene {
    background: GameObjects.Image;
    gameOverText: GameObjects.Text;
    restartButton: GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create() {
        this.background = this.add.image(400, 300, "background");
        this.background.setAlpha(0.5);

        this.gameOverText = this.add
            .text(400, 300, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ff00ff",
                stroke: "#ff00ff",
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setShadow(0, 0, "#ff00ff", 10);

        this.restartButton = this.add
            .text(400, 400, "Restart", {
                fontFamily: "Arial",
                fontSize: 32,
                color: "#00f2ff",
            })
            .setOrigin(0.5)
            .setInteractive()
            .setShadow(0, 0, "#00ffff", 5);

        this.restartButton.on("pointerover", () => this.restartButton.setStyle({ color: "#ffffff" }));
        this.restartButton.on("pointerout", () => this.restartButton.setStyle({ color: "#00f2ff" }));
        this.restartButton.on("pointerdown", () => this.scene.start("MainMenu"));


        EventBus.emit("current-scene-ready", this);
    }
}
