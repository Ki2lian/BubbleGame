export const GAME_CONFIG = (() => {
    const ASPECT_RATIO = 4 / 3;

    const WINDOW_WIDTH = window.innerWidth;
    const WINDOW_HEIGHT = window.innerHeight;

    let WIDTH = WINDOW_WIDTH * 0.9;
    let HEIGHT = WIDTH / ASPECT_RATIO;

    if (HEIGHT > WINDOW_HEIGHT * 0.75) {
        HEIGHT = WINDOW_HEIGHT * 0.75;
        WIDTH = HEIGHT * ASPECT_RATIO;
    }

    WIDTH = Math.max(320, Math.min(WIDTH, 1200));
    HEIGHT = Math.max(240, Math.min(HEIGHT, 900));

    const CENTER_X = WIDTH / 2;
    const CENTER_Y = HEIGHT / 2;
    const TOTAL_AREA = WIDTH * HEIGHT;

    const INITIAL_TIME = 100;
    const MIN_TIME = 50;
    const INITIAL_BALLS = 20;
    const INITIAL_LIVES = 3;
    const MAX_LIVES = 10;
    const LEVEL_UP_COVERAGE = 0.66;

    const MOVEMENT_LERP_FACTOR = 12;

    const USER_BALL_GROWTH_RATE = 0.7;
    const USER_BALL_GROWTH_MAX_COVERAGE = 0.45;
    const USER_BALL_TEXTURE = "userBall";

    const MIN_RADIUS = 4;
    const MAX_RADIUS = 10;
    const TARGET_WIDTH_FOR_MAX = 800;

    const ENEMY_BALL_MIN_SPAWN = 2;
    const ENEMY_BALL_RADIUS =
        WIDTH >= TARGET_WIDTH_FOR_MAX ? MAX_RADIUS : Number((MIN_RADIUS + ((WIDTH - 320) / (1200 - 320)) * (MAX_RADIUS - MIN_RADIUS)).toFixed(2));
    const ENEMY_BALL_SPEED = 5;
    const ENEMY_BALL_SPEED_TOLERANCE = 0.1;
    const ENEMY_BALL_TEXTURE = "enemyBall";
    const ENEMY_NORMALIZE_INTERVAL = 5;

    const ENEMY_SPAWN_MARGIN = ENEMY_BALL_RADIUS * 3;
    const ENEMY_SPAWN_MIN = ENEMY_SPAWN_MARGIN;
    const ENEMY_SPAWN_MAX_X = WIDTH - ENEMY_SPAWN_MARGIN;
    const ENEMY_SPAWN_MAX_Y = HEIGHT - ENEMY_SPAWN_MARGIN;

    const ENEMY_ENEMY_COLLISION_MAX = 5;
    const USER_ENEMY_COLLISION_MAX = 10;
    const LAST_COLLISION_TIME_MAX = 250;

    const BACKGROUND_MUSIC_VOLUME = 0.5;
    const SOUND_FADING_TIME = 250;

    const FONT_SIZE_TITLE = Math.floor(WIDTH / 16);
    const FONT_SIZE_BUTTON = Math.floor(WIDTH / 32);
    const FONT_SIZE_TEXT = Math.floor(WIDTH / 48);
    const FONT_SIZE_HUD = Math.floor(WIDTH / 64);

    return {
        WIDTH,
        HEIGHT,
        CENTER_X,
        CENTER_Y,
        TOTAL_AREA,
        INITIAL_TIME,
        MIN_TIME,
        INITIAL_LIVES,
        INITIAL_BALLS,
        MAX_LIVES,
        LEVEL_UP_COVERAGE,
        MOVEMENT_LERP_FACTOR,
        USER_BALL_GROWTH_RATE,
        USER_BALL_GROWTH_MAX_COVERAGE,
        USER_BALL_TEXTURE,
        ENEMY_BALL_MIN_SPAWN,
        ENEMY_BALL_RADIUS,
        ENEMY_BALL_SPEED,
        ENEMY_BALL_SPEED_TOLERANCE,
        ENEMY_BALL_TEXTURE,
        ENEMY_NORMALIZE_INTERVAL,
        ENEMY_SPAWN_MARGIN,
        ENEMY_SPAWN_MIN,
        ENEMY_SPAWN_MAX_X,
        ENEMY_SPAWN_MAX_Y,
        ENEMY_ENEMY_COLLISION_MAX,
        USER_ENEMY_COLLISION_MAX,
        LAST_COLLISION_TIME_MAX,
        BACKGROUND_MUSIC_VOLUME,
        SOUND_FADING_TIME,
        FONT_SIZE_TITLE,
        FONT_SIZE_BUTTON,
        FONT_SIZE_TEXT,
        FONT_SIZE_HUD,
    } as const;
})();
