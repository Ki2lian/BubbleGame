import "./style.css";

import { FC, useRef } from "react";

import { IRefPhaserGame, PhaserGame } from "@/game/PhaserGame";

const App: FC = () => {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <PhaserGame ref={ phaserRef } />
        </div>
    );
};

export default App;
