import type { Container, Ticker } from 'pixi.js'
import type { Scene } from './Scene.ts'

export class SceneManager {
    private readonly TITLE = 'SceneManager'

    private root: Container
    public currentScene: Scene | undefined
    private isTransitioning: boolean = false

    constructor(root: Container) {
        this.root = root

        globalThis.addEventListener('resize', () => {
            if (this.currentScene) {
                this.currentScene.onResize(globalThis.innerWidth, globalThis.innerHeight)
            }
        })
    }

    /**
     * Switches to a new scene, handling cleanup of the old one.
     */
    public async goTo(newScene: Scene): Promise<void> {
        if (this.isTransitioning) {
            // TODO: Log the skip
            return
        }

        if (newScene.shouldSkip()) {
            return
        }

        this.isTransitioning = true

        try {
            // The user will still see the old scene while the next one is initialised.
            await newScene.initContext()

            // Cleanup old scene
            if (this.currentScene) {
                // TODO: should the current scene have an "animate out" capability?
                this.currentScene.destroy({ children: true })
            }

            // Setup new scene
            this.currentScene = newScene
            this.root.addChild(this.currentScene)
            
            // TODO: This is assuming the app always resizes to the window,
            // but there may be some instances were the canvas resizes to an element.
            this.currentScene.onResize(globalThis.innerWidth, globalThis.innerHeight)
        }
        catch (error) {
            // TODO: proper error handling and logging.
            console.error(error)
        }
        finally {
            this.isTransitioning = false
        }

        
    }

    /**
     * The bridge that passes the Tick down to the active scene.
     */
    public update(ticker: Ticker): void {
        if (this.currentScene?.update) {
            this.currentScene.update(ticker)
        }
    }
}
