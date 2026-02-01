import { Point } from 'pixi.js'

class ScreenManager {
    public width: number = 0
    public height: number = 0
    public center: Point = new Point()
    public quadrant = {
        topLeft: new Point(),
        topRight: new Point(),
        bottomLeft: new Point(),
        bottomRight: new Point()
    }

    constructor() {
        this.resize()
        globalThis.addEventListener('resize', () => this.resize())
    }

    public resize(): void {
        this.width = globalThis.innerWidth
        this.height = globalThis.innerHeight
        
        const cx = this.width / 2
        const cy = this.height / 2
        
        this.center.set(cx, cy)

        // Quadrant Centers (halfway between 0 and center, or center and edge)
        const qx = this.width / 4
        const qy = this.height / 4

        this.quadrant.topLeft.set(qx, qy)
        this.quadrant.topRight.set(cx + qx, qy)
        this.quadrant.bottomLeft.set(qx, cy + qy)
        this.quadrant.bottomRight.set(cx + qx, cy + qy)
    }
}

export const Screen = new ScreenManager()