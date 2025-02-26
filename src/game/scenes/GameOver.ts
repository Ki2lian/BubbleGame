import { GameObjects, Scene } from "phaser";

import { GAME_CONFIG } from "@/config/constants";
import { EventBus } from "@/game/EventBus";
import { useGame } from "@/store/useGame";

export class GameOver extends Scene {
    background: GameObjects.Image;
    gameOverText: GameObjects.Text;
    scoreText: GameObjects.Text;
    restartButton: GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create() {
        this.background = this.add.image(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y, "background");
        this.background.setAlpha(0.5);

        this.gameOverText = this.add
            .text(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y * (2.5 / 3), "GAME OVER", {
                fontFamily: '"Press Start 2P"',
                fontSize: GAME_CONFIG.FONT_SIZE_TITLE,
                color: "#fff",
            })
            .setOrigin(0.5);


        const { score } = useGame.getState();
        this.scoreText = this.add
            .text(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y * (3.5 / 3), `Score: ${ score }`, {
                fontFamily: '"Press Start 2P"',
                fontSize: GAME_CONFIG.FONT_SIZE_TEXT,
                color: "#e0e0e0",
            })
            .setOrigin(0.5);

        this.restartButton = this.add
            .text(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y * 1.5, "Restart", {
                fontFamily: '"Press Start 2P"',
                fontSize: GAME_CONFIG.FONT_SIZE_BUTTON,
                color: "#e0e0e0",
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(2, 2, "#000", 4);

        this.restartButton.on("pointerover", () => this.restartButton.setStyle({ color: "#ffffff" }));
        this.restartButton.on("pointerout", () => this.restartButton.setStyle({ color: "#e0e0e0" }));
        this.restartButton.on("pointerdown", () => this.scene.start("Game"));


        EventBus.emit("current-scene-ready", this);
    }
}
