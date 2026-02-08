import { Container } from 'pixi.js'
import { MouseListener } from '../utils/MouseListener.ts'
import { StageEntityMixin } from '../core/Entity.ts'

/**
 * 
 */
export interface CursorOptions {
    /**
     * 
     */
    hideSystemCursor?: boolean
}

/**
 * 
 */
export class Cursor extends StageEntityMixin(Container) {
    /**
     * 
     */
    private listener

    constructor(options?: CursorOptions) {
        super()
        
        if (options?.hideSystemCursor ?? false) {
            document.body.style.cursor = 'none'
        }
        
        // Pass events through so we can click things underneath
        this.eventMode = 'none' 
        
        this.listener = MouseListener.subscribe((x,y) => this.onMove(x,y))
    }

    /**
     * 
     * @param x 
     * @param y 
     */
    public onMove (x: number, y: number) {}

    public override onDestroy() {
        this.listener.unsubscribe()
    }
}