const modulo = (v, w) => (v % w + w) % w

window.tgweb = {
  switcher: {
    data: () => ({
      i: 0,
      len: undefined
    }),
    init: (data, el, interval) => {
      const items = el.querySelectorAll("[data-switcher-item]")
      data.len = items.length
      items.forEach((item, n) => item.dataset.index = `${n}`)

      if (interval !== undefined) {
        data.v = setInterval(() => { window.tgweb.switcher.forward(data) }, interval)
      }
    },
    forward: (data) => {
      data.i = data.i < data.len - 1 ? data.i + 1 : data.i
    },
    first: (data) => {
      data.i = 0
      clearInterval(data.v)
    },
    prev: (data) => {
      data.i = data.i > 0 ? data.i - 1 : data.i
      clearInterval(data.v)
    },
    next: (data) => {
      data.i = data.i < data.len - 1 ? data.i + 1 : data.i
      clearInterval(data.v)
    },
    last: (data) => {
      data.i = data.len - 1
      clearInterval(data.v)
    },
    choose: (data, n) => {
      if (n >= 0 && n < data.len) data.i = n
      clearInterval(data.v)
    }
  },
  rotator: {
    data: () => ({
      i: 0,
      len: undefined
    }),
    init: (data, el, interval) => {
      const items = el.querySelectorAll("[data-rotator-item]")
      data.len = items.length
      items.forEach((item, n) => item.dataset.index = `${n}`)

      if (interval !== undefined) {
        data.v = setInterval(() => { window.tgweb.rotator.forward(data) }, interval)
      }
    },
    forward: (data) => {
      data.i = data.i < data.len - 1 ? data.i + 1 : 0
    },
    first: (data) => {
      data.i = 0
      clearInterval(data.v)
    },
    prev: (data) => {
      data.i = data.i > 0 ? data.i - 1 : data.len - 1
      clearInterval(data.v)
    },
    next: (data) => {
      data.i = data.i < data.len - 1 ? data.i + 1 : 0
      clearInterval(data.v)
    },
    last: (data) => {
      data.i = data.len - 1
      clearInterval(data.v)
    },
    choose: (data, n) => {
      if (n >= 0 && n < data.len) data.i = n
      clearInterval(data.v)
    }
  },
  carousel: {
    data: () => ({
      inTransition: false,
      i: 0,
      len: undefined
    }),
    init: (data, el, interval, duration) => {
      data.frame = el.querySelector("[data-carousel-frame]")
      data.body = el.querySelector("[data-carousel-body]")

      if (data.frame === undefined) return
      if (data.body === undefined) return

      data.frame.style.overflow = "hidden"

      data.duration = duration

      const items = data.body.querySelectorAll("[data-carousel-item]")
      const firstItem = items[0]
      if (firstItem === undefined) return

      data.itemWidth = firstItem.offsetWidth
      data.len = items.length

      if (data.len === 1) data.repeatCount = 5
      else if (data.len === 2) data.repeatCount = 3
      else if (data.len === 3 || data.len === 4) data.repeatCount = 2
      else data.repeatCount = 1

      for (let n = 1; n < data.repeatCount; n++) {
        items.forEach(item => {
          firstItem.before(item.cloneNode(true))
        })
      }

      data.body.style.display = "flex"
      data.body.style.width = String(data.itemWidth * data.len * data.repeatCount) + "px"

      data.body.style.translate =
        "-" + String(data.itemWidth * 2 - (data.frame.offsetWidth - data.itemWidth) / 2) + "px 0"

      items.forEach((item, n) => {
        item.style.order = modulo(n - data.i + 2, data.len * data.repeatCount)
      })

      data.v = setInterval(() => { window.tgweb.carousel._forward(data) }, interval)
    },
    _forward: (data) => {
      window.tgweb.carousel._shiftPosition(data, "next")

      setTimeout(() => {
        data.i = data.i < data.len - 1 ? data.i + 1 : 0
        window.tgweb.carousel._resetStyle(data)
      }, data.duration + 250)
    },
    prev: (data) => {
      if (data.inTransition) return
      clearInterval(data.v)
      window.tgweb.carousel._shiftPosition(data, "prev")

      setTimeout(() => {
        data.i = data.i > 0 ? data.i - 1 : data.len - 1
        window.tgweb.carousel._resetStyle(data)
      }, data.duration + 250)
    },
    next: (data) => {
      if (data.inTransition) return
      clearInterval(data.v)
      window.tgweb.carousel._shiftPosition(data, "next")

      setTimeout(() => {
        data.i = data.i < data.len - 1 ? data.i + 1 : 0
        window.tgweb.carousel._resetStyle(data)
      }, data.duration + 250)
    },
    choose: (data, n) => {
      clearInterval(data.v)

      data.i = n

      data.body.querySelectorAll("[data-carousel-item]").forEach((item, j) => {
        item.style.order = modulo(j - data.i + 2, data.len * data.repeatCount)
      })
    },
    _shiftPosition: (data, direction) => {
      data.body.style.transitionProperty = "translate"
      data.body.style.transitionDuration = data.duration + "ms"

      const translateLength =
        direction === "next" ?
        data.itemWidth * 3 - (data.frame.offsetWidth - data.itemWidth) / 2 :
        data.itemWidth * 1 - (data.frame.offsetWidth - data.itemWidth) / 2

      data.body.style.translate = `-${translateLength}px 0`

      data.inTransition = true
    },
    _resetStyle: (data) => {
        data.body.style.transitionProperty = "none"
        data.body.style.transitionDuration = "0s"

        const translateLength = data.itemWidth * 2 - (data.frame.offsetWidth - data.itemWidth) / 2

        data.body.style.translate = `-${translateLength}px 0`

        data.body.querySelectorAll("[data-carousel-item]").forEach((item, n) => {
          item.style.order = modulo(n - data.i + 2, data.len * data.repeatCount)
        })

        data.inTransition = false
    }
  }
}
