import type { ShapeOptions } from './types.ts'
import { StageGraphics } from '../types/Entities.ts'

export class Triangle extends StageGraphics {
    private size: number
    private color: string | number
    private centered: boolean

    constructor(options?: ShapeOptions) {
        super()

        this.size = options?.size ?? 30
        this.color = options?.color || 0xFFFFFF
        this.centered = options?.centered ?? true

        // TODO: Offset / Transform Origin

        this.x = options?.x ?? 0
        this.y = options?.y ?? 0

        this.draw()
    }

    public draw() {
        this.clear()

        const height = this.size * (Math.sqrt(3) / 2)
        
        if (this.centered) {
            this.drawCentered()
        } else {
            this.drawStandard(height)
        }

        this.fill(this.color)
    }

    private drawCentered() {
        // Radius (Center to Top Tip)
        const r = this.size * (Math.sqrt(3) / 3) 
        
        // TIP (Top) - Negative Y is Up in Pixi
        const topY = -r 
        
        // BASE (Bottom) - Positive Y is Down
        const baseY = r / 2 

        this.poly([
            0, topY,               // Top Tip
            -this.size / 2, baseY, // Bottom Left
            this.size / 2, baseY   // Bottom Right
        ])
    }

    private drawStandard(height: number) {
        this.poly([
            this.size / 2, 0,      // Top Center
            0, height,             // Bottom Left
            this.size, height      // Bottom Right
        ])
    }
}