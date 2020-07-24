interface ResGroup {
    pathPrefix: string,
    collection: string[]
}
export default <Record<string, ResGroup>>{
    "preload": {
        pathPrefix: "./img/",
        collection: [
            "barrier.png",
            "bear.png",
            "bg.png"
        ]
    }
}
