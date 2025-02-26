import { Scene, Time } from "phaser";

import { GAME_CONFIG } from "@/config/constants";
import { BallManager } from "@/game/BallManager";
import { EventBus } from "@/game/EventBus";
import { useGame } from "@/store/useGame";
import { IGameState, TBaseSound } from "@/types/game";

export class GameManager {
    private scene: Scene;
    private timer: Time.TimerEvent;
    private gameState: IGameState;
    private ballManager: BallManager;
    private isPaused: boolean = false;
    private backgroundMusic!: TBaseSound;

    constructor(scene: Scene) {
        this.scene = scene;
        this.ballManager = new BallManager(scene, this);
    }

    setup() {
        this.scene.matter.world.setBounds(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        this.ballManager.setupBackground();
        this.ballManager.createInitialEnemyBalls(GAME_CONFIG.ENEMY_BALL_MIN_SPAWN);
        this.gameState = {
            level: 1,
            lives: GAME_CONFIG.INITIAL_LIVES,
            remainingBalls: GAME_CONFIG.INITIAL_BALLS,
            timeLeft: GAME_CONFIG.INITIAL_TIME,
            score: 0,
        };
        useGame.getState().setGameState(this.gameState);
        this.setupEventListeners();
        this.timer = this.setupTimer();

        const sounds = this.scene.registry.get("sounds");
        this.backgroundMusic = sounds.background;

        EventBus.emit("current-scene-ready", this.scene);
    }

    private setupTimer(): Time.TimerEvent {
        return this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.isPaused) {
                    this.gameState.timeLeft--;
                    useGame.getState().setGameState({ timeLeft: this.gameState.timeLeft });
                    if (this.gameState.timeLeft <= 0) {
                        this.scene.scene.start("GameOver");
                    }
                }
            },
            loop: true,
        });
    }

    private setupEventListeners() {
        this.scene.input.on("pointerdown", this.ballManager.handlePointerDown.bind(this.ballManager));
        this.scene.input.on("pointerup", this.ballManager.handlePointerUp.bind(this.ballManager));
    }

    update() {
        if (!this.isPaused) {
            this.ballManager.update();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.scene.tweens.killTweensOf(this.backgroundMusic);
        if (this.isPaused) {
            this.scene.matter.world.pause();
            this.scene.tweens.add({
                targets: this.backgroundMusic,
                volume: 0,
                duration: GAME_CONFIG.SOUND_FADING_TIME,
                onComplete: () => {
                    this.backgroundMusic.pause();
                    this.scene.matter.world.pause();
                },
            });
        } else {
            this.scene.matter.world.resume();
            this.backgroundMusic.resume();
            this.scene.tweens.add({
                targets: this.backgroundMusic,
                volume: GAME_CONFIG.BACKGROUND_MUSIC_VOLUME,
                duration: GAME_CONFIG.SOUND_FADING_TIME,
            });
        }
    }

    reset() {
        this.ballManager.cleanup();
        this.ballManager.createInitialEnemyBalls(GAME_CONFIG.ENEMY_BALL_MIN_SPAWN);
        this.gameState = {
            level: 1,
            lives: GAME_CONFIG.INITIAL_LIVES,
            remainingBalls: GAME_CONFIG.INITIAL_BALLS,
            timeLeft: GAME_CONFIG.INITIAL_TIME,
            score: 0,
        };
        useGame.getState().setGameState({
            ...this.gameState,
            coverage: 0,
        });
        this.resetTimer();
    }

    cleanup() {
        this.ballManager.cleanup();
        this.timer.remove();
    }

    public resetTimer(newTimeLeft: number = GAME_CONFIG.INITIAL_TIME) {
        this.gameState.timeLeft = newTimeLeft;
        this.timer.reset({
            delay: 1000,
            callback: this.timer.callback,
            loop: true,
        });
    }

    public getIsPaused(): boolean {
        return this.isPaused;
    }
}
