const modulo = (v, w) => (v % w + w) % w

const getPositionPair = (target, tram, progress, advancing) => {
  const positionPairs =
    Object.keys(target.dataset)
      .map(key => {
        const md = key.match(/^tram(Forward|Backward)-(\d{1,3})(|%|vh|px)(|[+-])$/)
        if (md === null) return
        if (advancing && md[1] === "Backward" || !advancing && md[1] === "Forward") return
        const realDistance = _getRealDistance(tram, md[2], md[3], md[4])
        return [key, realDistance]
      })
      .filter(pair => pair !== undefined)

  return(
    advancing ?
    positionPairs.sort((a, b) => b[1] - a[1]).find(p => p[1] <= progress) :
    positionPairs.sort((a, b) => a[1] - b[1]).find(p => p[1] >= progress)
  )
}

const _getRealDistance = (tram, distance, unit, suffix) => {
  let realDistance

  if (unit === "px") realDistance = distance
  else if (unit === "%") realDistance = tram.height * distance / 100
  else if (unit === "vh") realDistance = window.innerHeight * distance / 100
  else realDistance = (window.innerHeight + tram.height) * distance / 100

  if (suffix === "+") realDistance = window.innerHeight + realDistance
  else if (suffix === "-") realDistance = window.innerHeight - realDistance

  return realDistance
}

const withinRange = (progress, previousProgress, longDistance) => {
  if (progress >= 0 && progress <= longDistance) return true
  if (previousProgress === undefined) return false
  if (previousProgress >= 0 && previousProgress <= longDistance) return true
  return false
}

window.tgweb = {
  switcher: (el, interval) => ({
    i: 0,
    len: undefined,
    v: undefined,
    interval,
    init() {
      const items = el.querySelectorAll("[data-switcher-item]")
      this.len = items.length
      items.forEach((item, n) => item.dataset.index = `${n}`)

      if (this.interval !== undefined) {
        this.v = setInterval(() => { this._forward() }, this.interval)
      }
    },
    _forward() {
      this.i = this.i < this.len - 1 ? this.i + 1 : this.i
    },
    first() {
      this.i = 0
      clearInterval(this.v)
    },
    prev() {
      this.i = this.i > 0 ? this.i - 1 : this.i
      clearInterval(this.v)
    },
    next() {
      this.i = this.i < this.len - 1 ? this.i + 1 : this.i
      clearInterval(this.v)
    },
    choose: (n) => {
      if (n >= 0 && n < this.len) this.i = n
      clearInterval(this.v)
    }
  }),
  rotator: (el, interval) => ({
    i: 0,
    len: undefined,
    v: undefined,
    interval,
    init() {
      const items = el.querySelectorAll("[data-rotator-item]")
      this.len = items.length
      items.forEach((item, n) => item.dataset.index = `${n}`)

      if (this.interval !== undefined) {
        this.v = setInterval(() => { this._forward() }, this.interval)
      }
    },
    _forward() {
      this.i = this.i < this.len - 1 ? this.i + 1 : this.i
    },
    first() {
      this.i = 0
      clearInterval(this.v)
    },
    prev() {
      this.i = this.i > 0 ? this.i - 1 : this.len - 1
      clearInterval(this.v)
    },
    next() {
      this.i = this.i < this.len - 1 ? this.i + 1 : 0
      clearInterval(this.v)
    },
    choose: (n) => {
      if (n >= 0 && n < this.len) this.i = n
      clearInterval(this.v)
    }
  }),
  carousel: (el, interval, duration) => ({
    el,
    interval,
    duration,
    inTransition: false,
    i: 0,
    len: undefined,
    repeatCount: undefined,
    frame: undefined,
    body: undefined,
    init() {
      this.frame = this.el.querySelector("[data-carousel-frame]")
      this.body = this.el.querySelector("[data-carousel-body]")

      if (this.frame === null) return
      if (this.body === null) return

      this.frame.style.overflow = "hidden"

      const items = this.body.querySelectorAll("[data-carousel-item]")
      const firstItem = items[0]
      if (firstItem === undefined) return

      this.itemWidth = firstItem.offsetWidth
      this.len = items.length

      if (this.len === 1) this.repeatCount = 5
      else if (this.len === 2) this.repeatCount = 3
      else if (this.len === 3 || this.len === 4) this.repeatCount = 2
      else this.repeatCount = 1

      for (let n = 1; n < this.repeatCount; n++) {
        items.forEach(item => {
          firstItem.before(item.cloneNode(true))
        })
      }

      this.body.style.display = "flex"
      this.body.style.width = String(this.itemWidth * this.len * this.repeatCount) + "px"

      this._resetStyle()

      if (this.interval > 0) this.v = setInterval(() => { this._forward() }, this.interval)
    },
    _forward() {
      this._shiftPosition("next")

      setTimeout(() => {
        this.i = this.i < this.len - 1 ? this.i + 1 : 0
        this._resetStyle()
      }, this.duration + 250)
    },
    prev() {
      if (this.inTransition) return
      if (this.v) clearInterval(this.v)
      this._shiftPosition("prev")

      setTimeout(() => {
        this.i = this.i > 0 ? this.i - 1 : this.len - 1
        this._resetStyle()
      }, this.duration + 250)
    },
    next() {
      if (this.inTransition) return
      if (this.v) clearInterval(this.v)
      this._shiftPosition("next")

      setTimeout(() => {
        this.i = this.i < this.len - 1 ? this.i + 1 : 0
        this._resetStyle()
      }, this.duration + 250)
    },
    choose(n) {
      if (this.v) clearInterval(this.v)

      this.i = n

      this.body.querySelectorAll("[data-carousel-item]").forEach((item, j) => {
        item.style.order = modulo(j - this.i + 2, this.len * this.repeatCount)
      })
    },
    _shiftPosition(direction) {
      this.body.style.transitionProperty = "translate"
      this.body.style.transitionDuration = this.duration + "ms"

      const translateLength =
        direction === "next" ?
        this.itemWidth * 3 - (this.frame.offsetWidth - this.itemWidth) / 2 :
        this.itemWidth * 1 - (this.frame.offsetWidth - this.itemWidth) / 2

      this.body.style.translate = `-${translateLength}px 0`

      this.inTransition = true
    },
    _resetStyle() {
      this.body.style.transitionProperty = "none"
      this.body.style.transitionDuration = "0s"

      const translateLength = this.itemWidth * 2 - (this.frame.offsetWidth - this.itemWidth) / 2

      this.body.style.translate = `-${translateLength}px 0`

      this.body.querySelectorAll("[data-carousel-item]").forEach((item, n) => {
        item.style.order = modulo(n - this.i + 2, this.len * this.repeatCount)
      })

      this.inTransition = false
    }
  }),
  tram: (el) => ({
    el,
    previousProgress: undefined,
    targets: [],
    init() {
      this.targets = Array.from(this.el.querySelectorAll("[data-tram-trigger]"))
      if (this.el.dataset.tramTrigger !== undefined) this.targets.push(el)

      this.targets.forEach(target => {
        target.dataset.tramBaseClass = target.className
      })

      window.addEventListener("load", () => {
        this._initializeTargets()
        this._processTriggers()

        window.document.addEventListener("scroll", () => {
          this._processTriggers()
        })
      })
    },
    _initializeTargets() {
      const tram = this.el.getBoundingClientRect()

      this.targets.forEach(target => {
        const progress = window.innerHeight - tram.y
        const positionPair = getPositionPair(target, tram, progress, true)

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
    _processTriggers() {
      const tram = this.el.getBoundingClientRect()
      const longDistance = window.innerHeight + tram.height
      const progress = window.innerHeight - tram.y

      if (withinRange(progress, this.previousProgress, longDistance)) {
        const advancing = this.previousProgress === undefined || progress > this.previousProgress

        this.targets.forEach(target => {
          const positionPair = getPositionPair(target, tram, progress, advancing)
          if (positionPair === undefined) return

          const attrName = positionPair[0]
          const attrValue = target.dataset[attrName]
          const additionalClassTokens = attrValue.split(/\s+/)

          target.className = target.dataset.tramBaseClass
          target.classList.add(...additionalClassTokens)
        })
      }

      this.previousProgress = progress
    }
  })
}
