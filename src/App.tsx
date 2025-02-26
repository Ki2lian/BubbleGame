import "./style.css";

import { Scene } from "phaser";
import { FC, useRef, useState } from "react";

import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";
import { Game } from "@/game/scenes/Game";
import { useGame } from "@/store/useGame";

const App: FC = () => {
    const { score, level, lives, remainingBalls, timeLeft, coverage } = useGame();

    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [ isPaused, setIsPaused ] = useState(false);

    const handlePausePlay = () => {
        const gameScene = phaserRef.current?.scene;
        if (gameScene && gameScene.scene.key === "Game") {
            (gameScene as Game).togglePause();
            setIsPaused(!isPaused);
        }
    };

    const handleReset = () => {
        const gameScene = phaserRef.current?.scene;
        if (gameScene && gameScene.scene.key === "Game") {
            (gameScene as Game).reset();
            if (isPaused) {
                handlePausePlay();
            }
        }
    };

    const currentActiveScene = (scene: Scene) => {
        if (scene.scene.key !== "Game") {
            setIsPaused(false);
        }
    };

    return (
        <div id="app">
            <div className="flex flex-col items-center justify-center space-y-2 select-none">
                <div className="flex flex-col sm:flex-row w-full bg-gray-800 p-4 rounded-sm items-center space-x-5 space-y-5 sm:space-y-0">
                    <div className="flex justify-between sm:justify-around w-full space-x-5 sm:space-x-0">
                        <div className="flex flex-col text-xs sm:text-sm md:text-base w-full sm:w-1/3">
                            <div className="flex justify-between">
                                <span>Level:</span>
                                <span>{level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Score:</span>
                                <span>{score}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time:</span>
                                <span>{timeLeft}s</span>
                            </div>
                        </div>
                        <div className="flex flex-col text-xs sm:text-sm md:text-base w-full sm:w-1/3">
                            <div className="flex justify-between">
                                <span>Lives:</span>
                                <span>{lives}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Balls:</span>
                                <span>{remainingBalls}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coverage:</span>
                                <span>{Math.floor(coverage * 100)}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row sm:flex-col space-x-5 sm:space-x-0 sm:space-y-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded text-xs sm:text-sm md:text-base"
                            onClick={ handlePausePlay }
                        >
                            {isPaused ? "Play" : "Pause"}
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded text-xs sm:text-sm md:text-base"
                            onClick={ handleReset }
                        >
                            Reset
                        </button>
                    </div>
                </div>
                <PhaserGame ref={ phaserRef } currentActiveScene={ currentActiveScene } />
            </div>
        </div>
    );
};

export default App;
