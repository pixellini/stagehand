import type { Container, Ticker } from 'pixi.js'
import type { Scene } from './Scene.ts'
import { Logger } from '../utils/Logger.ts'

/**
 * 
 */
export class SceneManager {
    /**
     * 
     */
    private root: Container
    /**
     * @internal
     */
    public currentScene: Scene | undefined
    /**
     * 
     */
    private isTransitioning: boolean = false
    /**
     * 
     */
    private log: Logger
    /**
     * 
     */
    private resizeHandler: () => void

    constructor(root: Container) {
        this.root = root
        
        this.log = new Logger(this.constructor.name)
        this.log.info('created')

        this.resizeHandler = () => {
            this.log.info('resized')
            // TODO: This is assuming the app always resizes to the window,
            // but there may be some instances were the canvas resizes to an element.
            this.currentScene?._resize(globalThis.innerWidth, globalThis.innerHeight)
        }

        globalThis.addEventListener('resize', this.resizeHandler)
    }

    /**
     * Switches to a new scene, handling cleanup of the old one.
     * @internal
     */
    public async play(nextScene: Scene): Promise<void> {
        if (!nextScene) {
            // TODO: Throw error
            this.log.error('the next scene was not provided.')
        }

        if (this.isTransitioning) {
            this.log.warn('unable to load next scene due to previous scene still transitioning.')
            return
        }

        if (!nextScene.isSupported()) {
            this.log.warn('next scene is not supported.')
            nextScene.destroy()
            return
        }

        if (!nextScene.canEnter()) {
            this.log.warn('cannot enter next scene.')
            nextScene.destroy()
            return
        }

        this.isTransitioning = true

        try {
            // Cleanup old scene
            if (this.currentScene) {
                // TODO: should the current scene have an "animate out" capability?
                this.currentScene.destroy({ children: true })
            }

            // Setup new scene
            this.currentScene = nextScene
            this.root.addChild(this.currentScene)
            
            // Start the new scene.
            await this.currentScene._init()
        }
        catch (error) {
            this.log.error(error)
        }
        finally {
            this.isTransitioning = false
        }
    }

    /**
     * The bridge that passes the Tick down to the active scene.
     * @internal
     */
    public update(ticker: Ticker, delta: number): void {
        this.currentScene?._update(ticker, delta)
    }

    /**
     * @internal
     */
    public destroy() {
        globalThis.removeEventListener('resize', this.resizeHandler)
    }
}