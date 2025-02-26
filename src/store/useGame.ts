import { create } from "zustand";

import { IGameState } from "@/types/game";

interface IGameStore extends IGameState {
    coverage: number;
    setGameState: (state: Partial<IGameStore>) => void;
  }

export const useGame = create<IGameStore>((set) => ({
    level: 1,
    lives: 3,
    remainingBalls: 20,
    timeLeft: 100,
    score: 0,
    coverage: 0,
    setGameState: (state) => set((prev) => ({ ...prev, ...state })),
}));