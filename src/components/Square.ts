import { Graphics } from 'pixi.js'
import { StageEntityMixin } from '../core/Entity.ts'
import type { ShapeOptions } from './types.ts'

export class Square extends StageEntityMixin(Graphics) {
    constructor(context?: ShapeOptions) {
        super()
        
        const d = context?.size ?? 10
        const c = context?.color || 0xFFFFFF
        const p = -d / 2

        this
        .rect(p, p, d, d)
        .fill(c)

        this.x = context?.x ?? 0
        this.y = context?.y ?? 0
    }
}