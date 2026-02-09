import type { ShapeOptions } from './types.ts'
import { StageGraphics } from '../types/Entities.ts'

export class Circle extends StageGraphics {
    constructor(context?: ShapeOptions) {
        super()
        this.alpha = 1
        
        const d = context?.size ?? 0
        const c = context?.color || 0xFFFFFF
        // const p = -d / 2
        const p = 0

        this
        .circle(p, p, d)
        .fill(c)

        this.x = context?.x ?? 0
        this.y = context?.y ?? 0
    }
}