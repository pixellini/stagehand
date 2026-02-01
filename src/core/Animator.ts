import gsap from 'gsap'
import type { Container } from 'pixi.js'

export interface AnimationConfig {
    /**
     * GSAP Tween variables
     */
    vars: gsap.TweenVars & { duration?: number }
    /**
     * Should this instance kill previous animations on this object?
     */
    exclusive?: boolean
}

export class Animator {
    private target: Container
    private animations: Map<string, AnimationConfig> = new Map()
    private currentTween: gsap.core.Tween | null = null

    /**
     * The property that allows dynamic animation access.
     * @example animator.play.walk()
     */
    public readonly play: Record<string, (vars?: gsap.TweenVars) => gsap.core.Tween> = {}

    constructor(target: Container) {
        this.target = target
    }

    /**
     * Registers a new animation.
     */
    public add(name: string, config: AnimationConfig): void {
        this.animations.set(name, config)
        
        // Set the new animation method for access.
        this.play[name] = (vars?: gsap.TweenVars) => this.run(name, vars) as gsap.core.Tween
    }

    /**
     * Stops the animation.
     */
    public stop(): void {
        if (this.currentTween) {
            this.currentTween.kill()
            this.currentTween = null
        }
    }

    /**
     * Plays the animation.
     */
    private run(name: string, overrideVars?: gsap.TweenVars): gsap.core.Tween | undefined {
        const animation = this.animations.get(name)
        if (!animation) return undefined

        if (animation.exclusive !== false && this.currentTween) {
            this.currentTween.kill()
        }

        const { duration = 0.5, ...baseVars } = animation.vars

        this.currentTween = gsap.to(this.target, {
            duration,
            ...baseVars,
            ...overrideVars,
            onComplete: () => {
                this.currentTween = null
                
                if (baseVars.onComplete) (baseVars.onComplete as Function)()
                if (overrideVars?.onComplete) (overrideVars.onComplete as Function)()
            }
        })

        return this.currentTween
    }
}