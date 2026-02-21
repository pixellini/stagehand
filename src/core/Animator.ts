import gsap from 'gsap'
import type { StageObject } from './Entity.ts'

/**
 * Configuration for a single tween animation.
 */
export interface TweenConfig {
    /**
     * GSAP Tween variables applied to the entity target.
     */
    vars: gsap.TweenVars & { duration?: number }
    /**
     * Should this instance kill previous animations on this object?
     */
    exclusive?: boolean
}

/**
 * Configuration for a timeline animation.
 */
export interface TimelineConfig {
    /**
     * Factory that receives the entity target and returns a fully
     * composed GSAP timeline. Called each time the animation plays.
     */
    timeline: (target: StageObject) => gsap.core.Timeline
    /**
     * Should this instance kill previous animations on this object?
     */
    exclusive?: boolean
}

/**
 * A tween or timeline animation definition.
 */
export type AnimationConfig = TweenConfig | TimelineConfig

/**
 * Manages named animations (tweens or timelines) for a single entity.
 *
 * Animations are registered with {@link add}
 * and triggered dynamically via the {@link play} proxy:
 *
 * ```ts
 * animator.add('walk', { vars: { x: 100, duration: 0.5 } })
 * animator.add('combo', {
 *     timeline: (target) => gsap.timeline()
 *         .to(target, { x: 100, duration: 0.3 })
 *         .to(target, { y: 50, duration: 0.2 })
 * })
 *
 * animator.play.walk()
 * animator.play.combo()
 * ```
 */
export class Animator<T extends string = string> {
    private target: StageObject
    private animations: Map<string, AnimationConfig> = new Map()
    private activeAnimations: Set<gsap.core.Animation> = new Set()

    /**
     * Dynamic proxy that triggers a registered animation by name.
     *
     * For tween configs, optional override vars are merged into the tween.
     * For timeline configs, override vars are ignored.
     * Use the factory function for full composition control.
     *
     * @example animator.play.walk()
     * @example animator.play.walk({ duration: 0.3 })
     */
    public readonly play: Record<T, (vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline>

    constructor(target: StageObject) {
        this.target = target
        this.play = new Proxy({} as Record<T, (vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline>, {
            get: (_obj, prop: string) => {
                return (vars?: gsap.TweenVars) => {
                    return this.run(prop, vars) as gsap.core.Tween | gsap.core.Timeline
                }
            }
        })
    }

    /**
     * Registers a named animation (tween or timeline).
     */
    public add(name: T, config: AnimationConfig): void {
        this.animations.set(name, config)
    }

    /**
     * Kills all active animations on the entity.
     */
    public stop(): void {
        for (const animation of this.activeAnimations) {
            animation.kill()
        }
        this.activeAnimations.clear()
    }

    /**
     * Plays a registered animation by name, optionally merging
     * override vars (tween configs only).
     */
    private run(name: string, overrideVars?: gsap.TweenVars): gsap.core.Tween | gsap.core.Timeline | undefined {
        const config = this.animations.get(name)
        if (!config) return

        const isExclusive = config.exclusive ?? true
        if (isExclusive) {
            this.stop()
        }

        if ('timeline' in config) {
            return this.runTimeline(config)
        }
        return this.runTween(config, overrideVars)
    }

    /**
     * Builds and tracks a single GSAP tween from a {@link TweenConfig}.
     */
    private runTween(config: TweenConfig, overrideVars?: gsap.TweenVars): gsap.core.Tween {
        const { duration = 0.5, ...baseVars } = config.vars

        const tween = gsap.to(this.target, {
            duration,
            ...baseVars,
            ...overrideVars,
            onComplete: () => {
                this.activeAnimations.delete(tween)

                if (typeof baseVars.onComplete === 'function') {
                    baseVars.onComplete()
                }
                if (typeof overrideVars?.onComplete === 'function') {
                    overrideVars.onComplete()
                }
            }
        })

        this.activeAnimations.add(tween)
        return tween
    }

    /**
     * Builds and tracks the resulting timeline, and
     * removes it from the active set on completion.
     */
    private runTimeline(config: TimelineConfig): gsap.core.Timeline {
        const tl = config.timeline(this.target)

        const originalOnComplete = tl.eventCallback('onComplete')

        tl.eventCallback('onComplete', () => {
            this.activeAnimations.delete(tl)

            if (typeof originalOnComplete === 'function') {
                originalOnComplete()
            }
        })

        this.activeAnimations.add(tl)
        return tl
    }
}