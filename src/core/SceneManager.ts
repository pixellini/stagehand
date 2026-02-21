import type { Container, Ticker, Application } from 'pixi.js'
import type { Scene } from './Scene.ts'
import { Logger } from '../utils/Logger.ts'
import { AssetLoader } from '../utils/AssetLoader.ts'
import type { SceneAssets } from './Scene.ts'

/**
 * 
 */
export class SceneManager {
    private appRef: Application
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

    constructor(root: Application) {
        this.appRef = root
        this.root = this.appRef.stage
        
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
        if (!nextScene || this.isTransitioning) {
            this.log.warn('unable to load next scene.')
            return
        }

        this.isTransitioning = true

        try {
            if (!nextScene.isSupported() || !nextScene.canEnter()) {
                this.log.warn('Next scene was rejected.')
                nextScene.destroy()
                return
            }

            if (this.currentScene) {
                await this.currentScene.onBeforeDestroy()
                this.currentScene.destroy({ children: true })
            }

            this.currentScene = nextScene
            this.root.addChild(this.currentScene)

            await this.loadSceneAssets(nextScene?.assets)

            await this.currentScene._init()

            if (this.appRef.renderer.prepare) {
                await this.appRef.renderer.prepare.upload(nextScene)
            }
            
            this.log.info('Scene swapped')
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
    public update(ticker: Ticker): void {
        this.currentScene?._update(ticker)
    }

    /**
     * @internal
     */
    public destroy() {
        globalThis.removeEventListener('resize', this.resizeHandler)
    }

    private async loadSceneAssets(assets: SceneAssets | undefined) {
        if (!assets) {
            return
        }

        if (assets.bundle) {
            await AssetLoader.loadBundle(assets.bundle)
        }

        if (assets.preload) {
            for (const bundle of assets.preload) {
                AssetLoader.backgroundLoadBundle(bundle)
            }
        }
    }
}