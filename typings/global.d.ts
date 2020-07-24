//将第三方包的声明文件导出为全局可用
import "pixi.js"
declare module "pixi.js" {
    interface DisplayObject {
        setAttrs<T extends this>(attrs: Partial<Record<keyof T, any>>): void
    }
    interface Loader {
        loadGroup(groupName: string): this
        loadJSON(configPath: string, parent?: { parentResource: any }): this
    }
    interface JSON {
        groups: { keys: string, name: string }[]
        resources: { name: string, type: string, url: string }[]
    }
}
// declare global {

// }

