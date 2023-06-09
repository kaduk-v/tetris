import './index.html';
import './index.scss';
import { Tetris } from "./tetris";

/**
 * TODO:
 *  - menu
 *  - pause/play UI
 *  - game over
 *  - top score
 *  - new shape notice
 *  - sound
 */

const game = new Tetris();

try {
    game
        .init()
        .play()
    ;
} catch (e) {
    console.log('------------------[ START ]----------------')
    console.log(e)
    console.log('------------------[  END ]-----------------')
}

