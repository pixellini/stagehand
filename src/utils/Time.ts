import gsap from 'gsap'

export class Time {
    /**
     * Waits for X seconds.
     * 
     * This uses GSAP's internal clock,
     * so it automatically respects `gsap.globalTimeline.timeScale()`.
     * If you slow down the timeline, this wait will take longer.
     */
    public static wait(seconds: number): Promise<void> {
        return new Promise(resolve => {
            // usage: delayedCall(delayInSeconds, callback)
            gsap.delayedCall(seconds, resolve)
        })
    }

    /**
     * Conditional wait.
     * Useful for timeline branching (e.g., "Wait only if user hasn't clicked skip").
     */
    public static async waitIf(condition: boolean, seconds: number): Promise<void> {
        if (condition) {
            await this.wait(seconds)
        }
    }

    /**
     * Polls a condition every tick until true.
     *
     * Unlike `setInterval`, this syncs with the render loop.
     * If the tab is hidden, this pauses (saving battery).
     */
    public static waitUntil(condition: () => boolean, timeout: number = 10): Promise<void> {
        return new Promise((resolve, reject) => {
            const startTime = Date.now()
            
            const tick = () => {
                if (condition()) {
                    gsap.ticker.remove(tick)
                    resolve()
                    return
                }

                if ((Date.now() - startTime) / 1000 > timeout) {
                    gsap.ticker.remove(tick)
                    reject(new Error(`Time.waitUntil timed out after ${timeout}s`))
                }
            }

            gsap.ticker.add(tick)
        })
    }

    /**
     * Waits for the very next render frame.
     * Essential for "Layout Thrashing" or ensuring DOM/Pixi has
     * finished a texture upload before trying to animate it.
     * @example
     * ```ts
     * title.text = "A Very Long Title"
     * 
     * await Time.nextFrame() 
     * 
     * // Pixi has updated the texture internally.
     * const width = title.width 
     * background.width = width + 20
     * ```
     */
    public static nextFrame(): Promise<void> {
        return new Promise(resolve => {
            gsap.delayedCall(0, resolve)
        })
    }
}