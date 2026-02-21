import { Assets } from 'pixi.js'
import { Logger } from './Logger.ts'

export interface AssetEntry {
    alias: string
    src: string
}

export interface AssetManifest {
    bundles: {
        name: string
        assets: AssetEntry[]
    }[]
}

export class AssetLoader {
    private static _initialised = false
    private static log = new Logger('AssetLoader')

    public static async init(manifest: AssetManifest): Promise<void> {
        if (this._initialised) return

        await Assets.init({ manifest })
        this._initialised = true
    }

    public static async loadBundle(bundleName: string, onProgress?: (progress: number) => void): Promise<void> {
        try {
            await Assets.loadBundle(bundleName, onProgress)
        } catch (e) {
            this.log.error(`Failed to load bundle: ${bundleName}`, e)
        }
    }

    public static async loadBundles(bundleNames: string[]): Promise<void> {
        await Promise.all(bundleNames.map(name => Assets.loadBundle(name)))
    }

    public static backgroundLoadBundle(bundleName: string): void {
        Assets.backgroundLoadBundle(bundleName)
        .then(() => {
            this.log.info(`Background load complete: ${bundleName}`)
        })
        .catch((e) => {
            this.log.error(`Background load failed: ${bundleName}`, e)
        })
    }
}