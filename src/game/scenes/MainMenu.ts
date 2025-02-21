import { GameObjects, Scene } from "phaser";

import { EventBus } from "@/game/EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    startButton: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(400, 300, "background");

        this.title = this.add
            .text(400, 200, "Bubble Game", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#00f2ff",
                stroke: "#00ffff",
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setShadow(0, 0, "#00ffff", 10);

        this.startButton = this.add
            .text(400, 350, "Start", {
                fontFamily: "Arial",
                fontSize: 32,
                color: "#ff00ff",
            })
            .setOrigin(0.5)
            .setInteractive()
            .setShadow(0, 0, "#ff00ff", 5);

        this.startButton.on("pointerover", () => this.startButton.setStyle({ color: "#ffffff" }));
        this.startButton.on("pointerout", () => this.startButton.setStyle({ color: "#ff00ff" }));
        this.startButton.on("pointerdown", () => this.scene.start("Game"));

        EventBus.emit("current-scene-ready", this);
    }
}
