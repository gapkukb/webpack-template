import { Mannager } from "./scenes/Manager";

export abstract class Scene extends PIXI.Container {
    abstract group: string
    private loader: PIXI.Loader = new PIXI.Loader()
    constructor() {
        super()
    }
    public loadResource(): Promise<PIXI.Loader> {
        return new Promise((resolve, reject) => {
            this.loader.loadGroup(this.group).load(resolve).onError.once(reject)
        })
    }
    public show() {

    }
    public remove() {

    }
    public destroy() {
        this.parent.removeChild(this)
        this.loader.destroy()
    }
}

export type OverlayOptions = Partial<{
    /** 是否显示背景色  默认黑色 */
    overlay: boolean
    /** 透明度，默认0.5 */
    overlayAlpha: number
    /** 是否显示黑色半透明背景层 */
    overlayColor: number
}>

export abstract class Overlay extends PIXI.Container {
    public overlay = new PIXI.Sprite(PIXI.Texture.WHITE)
    constructor(params: OverlayOptions = {}) {
        super()
        let _default: Required<OverlayOptions> = {
            overlay: true,
            overlayAlpha: 0.5,
            overlayColor: 0x000000
        }, _params = Object.assign(_default,params)

        // this.overlay.width = this.
        this.overlay.height = 750
        this.overlay.zIndex = -1
        this.overlay.tint = _default.overlayColor
        this.overlay.alpha = _default.overlay ? _default.overlayAlpha : 0
        this.addChild(this.overlay)
    }
}
