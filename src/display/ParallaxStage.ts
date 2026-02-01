import gsap from 'gsap'
import { Container, Point, type ContainerChild, type DestroyOptions } from 'pixi.js'
import { BaseContainer } from './BaseContainer.ts'
import { Screen } from '../utils/Screen.ts'

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
export class ParallaxStage extends BaseContainer {
    public layers: Container[] = []
    private layerConfigs: ParallaxLayerConfig[]
    
    // State
    private mouse: Point = new Point(Screen.center.x, Screen.center.y)

    constructor(config: ParallaxConfig) {
        super()
        this.layerConfigs = config.layers

        this.layerConfigs.forEach(() => {
            const layer = new Container()
            this.addChild(layer)
            this.layers.push(layer)
        })

        globalThis.addEventListener('mousemove', this.onMouseMove)
    }

    public addToLayer(index: number, child: ContainerChild): void {
        if (this.layers[index]) {
            this.layers[index].addChild(child)
        }
        else {
            console.warn(`ParallaxStage: Layer ${index} does not exist.`)
        }
    }

    private onMouseMove = (e: MouseEvent): void => {
        gsap.to(this.mouse, {
            x: e.clientX,
            y: e.clientY,
            duration: 5,
            ease: 'power4.out',
            overwrite: 'auto' // Prevents tweens from conflicting.
        })
    }

    public update(): void {
        const offsetX = -(this.mouse.x - Screen.center.x)
        const offsetY = -(this.mouse.y - Screen.center.y)

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

    public override destroy(options?: DestroyOptions): void {
        globalThis.removeEventListener('mousemove', this.onMouseMove)
        gsap.killTweensOf(this.mouse)
        super.destroy(options)
    }
}