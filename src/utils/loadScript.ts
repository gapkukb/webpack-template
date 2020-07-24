export default function loadScript(url: string): Promise<void> {
    return new Promise((resovle, reject) => {
        var script = document.createElement("script")
        script.type = "text/javascript";
        script.src = url;
        //@ts-ignore
        script.onload = resovle
        script.onerror = reject
        document.getElementsByTagName("head")[0].appendChild(script);
    })
}
