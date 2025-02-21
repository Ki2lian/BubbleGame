import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.add.image(400, 300, "background");

        this.add.rectangle(400, 300, 368, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(400 - 184, 300, 4, 28, 0xffffff);

        this.load.on("progress", (progress: number) => {
            bar.width = 4 + 360 * progress;
        });
    }

    preload() {
        this.load.setPath("assets");
    }

    create() {
        this.scene.start("MainMenu");
    }
}
