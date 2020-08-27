import "./index.styl"

if (module.hot) {
    module.hot.accept()
}


let canvas = document.getElementById("canvas")! as HTMLCanvasElement, rect = canvas.getBoundingClientRect()
canvas.width = rect.width;
canvas.height = rect.height

var ctx = canvas.getContext('2d')!
var red = "#D1305D", green = "#08D26B", blue = "#0B9CFE", gray = "#2A2A32", lightGray = "#A8A8A8"

ctx.strokeStyle = gray
drawRoundRectPath(ctx, 30, 30, 300, 30, 8)
drawHeaderCell(ctx, 30, 30, 300, 30)
drawText("庄9", ctx, 80, 45, red)
drawText("庄9", ctx, 180, 45, green)
drawText("庄9", ctx, 280, 45, blue)

function drawText(text: any, ctx: any, x: any, y: any, color: any) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "14px Arial";
    ctx.fillText(text, x + 0.5, y + 0.5)
    ctx.closePath()
}

function drawRoundRectPath(cxt: CanvasRenderingContext2D, x: any, y: any, width: any, height: any, radius: any) {
    x += 0.5
    y += 0.5
    cxt.beginPath();
    cxt.lineTo(width + x, height + y);
    cxt.lineTo(radius + x, height + y);
    cxt.lineTo(x, height + y);
    cxt.lineTo(x, radius + y);
    cxt.arc(radius + x, radius + y, radius, Math.PI, Math.PI * 3 / 2);
    cxt.lineTo(width - radius + x, y);
    cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
    cxt.lineTo(width + x, height - radius + y);
    cxt.closePath();
    ctx.stroke()
}

function drawHeaderCell(ctx: any, x: any, y: any, width: any, height: any) {
    var gradient = ctx.createLinearGradient(x, y, x, y + height)
    gradient.addColorStop(0.2, "rgba(162,162,162,0)")
    gradient.addColorStop(0.5, "rgba(162,162,162,0.8)")
    gradient.addColorStop(0.8, "rgba(162,162,162,0)")
    ctx.fillStyle = gradient
    var w = width / 3
    ctx.fillRect(x + w, y, 0.5, height)
    ctx.fillRect(x + w * 2, y, 0.5, height)
}
