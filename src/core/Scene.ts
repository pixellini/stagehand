import gsap from 'gsap'
import { Container } from 'pixi.js'
import type { Ticker, DestroyOptions } from 'pixi.js'
import { Logger } from '../utils/Logger.ts'
import type { MaybePromise } from '../utils/types.ts'
import type { StageObject } from './Entity.ts'

/**
 * 
 */
export class Scene extends Container {
    /**
     * The title is mainly used for debugging.
     */
    public title: string = 'Scene'
    /**
     * GSAP timeline to animate sprites and entities.
     */
    public timeline: gsap.core.Timeline = gsap.timeline({ paused: true })
    /**
     * 
     */
    public entities: StageObject[] = []
    /**
     * Create the GSAP bucket.
     * This helps with cleaning up GSAP animations to prevent memory leaks,
     * especially in combination with PixiJS.
     */
    protected ctx: gsap.Context = gsap.context(() => {})
    /**
     * 
     */
    private _timeScale: number = 1
    /**
     * 
     */
    protected log: Logger
    /**
     * The global base duration for animations (in seconds).
     * This acts as a central reference to sync timing across the scene,
     * which allows for global adjustments from a single source.
     */
    public get timeScale(): number {
        return this._timeScale
    }
    public set timeScale(value: number) {
        this._timeScale = value
        if (this.timeline) {
            this.timeline.timeScale(value)
        }
    }

    constructor() {
        super()

        this.log = new Logger(this.constructor.name)
    }

    /* PUBLIC LIFECYCLE HOOKS */
    /**
     * Called automatically by SceneManager when the scene is added.
     */
    public async _init() {
        // It's important that this is created inside of the gsap context.
        // Otherwise we would run into memory leaks when it needs to be cleaned up.
        this.ctx.add(() => {
            // Kill the eagerly-initialised placeholder before replacing it.
            this.timeline.kill()
            this.timeline = gsap.timeline({
                onStart: () => this.onTimelineStart(),
                onUpdate: () => this.onTimelineUpdate(),
                onComplete: () => this.onTimelineComplete(),
            })
            this.timeline.timeScale(this.timeScale)
        })
        
        this.onCreate()
        this.log.info('Started')
        await this.onStart()

        // Wait for the GSAP timeline to complete before calling onEnd
        if (this.timeline && this.timeline.totalDuration() > 0) {
            await new Promise<void>((resolve) => {
                this.timeline.eventCallback('onComplete', () => resolve())
            })
        }

        await this.onEnd()
        this.log.info('Ended')
    }

    /**
     * 
     */
    public onCreate(): void {}

    /**
     * 
     */
    public onStart(): MaybePromise {}

    /**
     * 
     * @param ticker 
     */
    public onUpdate(ticker: Ticker): void {}

    /**
     * 
     * @param width 
     * @param height 
     */
    public onResize(width: number, height: number): MaybePromise {}

    /**
     * This will call the onCreate method,
     * but if there needs to be any other setup before resetting,
     * use this method.
     */
    public onReset(): MaybePromise {}

    /**
     * When the scene is finished,
     * or the main timeline has ended.
     */
    public onEnd(): MaybePromise {}

    /**
     * For handling any clean up of the scene.
     * Useful for destroying all other external scene objects.
     */
    public onBeforeDestroy(): MaybePromise {}

    // TIMELINE HOOKS

    /**
     * 
     */
    public onTimelineStart() {}
    /**
     * 
     */
    public onTimelineUpdate() {}
    /**
     * 
     */
    public onTimelineComplete() {}


    // GUARDS

    /**
     * Checks if this scene should be skipped entirely.
     * The default is false (Always show).
     */
    public canEnter(): boolean { return true }
    /**
     * 
     */
    public canLeave(): boolean { return true }
    /**
     * 
     */
    public isSupported(): boolean { return true }

    // INTERNAL
    
    public _update(ticker: Ticker) {
        this.onUpdate(ticker)

        // Loop backwards so entities can remove themselves without breaking the loop
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].onUpdate?.(ticker)
        }
    }

    public _resize(width: number, height: number) {
        this.onResize(width, height)

        for (const entity of this.entities) {
            entity.onResize(width, height)
        }

        this.log.debug('Resized')
    }

    public async reset() {
        this.kill(true)

        await this.onReset()

        this.removeChildren()

        await this._init()

        this.log.info('Reset')
    }

    /** @internal **/
    public override destroy (options?: DestroyOptions) {
        this.kill()
        
        super.destroy(options)

        this.log.info('Destroyed')
    }

    // HELPERS / UTILS

    /**
     * This will automatically kill any GSAP timelines and tweens,
     * as long as they are inside this context.
     */
    private kill(destroyChildren?: boolean) {
        this.ctx.revert()
        // Refresh the context. Can't forget this or subsequent animations won't be tracked.
        this.ctx = gsap.context(() => {})

        this.entities = []
        if (this.timeline) {
            this.timeline.kill()
        }

        if (destroyChildren) {
            this.destroyChildren()
        }
    }

    /**
     * 
     */
    private destroyChildren() {
        const children = this.removeChildren()
        for (const child of children) {
            // Ensure we don't try to destroy something already dead
            if (!child.destroyed) {
                child.destroy({ children: true }) 
            }
        }
    }

    /**
     * 
     * @param entity 
     */
    public addEntity(entity: StageObject) {
        // more of a runtime safety check
        if (!entity) {
            this.log.error('Entity cannot be added')
            return
        }

        this.entities.push(entity)
        this.addChild(entity)
        entity._init()
    }

    /**
     * 
     * @param entity 
     */
    public removeEntity(entity: StageObject) {
        // more of a runtime safety check
        if (!entity) {
            this.log.error('Entity cannot be deleted')
            return
        }

        const index = this.entities.indexOf(entity)
        if (index > -1) {
            this.entities.splice(index, 1)
        }

        this.removeChild(entity)

        entity.destroy()
    }
}
