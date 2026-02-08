import { Point } from 'pixi.js'

type MouseCallback = (x: number, y: number) => void

interface MouseSubscription {
    unsubscribe: () => void
}

export class MouseListener {
    // Global state
    private static readonly position = new Point(0, 0)
    public static get x() { return this.position.x }
    public static get y() { return this.position.y }
    
    // Internal
    private static subscribers: Set<MouseCallback> = new Set()
    private static globalListener: ((e: MouseEvent) => void) | null = null

    /**
     * Start listening to mouse movement.
     * @returns A subscription object to stop listening later.
     */
    public static subscribe(callback: MouseCallback): MouseSubscription {
        this.subscribers.add(callback)

        if (!this.globalListener) {
            this.startTracking()
        }

        return {
            unsubscribe: () => {
                this.remove(callback)
            }
        }
    }

    /**
     * internal remove logic
     */
    private static remove(callback: MouseCallback) {
        this.subscribers.delete(callback)

        // Auto-stop global tracking if list is empty
        if (this.subscribers.size === 0) {
            this.stopTracking()
        }
    }

    // --- DOM EVENTS ---

    private static startTracking() {
        this.globalListener = (e: MouseEvent) => {
            const x = e.clientX
            const y = e.clientY
            
            this.position.set(x, y)

            // Broadcast to all
            for (const callback of this.subscribers) {
                callback(x, y)
            }
        }
        globalThis.addEventListener('mousemove', this.globalListener)
    }

    private static stopTracking() {
        if (this.globalListener) {
            globalThis.removeEventListener('mousemove', this.globalListener)
            this.globalListener = null
        }
    }
}