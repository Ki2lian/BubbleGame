import { Loader, Scene } from "phaser";

import { GAME_CONFIG } from "@/config/constants";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.add.image(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y, "background");

        const BAR_WIDTH = GAME_CONFIG.WIDTH * 0.8;
        const BAR_HEIGHT = 28;
        const BAR_X = GAME_CONFIG.CENTER_X - BAR_WIDTH / 2;
        const bar = this.add.rectangle(BAR_X, GAME_CONFIG.CENTER_Y, 1, BAR_HEIGHT, 0xffffff);

        this.load.on("progress", (progress: number) => {
            bar.width = 1 + (BAR_WIDTH - 1) * progress;
        });

        const loadingText = this.add
            .text(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y + 40, "Loading:", {
                fontFamily: '"Press Start 2P"',
                fontSize: GAME_CONFIG.FONT_SIZE_TEXT,
                color: "#ffffff",
            })
            .setOrigin(0.5);

        this.load.on("fileprogress", (file: Loader.File) => {
            loadingText.setText(`Loading: ${ file.url }`);
        });

        this.load.on("complete", () => {
            loadingText.setText("Loading complete!");
        });
    }

    preload() {
        this.load.setPath("assets/sounds");
        this.load.audio("background", "background.mp3");
        this.load.audio("explosion", "explosion.mp3");
        this.load.audio("level_up", "level_up.mp3");
        this.load.audio("grow", "grow.mp3");

        this.add
            .graphics()
            .fillStyle(0xff0000, 1)
            .fillCircle(GAME_CONFIG.ENEMY_BALL_RADIUS, GAME_CONFIG.ENEMY_BALL_RADIUS, GAME_CONFIG.ENEMY_BALL_RADIUS)
            .generateTexture(GAME_CONFIG.ENEMY_BALL_TEXTURE, GAME_CONFIG.ENEMY_BALL_RADIUS * 2, GAME_CONFIG.ENEMY_BALL_RADIUS * 2)
            .destroy();

        this.add.graphics().fillStyle(0xffffff, 1).fillCircle(8, 8, 8).generateTexture("particle", 16, 16).destroy();
    }

    create() {
        const backgroundMusic = this.sound.add("background", {
            loop: true,
            volume: GAME_CONFIG.BACKGROUND_MUSIC_VOLUME,
        });
        const explosionSound = this.sound.add("explosion", { volume: 1.5 });
        const levelUpSound = this.sound.add("level_up", { volume: 1 });
        const growSound = this.sound.add("grow", { volume: 0, loop: true });

        this.registry.set("sounds", {
            background: backgroundMusic,
            explosion: explosionSound,
            levelUp: levelUpSound,
            grow: growSound,
        });

        backgroundMusic.play();

        this.scene.start("MainMenu");
    }
}
