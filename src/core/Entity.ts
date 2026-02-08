import gsap from 'gsap'
import type { DestroyOptions, Ticker, Container } from 'pixi.js'
import type { MaybePromise } from '../utils/types.ts'
import { Animator } from './Animator.ts'

/**
 * 
 */
export interface StageEntity {
    /**
     * 
     */
    onCreate(): MaybePromise
    /**
     * 
     */
    onUpdate(ticker: Ticker): void
    /**
     * 
     */
    onResize(width: number, height: number): void
    /**
     * 
     */
    onDestroy(options?: DestroyOptions): void

    /** @internal **/
    _init(): void

    /** @internal **/
    destroy(options?: DestroyOptions): void
}

export type StageObject = Container & StageEntity

// deno-lint-ignore no-explicit-any
type Constructor<T = Record<PropertyKey, never>> = new (...args: any[]) => T

export function StageEntityMixin<TBase extends Constructor<Container>>(Base: TBase) {
    return class StageEntity extends Base implements StageEntity {
        private _animator?: Animator

        // deno-lint-ignore no-explicit-any
        constructor(...args: any[]) {
            super(...args)
        }

        /**
         * 
         */
        public get animator(): Animator {
            if (!this._animator) {
                this._animator = new Animator(this)
            }
            return this._animator
        }
        
        // PUBLIC HOOKS
        public onCreate(): MaybePromise {}
        
        public onUpdate(_ticker: Ticker): void {}

        public onResize(_w: number, _h: number): void {}

        public onDestroy(_options?: DestroyOptions): void {}

        /** @internal **/
        public async _init() {
            await this.onCreate()
        }

        /** @internal **/
        public override destroy(options?: DestroyOptions) {
            this._animator?.stop()
            this.onDestroy(options)
            gsap.killTweensOf(this)
            super.destroy?.(options)
        }
    }
}