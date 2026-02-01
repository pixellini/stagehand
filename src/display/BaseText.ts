import { Text, type TextOptions, type DestroyOptions } from 'pixi.js'
import type { Entity } from '../types/Entity.ts'
import { EntityUtils } from '../utils/EntityUtils.ts'

export class BaseText extends Text implements Entity {
    public meta = {}

    constructor(options: TextOptions) {
        // TODO: update this.
        super(options)
        this.anchor.set(0.5)
    }

    public onResize(_width: number, _height: number): void {}

    public override destroy(options?: DestroyOptions): void {
        EntityUtils.kill(this)
        super.destroy(options)
    }
}