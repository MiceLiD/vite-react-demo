import { IControl, Map } from "mapbox-gl";
import { genCtrlEl } from ".";

export class TileControl implements IControl {
  private isActive: boolean = false
  onAdd(map: Map): HTMLElement {
    const container = genCtrlEl('Tile')
    container.onclick = () => {
      this.isActive = !this.isActive
      container.style.background = this.isActive ? '#f60' : '#fff'
      if (this.isActive) {
        if (!map.getSource('gaode-tiles')) {
          map.addSource('gaode-tiles', {
            type: 'raster',
            tiles: [
              '//webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
              '//webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
              '//webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
              '//webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            scheme: 'xyz',
          })
        }
        map.addLayer({
          id: 'gaode-tiles',
          type: 'raster',
          source: 'gaode-tiles'
        })
      } else {
        map.getLayer('gaode-tiles') && map.removeLayer('gaode-tiles')
      }
    }
    return container
  }
  onRemove(map: Map): void {
    
  }
}