import "./stylus/app.styl"
import "./extend"
import { Mannager } from "./game/scenes/Manager"
import { Begin } from "./game/scenes/Begin"
import { throttle } from "helpful-decorators";
import { Loading } from "./game/Loading";


class App extends PIXI.Application {
    root: PIXI.Container = new PIXI.Container()
    shared = PIXI.Loader.shared

    constructor(parameters: any) {
        super(parameters)
        document.body.appendChild(this.view)
        this.shared.baseUrl = "./img/"

        this.shared
            .add("bg", "bg.png")
            .add("json", "res.json")
            .add("loading", "loading.png")
            .load(rs => {

            })
        // .onError.once(err => alert(`资源加载失败，请重试`))
        this.stage.addChild(this.root)
        const loading = new Loading()
        this.root.addChild(loading)
        setTimeout(() => {
            loading.update(99)
        }, 1000);
        window.addEventListener('resize', this.onresize.bind(this))
    }
    @throttle(300)
    onresize() {
        this.renderer.resize(window.innerWidth, window.innerHeight)
    }
}


new App({
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    backgroundColor: 0xff00ff,
    antialias: true
})


