import gsap from 'gsap'

export function registerEffects() {
    gsap.registerEffect({
        name: "fadeIn",
        effect: (targets: gsap.TweenTarget, vars: gsap.TweenVars) => {
            return gsap.to(targets, {
                duration: vars.duration,
                alpha: 1
            })
        },
        defaults: { duration: 2 },
        extendTimeline: true,
    })

    gsap.registerEffect({
        name: "fadeOut",
        effect: (targets: gsap.TweenTarget, vars: gsap.TweenVars) => {
            return gsap.to(targets, {
                duration: vars.duration,
                alpha: 0
            })
        },
        defaults: { duration: 2 },
        extendTimeline: true,
    })
}