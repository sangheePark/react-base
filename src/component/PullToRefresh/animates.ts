export default {
  pulling: (d: number, opts: any) => {
    const { threshold, el } = opts

    let p = d / threshold
    if (p > 1) p = 1
    else p = p * p * p
    const y = d / 2.5

    el.style.opacity = p
    el.style.transform = y ? `translate3d(-50%, ${y}px, 0) rotate(${360 * p}deg)` : ''
  },

  refreshing: (opts: any) => {
    const { threshold, el } = opts
    el.style.transition = 'transform 0.2s'
    el.style.transform = `translate3d(-50%, ${threshold / 2.5}px, 0)`
  },

  aborting: (opts: any) => {
    const { el } = opts
    return new Promise((resolve) => {
      if (opts.el.style.transform) {
        el.style.transition = 'transform 0.3s, opacity 0.15s'
        el.style.transform = 'translate3d(-50%, 0, 0)'
        el.style.opacity = 0
        el.addEventListener('transitionend', () => {
          el.style.transition = ''
          resolve()
        })
      } else {
        resolve()
      }
    })
  },

  restoring: (opts: any) => {
    const { el } = opts
    return new Promise((resolve) => {
      el.style.transition = 'transform 0.3s'
      el.style.transform += ' scale(0.01)'
      el.addEventListener('transitionend', () => {
        el.style.transition = ''
        resolve()
      })
    })
  }
}
