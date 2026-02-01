import { Container, type DestroyOptions } from 'pixi.js'
import type { Entity } from '../types/Entity.ts'
import { EntityUtils } from '../utils/EntityUtils.ts'
import { Animator, type AnimationConfig } from '../core/Animator.ts'

export abstract class BaseContainer extends Container implements Entity {
    public animate: Animator

    constructor() {
        super()
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