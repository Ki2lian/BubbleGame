import { GameObjects, Input, Math as PhaserMath, Physics, Scene, Types } from "phaser";

import { GAME_CONFIG } from "@/config/constants";
import { GameManager } from "@/game/GameManager";
import { useGame } from "@/store/useGame";
import { IEnemyBall, IUserBall, TBaseSound } from "@/types/game";

export class BallManager {
    private scene: Scene;
    private gameManager: GameManager;
    private growing = false;
    private currentBall?: GameObjects.Arc;
    private userBalls: IUserBall[] = [];
    private enemyBalls: IEnemyBall[] = [];
    private emitter!: GameObjects.Particles.ParticleEmitter;
    private frameCounter = 0;
    private previousCoverage: number = 0;
    private growSound!: TBaseSound;
    private explosionSound!: TBaseSound;
    private levelUpSound!: TBaseSound;

    constructor(scene: Scene, gameManager: GameManager) {
        this.scene = scene;
        this.gameManager = gameManager;
    }

    setupBackground() {
        this.scene.add.image(GAME_CONFIG.CENTER_X, GAME_CONFIG.CENTER_Y, "background");
        this.emitter = this.scene.add.particles(0, 0, "particle", {
            speed: { min: 50, max: 100 },
            lifespan: 500,
            quantity: 50,
            scale: { start: 1, end: 0 },
            tint: 0x00f2ff,
            blendMode: "ADD",
            emitting: false,
        });
        this.setupCollisionHandler();

        const sounds = this.scene.registry.get("sounds");
        this.growSound = sounds.grow;
        this.explosionSound = sounds.explosion;
        this.levelUpSound = sounds.levelUp;
    }

    createInitialEnemyBalls(count: number) {
        this.createEnemyBalls(count);
    }

    handlePointerDown(pointer: Input.Pointer) {
        const { remainingBalls } = useGame.getState();
        if (this.gameManager.getIsPaused() || remainingBalls <= 0 || this.growing) return;

        this.playGrowSound();

        this.growing = true;
        this.currentBall = this.scene.add.circle(pointer.x, pointer.y, 5, 0x00f2ff).setStrokeStyle(2, 0x00ffff);
    }

    handlePointerUp() {
        if (this.growing && this.currentBall) {
            this.validateBall();
        }
    }

    update() {
        if (this.growing && this.currentBall) {
            this.growBall();
        }
        this.updateEnemyBalls();
    }

    private setupCollisionHandler() {
        this.scene.matter.world.on("collisionstart", (event: MatterJS.IEventCollision<MatterJS.BodyType>) => {
            const pairs = event.pairs;
            const now = this.scene.time.now;
            for (const pair of pairs) {
                const bodyA = pair.bodyA as IEnemyBall | IUserBall;
                const bodyB = pair.bodyB as IEnemyBall | IUserBall;

                if (this.isEnemyUserCollision(bodyA, bodyB)) {
                    const [ enemy, user ] = this.getEnemyUserPair(bodyA, bodyB);
                    this.handleEnemyUserCollision(enemy, user, now);
                }

                if (this.isEnemyEnemyCollision(bodyA, bodyB)) {
                    this.handleEnemyEnemyCollision(bodyA as IEnemyBall, bodyB as IEnemyBall, now);
                }
            }
        });
    }

    private isEnemyUserCollision(bodyA: IEnemyBall | IUserBall, bodyB: IEnemyBall | IUserBall): boolean {
        return (
            (this.enemyBalls.includes(bodyA as IEnemyBall) && this.userBalls.includes(bodyB as IUserBall)) ||
            (this.userBalls.includes(bodyA as IUserBall) && this.enemyBalls.includes(bodyB as IEnemyBall))
        );
    }

    private getEnemyUserPair(bodyA: IEnemyBall | IUserBall, bodyB: IEnemyBall | IUserBall): [IEnemyBall, IUserBall] {
        return this.enemyBalls.includes(bodyA as IEnemyBall) ? [ bodyA as IEnemyBall, bodyB as IUserBall ] : [ bodyB as IEnemyBall, bodyA as IUserBall ];
    }

    private isEnemyEnemyCollision(bodyA: IEnemyBall | IUserBall, bodyB: IEnemyBall | IUserBall): boolean {
        return this.enemyBalls.includes(bodyA as IEnemyBall) && this.enemyBalls.includes(bodyB as IEnemyBall);
    }

    private handleEnemyUserCollision(enemy: IEnemyBall, user: IUserBall, now: number) {
        enemy.userCollisionCount = (enemy.userCollisionCount || 0) + 1;
        enemy.lastCollisionTime = now;
        const dx = user.position.x - enemy.position.x;
        const dy = user.position.y - enemy.position.y;
        const angle = Math.atan2(dy, dx);
        this.scene.matter.body.setVelocity(enemy, {
            x: GAME_CONFIG.ENEMY_BALL_SPEED * Math.cos(angle),
            y: GAME_CONFIG.ENEMY_BALL_SPEED * Math.sin(angle),
        });
    }

    private handleEnemyEnemyCollision(enemy1: IEnemyBall, enemy2: IEnemyBall, now: number) {
        enemy1.enemyCollisionCount = (enemy1.enemyCollisionCount || 0) + 1;
        enemy2.enemyCollisionCount = (enemy2.enemyCollisionCount || 0) + 1;
        enemy1.lastCollisionTime = now;
        enemy2.lastCollisionTime = now;
    }

    private createEnemyBalls(count: number) {
        for (let i = 0; i < count; i++) {
            const x = PhaserMath.Between(GAME_CONFIG.ENEMY_SPAWN_MIN, GAME_CONFIG.ENEMY_SPAWN_MAX_X);
            const y = PhaserMath.Between(GAME_CONFIG.ENEMY_SPAWN_MIN, GAME_CONFIG.ENEMY_SPAWN_MAX_Y);
            const angle = PhaserMath.Between(0, 360);

            const enemyBallImage = this.scene.matter.add.image(x, y, GAME_CONFIG.ENEMY_BALL_TEXTURE, undefined, {
                shape: { type: "circle", radius: GAME_CONFIG.ENEMY_BALL_RADIUS },
                restitution: 1,
                friction: 0,
                frictionAir: 0,
                mass: 0.0001,
                isStatic: false,
                ignoreGravity: true,
            }) as Physics.Matter.Image & { body: IEnemyBall };

            enemyBallImage.body.id = i;
            enemyBallImage.body.userCollisionCount = 0;
            enemyBallImage.body.enemyCollisionCount = 0;
            enemyBallImage.body.lastCollisionTime = 0;

            this.scene.matter.body.setVelocity(enemyBallImage.body, {
                x: GAME_CONFIG.ENEMY_BALL_SPEED * Math.cos(PhaserMath.DegToRad(angle)),
                y: GAME_CONFIG.ENEMY_BALL_SPEED * Math.sin(PhaserMath.DegToRad(angle)),
            });

            enemyBallImage.setOrigin(0.5, 0.5);
            this.enemyBalls.push(enemyBallImage.body);
        }
    }

    private growBall() {
        if (!this.currentBall) return;

        const newRadius = this.currentBall.radius + GAME_CONFIG.USER_BALL_GROWTH_RATE;
        const { x: currentX, y: currentY } = this.currentBall;

        let newX = currentX + (this.scene.input.activePointer.x - currentX) / GAME_CONFIG.MOVEMENT_LERP_FACTOR;
        let newY = currentY + (this.scene.input.activePointer.y - currentY) / GAME_CONFIG.MOVEMENT_LERP_FACTOR;

        newX = PhaserMath.Clamp(newX, newRadius, GAME_CONFIG.WIDTH - newRadius);
        newY = PhaserMath.Clamp(newY, newRadius, GAME_CONFIG.HEIGHT - newRadius);

        this.updateBallPosition(newX, newY);

        const coveredArea = Math.PI * newRadius * newRadius;
        const coverage = coveredArea / GAME_CONFIG.TOTAL_AREA;

        if (coverage >= GAME_CONFIG.USER_BALL_GROWTH_MAX_COVERAGE) {
            setTimeout(() => this.validateBall(), 1);
            return;
        }

        for (const userBall of this.userBalls) {
            const dx = userBall.position.x - currentX;
            const dy = userBall.position.y - currentY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < userBall.circleRadius + newRadius) {
                this.validateBall();
                return;
            }
        }

        const { setGameState, lives, remainingBalls } = useGame.getState();

        for (const enemyBall of this.enemyBalls) {
            const dx = enemyBall.position.x - newX;
            const dy = enemyBall.position.y - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < enemyBall.circleRadius + newRadius) {
                const explosionRadius = newRadius * 0.8;
                this.emitter.setPosition(newX, newY);

                const source = {
                    getRandomPoint: (point: Types.Math.Vector2Like) => {
                        const angle = PhaserMath.FloatBetween(0, Math.PI * 2);
                        const radius = PhaserMath.FloatBetween(0, explosionRadius);
                        point.x = Math.cos(angle) * radius;
                        point.y = Math.sin(angle) * radius;
                        return point;
                    },
                };

                this.emitter.setEmitZone(new GameObjects.Particles.Zones.RandomZone(source));

                const speed = 100;
                const lifespan = Math.floor((explosionRadius / speed) * 800);

                this.emitter.speedX = { min: speed * 0.5, max: speed };
                this.emitter.speedY = { min: speed * 0.5, max: speed };
                this.emitter.lifespan = lifespan;

                this.emitter.explode();

                this.currentBall.destroy();
                this.currentBall = undefined;
                this.growing = false;

                this.stopGrowSound();
                this.explosionSound.play();

                setGameState({
                    lives: lives - 1,
                    remainingBalls: remainingBalls - 1,
                });
                if (lives - 1 <= 0) {
                    this.cleanup();
                    this.scene.scene.start("GameOver");
                }
                return;
            }
        }

        this.currentBall.setRadius(newRadius);
    }

    private updateBallPosition(x: number, y: number) {
        if (this.currentBall) {
            this.currentBall.x = x;
            this.currentBall.y = y;
        }
    }

    private validateBall() {
        if (!this.currentBall) return;

        const { remainingBalls, setGameState, level, score, timeLeft, lives } = useGame.getState();
        const newRadius = this.currentBall.radius + GAME_CONFIG.USER_BALL_GROWTH_RATE;

        const graphics = this.scene.add.graphics().fillStyle(0x00f2ff, 1).fillCircle(newRadius, newRadius, newRadius);
        graphics.generateTexture(`${ GAME_CONFIG.USER_BALL_TEXTURE }${ remainingBalls }`, newRadius * 2, newRadius * 2);
        graphics.destroy();

        const x = this.currentBall.x;
        const y = this.currentBall.y;

        const userBallImage = this.scene.matter.add.image(x, y, `${ GAME_CONFIG.USER_BALL_TEXTURE }${ remainingBalls }`, undefined, {
            shape: { type: "circle", radius: newRadius },
            restitution: 0.8,
            friction: 0,
            mass: 10,
            isStatic: false,
        }) as Physics.Matter.Image & { body: IUserBall };

        userBallImage.setOrigin(0.5, 0.5);
        userBallImage.body.radius = newRadius;
        userBallImage.body.id = remainingBalls;

        this.userBalls.push(userBallImage.body);

        const coverage = this.calculateCoverage();
        const coveragePercent = Math.floor(coverage * 100);
        const coverageDelta = coveragePercent - Math.floor(this.previousCoverage * 100);
        this.previousCoverage = coverage;

        const currentRemainingBalls = remainingBalls - 1;

        setGameState({
            remainingBalls: currentRemainingBalls,
            score: score + coverageDelta,
            coverage,
        });

        this.stopGrowSound();

        this.currentBall.destroy();
        this.currentBall = undefined;
        this.growing = false;

        if (coverage >= GAME_CONFIG.LEVEL_UP_COVERAGE) {
            this.nextLevel(level, score, timeLeft, lives);
            this.levelUpSound.play();
            return;
        }

        if (currentRemainingBalls <= 0) {
            this.cleanup();
            this.scene.scene.start("GameOver");
        }
    }

    private calculateCoverage(): number {
        const coveredArea = this.userBalls.reduce((sum, ball) => sum + Math.PI * ball.radius * ball.radius, 0);
        return coveredArea / GAME_CONFIG.TOTAL_AREA;
    }

    private nextLevel(level: number, score: number, timeLeft: number, lives: number) {
        const { setGameState } = useGame.getState();
        const newTimeLeft = Math.max(GAME_CONFIG.MIN_TIME, GAME_CONFIG.INITIAL_TIME - (level + 1));

        this.cleanup();

        setGameState({
            level: level + 1,
            score: score + timeLeft,
            lives: Math.min(lives + 1, GAME_CONFIG.MAX_LIVES),
            remainingBalls: GAME_CONFIG.INITIAL_BALLS,
            timeLeft: newTimeLeft,
            coverage: 0,
        });
        this.createEnemyBalls(level + GAME_CONFIG.ENEMY_BALL_MIN_SPAWN);
        this.gameManager.resetTimer(newTimeLeft);
    }

    private updateEnemyBalls() {
        this.frameCounter++;
        if (this.frameCounter >= GAME_CONFIG.ENEMY_NORMALIZE_INTERVAL) {
            const now = this.scene.time.now;

            for (const enemyBall of this.enemyBalls) {
                const { x, y } = enemyBall.velocity;
                const currentSpeed = Math.sqrt(x * x + y * y);
                const timeSinceLastCollision = now - (enemyBall.lastCollisionTime || 0);

                if (
                    enemyBall.userCollisionCount &&
                    enemyBall.userCollisionCount > GAME_CONFIG.USER_ENEMY_COLLISION_MAX &&
                    timeSinceLastCollision < GAME_CONFIG.LAST_COLLISION_TIME_MAX
                ) {
                    enemyBall.isStuck = true;
                } else if (
                    enemyBall.enemyCollisionCount &&
                    enemyBall.enemyCollisionCount > GAME_CONFIG.ENEMY_ENEMY_COLLISION_MAX &&
                    timeSinceLastCollision < GAME_CONFIG.LAST_COLLISION_TIME_MAX
                ) {
                    enemyBall.isStuck = true;
                } else {
                    enemyBall.isStuck = false;
                }

                if (timeSinceLastCollision > GAME_CONFIG.LAST_COLLISION_TIME_MAX + 50) {
                    enemyBall.userCollisionCount = 0;
                    enemyBall.enemyCollisionCount = 0;
                }

                if (enemyBall.isStuck) {
                    this.scene.matter.body.setVelocity(enemyBall, { x: 0, y: 0 });
                } else if (Math.abs(currentSpeed - GAME_CONFIG.ENEMY_BALL_SPEED) > GAME_CONFIG.ENEMY_BALL_SPEED_TOLERANCE) {
                    const angle = Math.atan2(y, x);
                    this.scene.matter.body.setVelocity(enemyBall, {
                        x: GAME_CONFIG.ENEMY_BALL_SPEED * Math.cos(angle),
                        y: GAME_CONFIG.ENEMY_BALL_SPEED * Math.sin(angle),
                    });
                }

                const { x: posX, y: posY } = enemyBall.position;
                const { x: vx, y: vy } = enemyBall.velocity;

                if (posX - GAME_CONFIG.ENEMY_BALL_RADIUS < 0) {
                    this.scene.matter.body.setVelocity(enemyBall, { x: Math.abs(vx), y: vy });
                    this.scene.matter.body.setPosition(enemyBall, { x: GAME_CONFIG.ENEMY_BALL_RADIUS, y: posY });
                } else if (posX + GAME_CONFIG.ENEMY_BALL_RADIUS > GAME_CONFIG.WIDTH) {
                    this.scene.matter.body.setVelocity(enemyBall, { x: -Math.abs(vx), y: vy });
                    this.scene.matter.body.setPosition(enemyBall, { x: GAME_CONFIG.WIDTH - GAME_CONFIG.ENEMY_BALL_RADIUS, y: posY });
                }

                if (posY - GAME_CONFIG.ENEMY_BALL_RADIUS < 0) {
                    this.scene.matter.body.setVelocity(enemyBall, { x: vx, y: Math.abs(vy) });
                    this.scene.matter.body.setPosition(enemyBall, { x: posX, y: GAME_CONFIG.ENEMY_BALL_RADIUS });
                } else if (posY + GAME_CONFIG.ENEMY_BALL_RADIUS > GAME_CONFIG.HEIGHT) {
                    this.scene.matter.body.setVelocity(enemyBall, { x: vx, y: -Math.abs(vy) });
                    this.scene.matter.body.setPosition(enemyBall, { x: posX, y: GAME_CONFIG.HEIGHT - GAME_CONFIG.ENEMY_BALL_RADIUS });
                }
            }
            this.frameCounter = 0;
        }
    }

    cleanup() {
        for (const ball of this.userBalls) {
            const sprite = ball.gameObject as Physics.Matter.Image;
            sprite?.destroy();
        }
        const textureKeys = Object.keys(this.scene.textures.list).filter(key => key.includes(GAME_CONFIG.USER_BALL_TEXTURE));
        for (const key of textureKeys) {
            this.scene.textures.remove(key);
        }
        this.userBalls = [];

        for (const ball of this.enemyBalls) {
            const sprite = ball.gameObject as Physics.Matter.Image;
            sprite?.destroy();
        }
        this.enemyBalls = [];

        this.previousCoverage = 0;

        this.growSound.stop();
        this.growSound.volume = 0;
    }

    private playGrowSound() {
        this.scene.tweens.killTweensOf(this.growSound);

        this.growSound.volume = 0;
        this.growSound.play();
        this.scene.tweens.add({
            targets: this.growSound,
            volume: 1,
            duration: GAME_CONFIG.SOUND_FADING_TIME,
        });
    }

    private stopGrowSound() {
        this.scene.tweens.killTweensOf(this.growSound);
        this.scene.tweens.add({
            targets: this.growSound,
            volume: 0,
            duration: GAME_CONFIG.SOUND_FADING_TIME,
            onComplete: () => this.growSound.stop(),
        });
    }
}
