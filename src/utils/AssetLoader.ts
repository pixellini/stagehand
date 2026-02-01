import { Assets } from 'pixi.js'

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

    public static async init(manifest: AssetManifest): Promise<void> {
        if (this._initialised) return

        await Assets.init({ manifest })
        this._initialised = true
    }

    public static async loadBundle(bundleName: string, onProgress?: (progress: number) => void): Promise<void> {
        try {
            await Assets.loadBundle(bundleName, onProgress)
        } catch (e) {
            console.error(`[AssetLoader] Failed to load bundle: ${bundleName}`, e)
        }
    }

    public static async loadBundles(bundleNames: string[]): Promise<void> {
        await Promise.all(bundleNames.map(name => Assets.loadBundle(name)))
    }

    public static backgroundLoadBundle(bundleName: string): void {
        Assets.backgroundLoadBundle(bundleName)
        .then(() => {
            console.log(`[AssetLoader] Background load complete: ${bundleName}`);
        })
        .catch((e) => {
            console.error(`[AssetLoader] Background load failed: ${bundleName}`, e);
        })
    }
}