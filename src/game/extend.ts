
Object.defineProperty(PIXI.DisplayObject.prototype, 'setAttrs', {
    value(this: PIXI.DisplayObject, attrs: any): PIXI.DisplayObject {
        Object.keys(attrs).forEach(item => {
            //@ts-ignore
            this[item] = attrs[item]
        })
        return this
    }
})
Object.defineProperty(PIXI.Loader.prototype, 'loadGroup', {
    value(this: PIXI.Loader, groupName: string): PIXI.Loader {
        const data: PIXI.JSON = PIXI.Loader.shared.resources.json.data
        data.groups.find(item => item.name === groupName)?.keys.split(",").forEach(item => {
            this.add(item, data.resources.find(sub => sub.name === item)?.url)
        })
        return this
    }
})
Object.defineProperties(PIXI.Loader.shared, {
    "loadGroup": {
        value(this: PIXI.Loader, groupName: string): PIXI.Loader {
            const data: PIXI.JSON = this.resources.json.data
            data.groups.find(item => item.name === groupName)?.keys.split(",").forEach(item => {
                this.add(item, data.resources.find(sub => sub.name === item)?.url)
            })
            return this
        }
    },
    "loadJSON": {
        value(this: PIXI.Loader, configPath: string, parent?: { parentResource: any }): PIXI.Loader {
            this.add('json', configPath)
            return this
        }
    },
})
