import gsap from 'gsap'
import PixiPlugin from 'gsap/dist/PixiPlugin.js'
import * as PIXI from 'pixi.js'
import { SceneManager } from './SceneManager.ts'
import { Logger, LogLevel } from '../utils/Logger.ts'
import type { Scene } from './Scene.ts'
import { registerEffects } from '../plugins/Effects.ts'

// Register the plugin with GSAP
gsap.registerPlugin(PixiPlugin)

// TODO: is this still required or is there an update?
// CRITICAL: Link the specific PixiJS instance.
// @ts-expect-error Property 'registerPIXI' does not exist on type...
PixiPlugin.registerPIXI(PIXI)

interface AppConfig extends PIXI.ApplicationOptions {
    debug?: LogLevel
    debugGrid?: boolean
    container?: HTMLElement | string

    // TODO: Pass through GSAP Configuration
}

export class PixiApplication {
    public pixi: PIXI.Application
    public sceneManager: SceneManager

    private isInitialised: boolean = false

    private appConfig: Partial<AppConfig> | undefined

    private log = new Logger('Application')

    private gsapTickerCallback: gsap.TickerCallback | null = null

    constructor() {
        this.pixi = new PIXI.Application()
        this.sceneManager = new SceneManager(this.pixi)
        registerEffects()
    }

    public async init(config: Partial<AppConfig>) {
        if (this.isInitialised) {
            throw new Error('Application init ran multiple times')
        }

        if (!config) {
            throw new Error('Config was not provided')
        }

        this.appConfig = config

        Logger.level = config.debug ?? LogLevel.None

        await this.pixi.init({ ...config, autoStart: false })

        const target = this.resolveTargetContainer(config.container)
        this.mountCanvas(target)

        this.setupTicker()

        this.isInitialised = true
        this.log.info('💡 Lights! 🎥 Camera! 🎉 Action!')
    }

    private resolveTargetContainer(container?: HTMLElement | string): Element | null {
        if (container) {
            return typeof container === 'string'
                ? document.querySelector(container)
                : container
        }

        return document.getElementById('app')
    }

    private mountCanvas(target: Element | null): void {
        if (target) {
            target.appendChild(this.pixi.canvas)
        }
    }

    private tickAndRender(): void {
        this.pixi.ticker.update()

        // We still use Pixi's ticker because it contains the calculated deltaTime.
        this.sceneManager.update(this.pixi.ticker)
        this.pixi.renderer.render(this.pixi.stage)
    }

    /* GSAP & PIXI SETUP */
    private setupTicker() {
        // Prevent Pixi's internal ticker.
        // We don't want Pixi rendering on its own, separate schedule.
        this.pixi.ticker.stop()

        // Register the update loop with GSAP.
        // This ensures the two libraries are synced,
        // and that GSAP is the source of truth for animations and tickers.
        this.gsapTickerCallback = () => {
            this.tickAndRender()
        }
        gsap.ticker.add(this.gsapTickerCallback)
    }

    public play(nextScene: Scene) {
        return this.sceneManager.play(nextScene)
    }

    public destroy() {
        if (this.gsapTickerCallback) {
            gsap.ticker.remove(this.gsapTickerCallback)
            this.gsapTickerCallback = null
        }
        this.sceneManager.destroy()
        this.pixi.canvas.parentNode?.removeChild(this.pixi.canvas)
        this.pixi.destroy(true)
        this.isInitialised = false
        this.log.info('Destroyed')
    }
}