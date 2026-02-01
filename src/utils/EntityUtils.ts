import gsap from 'gsap'
import type { Container } from 'pixi.js'

export class EntityUtils {
    public static kill(entity: Container) {
        gsap.killTweensOf(entity)
    }
}