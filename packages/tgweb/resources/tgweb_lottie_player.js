import { DotLottie } from "./dotlottie.min.js";

window.onload = () => {
  const canvases = document.querySelectorAll("canvas[data-animation='lottie']")

  canvases.forEach(canvas => {
    const lottie =
      new DotLottie({
        autoplay: canvas.dataset.autoplay !== "false",
        loop: canvas.dataset.loop !== "false",
        canvas: canvas,
        src: `/animations/${canvas.dataset.src}`,
      });

    canvas.lottie = lottie

    if (canvas.dataset.click === "true") {
      if (canvas.dataset.autoplay !== "false") canvas.dataset.playing = "true"

      canvas.addEventListener("click", (e) => {
        const c = e.target

        if (c.dataset.playing === "true") {
          delete c.dataset.playing
          c.lottie.pause()
        }
        else {
          c.dataset.playing = "true"
          c.lottie.play()
        }
      })
    }
    else if (canvas.dataset.hover === "true" && canvas.dataset.autoplay === "false") {
      canvas.addEventListener("mouseenter", (e) => {
        e.target.lottie.play()
      })
      canvas.addEventListener("mouseout", (e) => {
        e.target.lottie.pause()
      })
    }
  })
}
