const modulo = (v, w) => (v % w + w) % w

const getScreenHeight = (kernel) => {
  if (kernel) {
    const rect = kernel.getBoundingClientRect()
    return rect.height
  }
  else {
    return window.innerHeight
  }
}

const getTramProgress = (kernel, tram) => {
  if (kernel) {
    const rect = kernel.getBoundingClientRect()
    return rect.height + rect.y - tram.y
  }
  else {
    return window.innerHeight - tram.y
  }
}

const getPositionPair = (kernel, target, tram, progress, advancing) => {
  const positionPairs =
    Object.keys(target.dataset)
      .map(key => {
        const md = key.match(/^tram(Forward|Backward)-(\d{1,3})(|%|vh|px)(|[+-])$/)
        if (md === null) return
        if (advancing && md[1] === "Backward" || !advancing && md[1] === "Forward") return
        const realDistance = _getRealDistance(kernel, tram, md[2], md[3], md[4])
        return [key, realDistance]
      })
      .filter(pair => pair !== undefined)

  return(
    advancing ?
    positionPairs.sort((a, b) => b[1] - a[1]).find(p => p[1] <= progress) :
    positionPairs.sort((a, b) => a[1] - b[1]).find(p => p[1] >= progress)
  )
}

const _getRealDistance = (kernel, tram, distance, unit, suffix) => {
  const screenHeight = getScreenHeight(kernel)
  let realDistance

  if (unit === "px") realDistance = distance
  else if (unit === "%") realDistance = tram.height * distance / 100
  else if (unit === "vh") realDistance = screenHeight * distance / 100
  else realDistance = (screenHeight + tram.height) * distance / 100

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
  switcher: (el, interval, transitionDuration) => ({
    el,
    interval,
    transitionDuration,
    len: undefined,
    inTransition: false,
    i: 0,
    v: undefined,
    init() {
      console.log({transitionDuration})

      this.body = this.el.querySelector("[data-switcher-body]")

      if (this.body === null) {
        console.error("This switcher does not have body.")
        return
      }

      this.body.style.display = "flex"
      this.body.style.flexDirection = "column"
      this.body.style.position = "relative"

      this.len = this.el.querySelectorAll("[data-item-index]").length

      if (this.interval !== undefined) {
        this.v = setInterval(() => { this._forward() }, this.interval)
      }
    },
    _forward() {
      this._transition()
      this.i = this.i < this.len - 1 ? this.i + 1 : this.i
      if (this.i == this.len - 1) clearInterval(this.v)
    },
    first() {
      this._transition()
      this.i = 0
      clearInterval(this.v)
    },
    prev() {
      this._transition()
      this.i = this.i > 0 ? this.i - 1 : this.i
      clearInterval(this.v)
    },
    next() {
      this._transition()
      this.i = this.i < this.len - 1 ? this.i + 1 : this.i
      clearInterval(this.v)
    },
    last() {
      this._transition()
      this.i = this.len - 1
      clearInterval(this.v)
    },
    choose(n) {
      this._transition()
      if (n >= 0 && n < this.len) this.i = n
      clearInterval(this.v)
    },
    _transition() {
      if (this.transitionDuration > 0) {
        this.inTransition = true
        setTimeout(() => { this.inTransition = false }, this.transitionDuration + 250)
      }
    }
  }),
  rotator: (el, interval, transitionDuration) => ({
    el,
    interval,
    transitionDuration,
    len: undefined,
    inTransition: false,
    i: 0,
    v: undefined,
    init() {
      this.body = this.el.querySelector("[data-rotator-body]")

      if (this.body === null) {
        console.error("This rotator does not have body.")
        return
      }

      this.body.style.display = "flex"
      this.body.style.flexDirection = "column"
      this.body.style.position = "relative"

      this.len = this.el.querySelectorAll("[data-item-index]").length

      if (this.interval !== undefined) {
        this.v = setInterval(() => { this._forward() }, this.interval)
      }
    },
    _forward() {
      this._transition()
      this.i = this.i < this.len - 1 ? this.i + 1 : 0
    },
    first() {
      this._transition()
      this.i = 0
      clearInterval(this.v)
    },
    last() {
      this._transition()
      this.i = this.len - 1
      clearInterval(this.v)
    },
    prev() {
      this._transition()
      this.i = this.i > 0 ? this.i - 1 : this.len - 1
      clearInterval(this.v)
    },
    next() {
      this._transition()
      this.i = this.i < this.len - 1 ? this.i + 1 : 0
      clearInterval(this.v)
    },
    choose(n) {
      this._transition()
      if (n >= 0 && n < this.len) this.i = n
      clearInterval(this.v)
    },
    _transition() {
      if (this.transitionDuration > 0) {
        this.inTransition = true
        setTimeout(() => { this.inTransition = false }, this.transitionDuration + 250)
      }
    }
  }),
  carousel: (el, len, repeatCount, interval, transitionDuration) => ({
    el,
    len,
    repeatCount,
    interval,
    transitionDuration,
    inTransition: false,
    i: 0,
    frame: undefined,
    body: undefined,
    itemWidth: undefined,
    init() {
      this.frame = this.el.querySelector("[data-carousel-frame]")
      this.body = this.el.querySelector("[data-carousel-body]")

      if (this.frame === null || this.body === null) {
        console.error("This carousel does not have frame and body.")
        return
      }

      const items = this.body.querySelectorAll("[data-carousel-item]")
      const firstItem = items[0]

      if (firstItem === null) {
        console.error("This carousel has no item.")
        return
      }

      this.itemWidth = firstItem.offsetWidth
      this.frame.style.overflow = "hidden"
      this.body.style.display = "flex"
      this.body.style.width = String(this.itemWidth * this.len * this.repeatCount) + "px"

      Array.from(items).forEach(item => {
        item.style.display = "block"
        item.style.visibility = "visible"
      })

      this._resetStyle()

      window.onresize = () => {
        this.body.style.display = "block"
        this.body.style.width = "auto"

        this.itemWidth = firstItem.offsetWidth
        this.body.style.display = "flex"
        this.body.style.width = String(this.itemWidth * this.len * this.repeatCount) + "px"
        this._resetStyle()
      }

      if (this.interval > 0) this.v = setInterval(() => { this._forward() }, this.interval)
    },
    _forward() {
      this._shiftPosition(1)

      setTimeout(() => {
        this.i = this.i < this.len - 1 ? this.i + 1 : 0
        this._resetStyle()
      }, this.transitionDuration + 250)
    },
    prev() {
      if (this.inTransition) return
      if (this.v) clearInterval(this.v)
      this._shiftPosition(-1)

      setTimeout(() => {
        this.i = this.i > 0 ? this.i - 1 : this.len - 1
        this._resetStyle()
      }, this.transitionDuration + 250)
    },
    next() {
      if (this.inTransition) return
      if (this.v) clearInterval(this.v)
      this._shiftPosition(1)

      setTimeout(() => {
        this.i = this.i < this.len - 1 ? this.i + 1 : 0
        this._resetStyle()
      }, this.transitionDuration + 250)
    },
    choose(n) {
      if (this.inTransition) return
      if (this.i === n) return
      if (this.v) clearInterval(this.v)

      this._shiftPosition(n - this.i)

      setTimeout(() => {
        this.i = n
        this._resetStyle()
      }, this.transitionDuration + 250)
    },
    _shiftPosition(diff) {
      this.body.style.transitionProperty = "translate"
      this.body.style.transitionDuration = this.transitionDuration + "ms"

      const translateLength =
        this.itemWidth * (4 + diff) - (this.frame.offsetWidth - this.itemWidth) / 2

      this.body.style.translate = `-${translateLength}px 0`
      this.inTransition = true
    },
    _resetStyle() {
      this.body.style.transitionProperty = "none"
      this.body.style.transitionDuration = "0s"

      const translateLength = this.itemWidth * 4 - (this.frame.offsetWidth - this.itemWidth) / 2

      this.body.style.translate = `-${translateLength}px 0`

      this.body.querySelectorAll("[data-carousel-item]").forEach((item, n) => {
        item.style.order = modulo(n - this.i + 4, this.len * this.repeatCount)
      })

      this.inTransition = false
    }
  }),
  tram: (el) => ({
    el,
    kernel: undefined,
    previousProgress: undefined,
    targets: [],
    init() {
      this.targets = Array.from(this.el.querySelectorAll("[data-tram-trigger]"))
      if (this.el.dataset.tramTrigger !== undefined) this.targets.push(el)

      this.targets.forEach(target => {
        target.dataset.tramBaseClass = target.className
      })

      this.kernel = window.document.getElementById("tg-preview-area-kernel")

      if (this.kernel) {
        this._doInit()
      }
      else {
        const body = window.document.querySelector("body[phx-hook='Main']")
        if (body) this._doInit()
        else window.addEventListener("load", () => this._doInit())
      }
    },
    _doInit() {
      this._initializeTargets()
      this._processTriggers()

      const target = this.kernel ? this.kernel : window.document

      target.addEventListener("scroll", () => {
        this._processTriggers()
      })
    },
    _initializeTargets() {
      const tram = this.el.getBoundingClientRect()

      this.targets.forEach(target => {
        const progress = getTramProgress(this.kernel, tram)
        const positionPair = getPositionPair(this.kernel, target, tram, progress, true)

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
      const longDistance = getScreenHeight(this.kernel) + tram.height
      const progress = getTramProgress(this.kernel, tram)

      if (withinRange(progress, this.previousProgress, longDistance)) {
        const advancing = this.previousProgress === undefined || progress > this.previousProgress

        this.targets.forEach(target => {
          const positionPair = getPositionPair(this.kernel, target, tram, progress, advancing)
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
