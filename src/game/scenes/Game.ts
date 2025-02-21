import { GameObjects, Scene } from "phaser";

import { EventBus } from "@/game/EventBus";

export class Game extends Scene {
    background: GameObjects.Image;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add.image(400, 300, "background");

        this.physics.world.setBounds(0, 0, 800, 600);

        EventBus.emit("current-scene-ready", this);
    }
}
