import type { Texture } from 'pixi.js'
import { BaseSprite } from './BaseSprite.ts'

export class CoverSprite extends BaseSprite {
    constructor(texture: Texture) {
        super(texture)
        // Always center for now until I implement options.
        this.anchor.set(0.5)
    }

    public override onResize(width: number, height: number): void {
        const tex = this.texture

        if (!tex.width || !tex.height) return

        const ratioX = width / tex.width
        const ratioY = height / tex.height

        // TODO: options on how the image should be covered, such as a 'contain' visual.
        const scale = Math.max(ratioX, ratioY)

        this.scale.set(scale)

        // TODO: the image currently always centers to the screen,
        // but it might be useful to add some positioning options.
        this.position.set(width / 2, height / 2)
    }
}