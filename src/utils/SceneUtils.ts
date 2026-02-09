import { Point } from 'pixi.js'
import { Screen } from './Screen.ts'
import { MathUtils } from './MathUtils.ts'

export class SceneUtils {
    /**
     * 
     * @returns a random x & y position based on the screen dimensions.
     */
    public static randomPos(): Point {
        return new Point(
            // X
            MathUtils.random(0, Screen.width),
            // Y
            MathUtils.random(0, Screen.height)
        )
    }

    /**
     * Returns a random item from an array.
     * @returns The item, or undefined if the array is empty.
     */
    public static sample<T>(array: T[]): T | undefined {
        if (array.length === 0) return undefined
        const index = Math.floor(Math.random() * array.length)
        return array[index]
    }
}