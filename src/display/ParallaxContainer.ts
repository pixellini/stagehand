import gsap from 'gsap'
import { Point, type DestroyOptions, type Ticker } from 'pixi.js'
import { Screen } from '../utils/Screen.ts'
import { MouseListener } from '../utils/MouseListener.ts'
import { StageContainer } from '../types/Entities.ts'
import type { StageObject } from '../core/Entity.ts'

export interface ParallaxLayerConfig {
    strength: number
    easeFactor: number
}

export interface ParallaxConfig {
    layers: ParallaxLayerConfig[]
}

/**
 * TODO: This currently animates smoothly on mouse move for all use cases,
 * but I'd like to include a configuration to enable/disable this for instant parallax feedback.
 * 
 * TODO: This class should use the gyroscope API if a mouse isn't used or available.
 */
export class ParallaxContainer extends StageContainer {
    public layers: StageContainer[] = []
    private layerConfigs: ParallaxLayerConfig[]
    
    // State
    private listener
    private target: Point = new Point(Screen.center.x, Screen.center.y)

    constructor(config: ParallaxConfig) {
        super()
        this.layerConfigs = config.layers

        this.layerConfigs.forEach(() => {
            const layer = new StageContainer()
            this.addChild(layer)
            this.layers.push(layer)
        })

        this.listener = MouseListener.subscribe(this.onMouseMove)

    }

    public override onUpdate(_ticker: Ticker): void {
        this.update()
    }

    public addToLayer(index: number, child: StageObject): void {
        if (this.layers[index]) {
            this.layers[index].addChild(child)
        }
    }

    private onMouseMove = (x: number, y: number): void => {
        gsap.to(this.target, {
            x,
            y,
            duration: 5,
            ease: 'power4.out',
            overwrite: 'auto' // Prevents tweens from conflicting.
        })
    }

    public update(): void {
        const offsetX = -(this.target.x - Screen.center.x)
        const offsetY = -(this.target.y - Screen.center.y)

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i]
            const config = this.layerConfigs[i]

            const targetX = offsetX * (config.strength / 100)
            const targetY = offsetY * (config.strength / 100)

            // Use a small amount of "follow" logic here to ensure
            // the layers move smoothly relative to the offset.
            const layerEase = config.easeFactor / 100 
            
            layer.x += (targetX - layer.x) * layerEase
            layer.y += (targetY - layer.y) * layerEase
        }
    }

    public override destroy(options?: DestroyOptions) {
        this.listener.unsubscribe()
        gsap.killTweensOf(this.target)
        super.destroy(options)
    }
}