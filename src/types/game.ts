import { Physics, Sound } from "phaser";
export interface IRedBall extends Physics.Arcade.Sprite {
    id: number;
}

export interface IUserBall extends MatterJS.BodyType {
    id: number;
    radius: number;
}

export interface IEnemyBall extends MatterJS.BodyType {
    id: number;
    lastPosition?: { x: number; y: number };
    isStuck?: boolean;
    userCollisionCount?: number;
    enemyCollisionCount?: number;
    lastCollisionTime?: number;
}

export interface IGameState {
    level: number;
    lives: number;
    remainingBalls: number;
    timeLeft: number;
    score: number;
}

export type TBaseSound = Sound.HTML5AudioSound | Sound.WebAudioSound | Sound.NoAudioSound;