import gsap from 'gsap'
import { Container, Graphics, Texture, FillGradient } from 'pixi.js'
import type { Ticker, DestroyOptions } from 'pixi.js'
import type { Entity } from '../types/Entity.ts'
import { CoverSprite } from '../display/CoverSprite.ts'
import { Screen } from '../utils/Screen.ts'

export abstract class Scene extends Container {
    /**
     * The title is mainly used for debugging.
     */
    public title: string
    /**
     * GSAP timeline to animate sprites and entities.
     */
    public masterTimeline!: gsap.core.Timeline
    /**
     * The global base duration for animations (in seconds).
     * This acts as a central reference to sync timing across the scene,
     * which allows for global adjustments from a single source.
     */
    public ANIMATION_SPEED: number = 1
    /**
     * The background image or colour for the scene.
     */
    private background: Container | null = null
    /**
     * Create the GSAP bucket.
     * This helps with cleaning up GSAP animations to prevent memory leaks,
     * especially in combination with PixiJS.
     */
    protected ctx: gsap.Context = gsap.context(() => {})

    constructor(title: string) {
        super()
        this.title = title

        // Not sure if it should start invisible, but for the time being, 
        // I've made it a manual process to show the scene once it's ready.
        this.alpha = 0
    }

    /**
     * Called automatically by SceneManager when the scene is added.
     */
    public abstract init(): Promise<void> | void

    public initContext(): Promise<void> {
        return new Promise((resolve) => {
            this.ctx.add(async () => {
                // It's important that this is created inside of the gsap context.
                // Otherwise we would run into memory leaks when it needs to be cleaned up.
                this.masterTimeline = gsap.timeline()

                await this.init()

                resolve()
            })
        })
    }

    /**
     * Called once per frame by the SceneManager.
     * This is optional and should be used if the logic is something GSAP can't handle.
     */
    public update(_ticker: Ticker): void {}

    /**
     * Checks if this scene should be skipped entirely.
     * The default is false (Always show).
     */
    public shouldSkip(): boolean { return false }

    // LIFECYCLE HOOKS
    /**
     * Hook function that executes when the scene has completed.
     */
    public onComplete(): void {}

    /**
     * Called by SceneManager on window resize.
     */
    public onResize(width: number, height: number): void {
        this.children.forEach(child => {
            (child as Entity).onResize?.(width, height)
        })
    }

    /**
     * Called automatically before the scene is removed.
     */
    override destroy(options?: DestroyOptions): void {
        // This will automatically kill any GSAP timelines and tweens,
        // as long as they are inside this context.
        this.ctx.revert()

        super.destroy(options)
    }

    // DISPLAY UTILS
    /**
     * Transition into view.
     */
    public show(): Promise<void> {
        return new Promise(resolve => {
            this.ctx.add(() => {
                gsap.to(this, {
                    alpha: 1,
                    duration: 0.5,
                    onComplete: resolve
                })
            })
        })
    }

    /**
     * Transition out of view.
     */
    public hide(): Promise<void> {
        return new Promise(resolve => {
            this.ctx.add(() => {
                gsap.to(this, {
                    alpha: 0,
                    duration: 0.5,
                    onComplete: resolve
                })
            })
        })
    }

    /**
     * Sets the scene background.
     * Currently supports Colours, Texture Aliases, or Pixi FillGradients.
     */
    public setBackground(source: number | string | FillGradient): void {
        // Remove the previous background if it exists already.
        if (this.background) {
            this.background.destroy()
        }

        /**
         * Depending on what the source type is,
         * it has to be handled in a unique way.
         */
        if (source instanceof FillGradient) {
            // TODO: Rectangle class to enable resizing
            this.background = new Graphics()
            .clear()
            .rect(0, 0, Screen.width, Screen.height)
            .fill(source)

        } else if (typeof source === 'number') {
            // TODO: Rectangle class to enable resizing
            this.background = new Graphics()
            .rect(0, 0, Screen.width, Screen.height)
            .fill({ color: source })

        } else if (typeof source === 'string') {
            const texture = Texture.from(source)
            // This is assuming CoverSprite handles its own resizing internally.
            // Probably should test this.
            this.background = new CoverSprite(texture) 
        }

        if (this.background) {
            if (this.children.length > 0) {
                // Add to bottom of stack
                this.addChildAt(this.background, 0)
            } else {
                this.addChild(this.background)
            }
        }
    }
}
