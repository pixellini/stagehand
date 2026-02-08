import 'gsap'

declare module 'gsap' {
  interface Timeline {
    /**
     * Fades in the target(s) to alpha: 1.
     * @param targets The target(s) to animate.
     * @param duration Optional duration in seconds (defaults to 2).
     */
    fadeIn(targets: gsap.TweenTarget, duration?: number): this

    /**
     * Fades out the target(s) to alpha: 0.
     * @param targets The target(s) to animate.
     * @param duration Optional duration in seconds (defaults to 2).
     */
    fadeOut(targets: gsap.TweenTarget, duration?: number): this
  }
}
