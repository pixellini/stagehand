import { Point } from 'pixi.js'
import { Screen } from './Screen.ts'

export class MathUtils {
    /**
     * Remaps a number from one range to another.
     * [min1..value..max1] -> [min2..result..max2]
     * @example Maths.map(0.5, 0, 1, 0, 100) // returns 50
     */
    public static map(
        value: number,
        min1: number,
        max1: number,
        min2: number,
        max2: number,
    ): number {
        return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
    }

    /**
     * Constrains a value between a minimum and maximum limit.
     * min |---- value ----| max
     */
    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max)
    }

    /**
     * Linearly interpolates between two values.
     * @param t - The percentage of interpolation (0.0 = start, 1.0 = end)
     */
    public static lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t
    }

    /**
     * Returns a random float between min and max.
     */
    public static random(min: number, max: number): number {
        return Math.random() * (max - min) + min
    }

    /**
     * Returns a random integer between min and max (inclusive).
     */
    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    /**
     * Selects an index based on the relative probabilities of the provided weights.
     * (e.g. [1, 3] means index 1 is 3x more likely to be picked than index 0).
     */
    public static randomWeighted(weights: number[]): number {
        // Added initial value '0' to reduce to prevent crash on empty arrays
        let r = Math.random() * weights.reduce((a, b) => a + b, 0)
        return weights.findIndex((w) => (r -= w) < 0)
    }
}
