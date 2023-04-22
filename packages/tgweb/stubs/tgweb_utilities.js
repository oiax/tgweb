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
  },
  tram: {
    data: () => ({
      previousProgress: undefined,
      targets: []
    }),
    init: (data, el) => {
      data.targets = Array.from(el.querySelectorAll("[data-tram-trigger]"))
      if (el.dataset.tramTrigger !== undefined) data.targets.push(el)

      data.targets.forEach(target => {
        target.dataset.tramBaseClass = target.className
      })

      window.addEventListener("load", () => {
        window.tgweb.tram._initializeTargets(data, el)
        window.tgweb.tram._processTriggers(data, el)

        window.document.addEventListener("scroll", () => {
          window.tgweb.tram._processTriggers(data, el)
        })
      })
    },
    _initializeTargets: (data, el) => {
      const tram = el.getBoundingClientRect()

      data.targets.forEach(target => {
        const progress = window.innerHeight - tram.y
        const positionPair = window.tgweb.tram._getPositionPair(target, tram, progress, true)

        if (positionPair === undefined) {
          if (target.dataset.tramInit !== undefined) {
            const classTokens = target.dataset.tramInit.split(/\s+/)
            target.classList.add(...classTokens)
          }
        }
        else {
          const attrValue = target.dataset[positionPair[0]]
          const additionalClassTokens = attrValue.split(/\s+/)

          target.className = target.dataset.tramBaseClass
          target.classList.add(...additionalClassTokens)
        }
      })
    },
    _processTriggers: (data, el) => {
      const tram = el.getBoundingClientRect()
      const longDistance = window.innerHeight + tram.height
      const progress = window.innerHeight - tram.y

      if (window.tgweb.tram._withinRange(progress, data.previousProgress, longDistance)) {
        const advancing = data.previousProgress === undefined || progress > data.previousProgress

        data.targets.forEach(target => {
          const positionPair =
            window.tgweb.tram._getPositionPair(target, tram, progress, advancing)

          if (positionPair === undefined) return

          const attrName = positionPair[0]
          const attrValue = target.dataset[attrName]
          const additionalClassTokens = attrValue.split(/\s+/)

          target.className = target.dataset.tramBaseClass
          target.classList.add(...additionalClassTokens)
        })
      }

      data.previousProgress = progress
    },
    _getPositionPair: (target, tram, progress, advancing) => {
      const positionPairs =
        Object.keys(target.dataset)
          .map(key => {
            const md = key.match(/^tram(Forward|Backward)-(\d{1,3})(|%|vh|px)(|[+-])$/)
            if (md === null) return
            if (advancing && md[1] === "Backward" || !advancing && md[1] === "Forward") return
            const realDistance = window.tgweb.tram._getRealDistance(tram, md[2], md[3], md[4])
            return [key, realDistance]
          })
          .filter(pair => pair !== undefined)

      return(
        advancing ?
        positionPairs.sort((a, b) => b[1] - a[1]).find(p => p[1] <= progress) :
        positionPairs.sort((a, b) => a[1] - b[1]).find(p => p[1] >= progress)
      )
    },
    _getRealDistance: (tram, distance, unit, suffix) => {
      let realDistance

      if (unit === "px") realDistance = distance
      else if (unit === "%") realDistance = tram.height * distance / 100
      else if (unit === "vh") realDistance = window.innerHeight * distance / 100
      else realDistance = (window.innerHeight + tram.height) * distance / 100

      if (suffix === "+") realDistance = window.innerHeight + realDistance
      else if (suffix === "-") realDistance = window.innerHeight - realDistance

      return realDistance
    },
    _withinRange: (progress, previousProgress, longDistance) => {
      if (progress >= 0 && progress <= longDistance) return true
      if (previousProgress === undefined) return false
      if (previousProgress >= 0 && previousProgress <= longDistance) return true
      return false
    }
  }
}
