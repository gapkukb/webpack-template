import { Overlay, OverlayOptions } from "./Base"
export class Loading extends Overlay {
    current: number = 0
    text: PIXI.Text = new PIXI.Text('0%', {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0x000000,
        align: 'center'
    })
    loadingBar: PIXI.Graphics = new PIXI.Graphics()
    loading = new PIXI.Graphics()
    constructor(params?: OverlayOptions) {
        super(params)
        // let width = 200, height = 30, lineWidth = 4
        // this.loading.lineStyle(lineWidth, 0xffffff)
        // this.loading.drawRoundedRect(this.overlay.width / 2, this.overlay.height / 2, width, height, 10)

        // this.loading.pivot.x = width / 2
        // this.loading.pivot.y = height / 2

        // let padding = 10
        // this.loadingBar.beginFill(0xffffff)
        // this.loadingBar.drawRoundedRect(this.overlay.width / 2, this.overlay.height / 2, width / 2 - padding, height - padding, 6)
        // this.loadingBar.endFill()

        // this.loadingBar.pivot.x = this.loadingBar.width / 2
        // this.loadingBar.pivot.y = this.loadingBar.height / 2
        // /**  */
        // this.text.anchor.set(0.5, 0.5)
        // this.text.position.set(this.overlay.width / 2, this.overlay.height / 2)

        // this.addChild(this.loading)
        // this.addChild(this.loadingBar)
        // this.addChild(this.text)
    }
    public update(current: number) {
        this.current = current
        this.text.text = current + '%'
        this.loadingBar.width = 900
    }
}
