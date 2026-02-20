import gsap from 'gsap'
import type { StageObject } from './Entity.ts'

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

export class Animator<T extends string = string> {
    private target: StageObject
    private animations: Map<string, AnimationConfig> = new Map()
    private activeTweens: Set<gsap.core.Tween> = new Set()

    /**
     * The property that allows dynamic animation access.
     * @example animator.play.walk()
     */
    public readonly play: Record<T, (vars?: gsap.TweenVars) => gsap.core.Tween>

    constructor(target: StageObject) {
        this.target = target
        this.play = {} as unknown as Record<T, (vars?: gsap.TweenVars) => gsap.core.Tween>
    }

    /**
     * Registers a new animation.
     */
    public add(name: T, config: AnimationConfig): void {
        this.animations.set(name, config)
        
        // Set the new animation method for access.
        this.play[name] = (vars?: gsap.TweenVars) => {
            return this.run(name, vars) as gsap.core.Tween
        }
    }

    /**
     * Stops the animation.
     */
    public stop(): void {
        for (const tween of this.activeTweens) {
            tween.kill()
        }
        this.activeTweens.clear()
    }

    /**
     * Plays the animation.
     */
    private run(name: string, overrideVars?: gsap.TweenVars): gsap.core.Tween | undefined {
        const animation = this.animations.get(name)
        if (!animation) return undefined

        const isExclusive = animation.exclusive ?? true

        if (isExclusive) {
            this.stop()
        }

        const { duration = 0.5, ...baseVars } = animation.vars

        const tween = gsap.to(this.target, {
            duration,
            ...baseVars,
            ...overrideVars,
            onComplete: () => {
                this.activeTweens.delete(tween)

                if (typeof baseVars.onComplete === 'function') {
                    baseVars.onComplete()
                }
                if (typeof overrideVars?.onComplete === 'function') {
                    overrideVars.onComplete()
                }
            }
        })

        this.activeTweens.add(tween)

        return tween
    }
}