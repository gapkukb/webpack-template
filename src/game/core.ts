const ticker = PIXI.Ticker.shared
const loader = PIXI.Loader.shared
const stage = new PIXI.Container()
const monitor = new PIXI.utils.EventEmitter()
const pixelRatio = Math.min(2, window.devicePixelRatio)

const renderer = new PIXI.Renderer({
    width: innerWidth * pixelRatio,
    height: innerHeight * pixelRatio,
})

const zoom = {
    mix: [
        renderer.screen.width
    ]
}
