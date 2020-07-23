import "../stylus/app.styl"

const app = new PIXI.Application({
    width: 750,
    height: 1334,
})
document.body.append(app.view)
const root = new PIXI.Container()
app.stage.addChild(root)
const loader = PIXI.Loader.shared

loader.add('bg', 'img/bg.png')
loader.onProgress.once(function (progress) {
    console.log(`load completed`, progress);

})
loader.load(result => {

    console.log(`load2`, result);

})
