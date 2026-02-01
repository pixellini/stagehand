import type { Container, DestroyOptions } from 'pixi.js'

export interface Entity extends Container {
    onResize(width: number, height: number): void
    destroy(options?: DestroyOptions): void
}