import { BaseGraphics } from './BaseGraphics.ts'

export interface SquareOptions {
    size: number
    color?: string | number
}

export class Square extends BaseGraphics {
    constructor(context?: SquareOptions) {
        super()
        
        const d = context?.size || 10
        const c = context?.color || 0xFFFFFF
        const p = -d / 2

        this
        .rect(p, p, d, d)
        .fill(c)
    }
}