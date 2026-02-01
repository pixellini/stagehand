import { Graphics, type GraphicsContext, type DestroyOptions } from 'pixi.js'
import type { Entity } from '../types/Entity.ts'
import { EntityUtils } from '../utils/EntityUtils.ts'
import { Animator, type AnimationConfig } from '../core/Animator.ts'

export abstract class BaseGraphics extends Graphics implements Entity {
    public animate: Animator
    
    constructor(context?: GraphicsContext) {
        super(context)
        this.animate = new Animator(this)
    }

    public onResize(_width: number, _height: number): void {}

    public addAnimation(name: string, config: AnimationConfig): void {
        this.animate.add(name, config)
    }

    public override destroy(options?: DestroyOptions): void {
        EntityUtils.kill(this)
        super.destroy(options)
    }
}