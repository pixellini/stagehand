import gsap from 'gsap'
import PixiPlugin from 'gsap/dist/PixiPlugin.js' // Standard sub-path import
import * as PIXI from 'pixi.js'
import { SceneManager } from './SceneManager.ts'

// Register the plugin with GSAP
gsap.registerPlugin(PixiPlugin)

// CRITICAL: Link the specific PixiJS instance.
// PixiPlugin.registerPIXI(PIXI)

interface AppConfig extends PIXI.ApplicationOptions {
    logger?: boolean
    debugGrid?: boolean

    // TODO: Pass through GSAP Configuration
}

export class PixiApplication {
    public pixi: PIXI.Application
    public sceneManager: SceneManager

    private isInitialised: boolean = false

    private appConfig: Partial<AppConfig> | undefined

    constructor() {
        this.pixi = new PIXI.Application()
        this.sceneManager = new SceneManager(this.pixi.stage)
    }

    public async init(config: Partial<AppConfig>) {
        if (this.isInitialised) {
            // TODO: error handling
        }

        if (!config) {
            throw new ApplicationInitError()
        }

        this.appConfig = config

        // TODO: Remove custom settings from here to not interfere with Pixi.
        await this.pixi.init(config)
        this.pixi.ticker.add((ticker) => {
            this.sceneManager.update(ticker)
        })

        const canvas = document.getElementById('app')
        if (canvas) canvas.appendChild(this.pixi.canvas)

        this.isInitialised = true

        this.setupTicker()
    }

    /* GSAP & PIXI SETUP */
    private setupTicker() {
        // Prevent Pixi's internal ticker.
        // We don't want Pixi rendering on its own, separate schedule.
        this.pixi.ticker.stop()

        // Register the update loop with GSAP.
        // This ensures the two libraries are synced,
        // and that GSAP is the source of truth for animations and tickers.
        gsap.ticker.add((_time, _deltaTime, _frame) => {
            this.pixi.ticker.update()

            // We still use Pixi's ticker because it contains the calculated deltaTime.
            this.sceneManager.update(this.pixi.ticker)
            this.pixi.renderer.render(this.pixi.stage)
        })
    }
}

// PRESETS
/**
 * 
 */
export const presetWindow: Partial<AppConfig> = {
    resizeTo: window,
    backgroundAlpha: 0,
    antialias: true,
    resolution: Math.min(globalThis.devicePixelRatio, 2),
    autoDensity: true
}

// ERROR HANDLING
export class PixiGsapApplicationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PixiGsapApplicationError'
    }
}

export class ApplicationInitError extends PixiGsapApplicationError {
    constructor(message: string = 'Application already initialised') {
        super(message)
        this.name = 'ApplicationInitError'
    }
}