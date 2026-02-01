import { AnimatedSprite, type Texture, type DestroyOptions, type FrameObject } from 'pixi.js'
import type { Entity } from '../types/Entity.ts'
import { EntityUtils } from '../utils/EntityUtils.ts'
import { Animator, type AnimationConfig } from '../core/Animator.ts'

export class BaseAnimatedSprite extends AnimatedSprite implements Entity {
    public meta = {}
    public animate: Animator

    constructor(textures: Texture[] | FrameObject[], autoPlay = true) {
        super(textures)
        this.anchor.set(0.5)
        
        this.animate = new Animator(this)
        this.animationSpeed = 0.16 // roughly 10 fps - good for pixel art and retro games.
        
        if (autoPlay) {
            this.play()
        }
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