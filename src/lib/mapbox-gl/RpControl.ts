import { LineString } from "geojson";
import { GeoJSONSource, IControl, Map, MapMouseEvent } from "mapbox-gl";
import { genCtrlEl } from ".";
const accessToken = 'pk.eyJ1Ijoic2V2ZW5sZWUiLCJhIjoiY2tsajU4NzJvMjV4NjJzbWdqZXNhcGk3ZiJ9.s1AAwA9B5ZSdA1qTq5VA_Q'

export class RpControl implements IControl {
  private map!: Map | null
  private container!: HTMLElement
  private clickTimes: number = 0
  private isActive: boolean = false
  private onMapClickCb!: (e: MapMouseEvent) => void
  private st!: [number, number]
  private et!: [number, number]
  constructor() {
    this.onMapClickCb = this.onMapClick.bind(this)
  }
  onAdd(map: Map): HTMLElement {
    this.map = map
    const container = this.container = genCtrlEl('RP')
    this.container.onclick = () => {
      this.resetSource()
      this.isActive = !this.isActive
      if (this.isActive) {
        map.getCanvas().style.cursor = 'crosshair'
        container.style.background = '#f60'
        map.on('click', this.onMapClickCb)
      } else {
        this.resetState()
      }
    }
    return this.container
  }
  private async onMapClick(e: MapMouseEvent) {
    const map = this.map!
    const pos: [number, number] = [e.lngLat.lng, e.lngLat.lat]
    this.clickTimes++
    if (this.clickTimes == 1) {
      this.st = pos
      const stData = this.genFeatureCollection({
        type: 'Point',
        coordinates: this.st
      })
      this.addPointLayer('st', stData)
    } else if (this.clickTimes == 2) {
      this.et = pos
      const etData = this.genFeatureCollection({
        type: 'Point',
        coordinates: this.et
      })
      this.addPointLayer('et', etData)
      map.getCanvas().style.cursor = 'wait'
      const res = await routePlan({
        lng: this.st[0],
        lat: this.st[1]
      }, {
        lng: this.et[0],
        lat: this.et[1]
      })
      map.getCanvas().style.cursor = 'grab'
      const { routes } = res
      const { geometry } = routes[0]
      const lineData = this.genFeatureCollection(geometry)
      this.addLineLayer('line', lineData)
      this.resetState()
    }
  }
  private resetSource() {
    const { map } = this;
    if (!map) return
    (map.getSource('st') as GeoJSONSource)?.setData(this.genFeatureCollection({ type: 'Point', coordinates: [] }));
    (map.getSource('et') as GeoJSONSource)?.setData(this.genFeatureCollection({ type: 'Point', coordinates: [] }));
    (map.getSource('line') as GeoJSONSource)?.setData(this.genFeatureCollection({ type: 'LineString', coordinates: [] }))
  }
  private addPointLayer(id: string, data: GeoJSON.FeatureCollection<GeoJSON.Geometry>) {
    const { map } = this
    if (!map) return
    if (map.getLayer(id)) {
      (map.getSource(id) as GeoJSONSource).setData(data)
    } else {
      map.addLayer({
        id,
        type: 'circle',
        source: {
          type: 'geojson',
          data
        }
      })
    }
  }
  private addLineLayer(id: string, data: GeoJSON.FeatureCollection<GeoJSON.Geometry>) {
    const { map } = this
    if (!map) return
    if (map.getLayer(id)) {
      (map.getSource(id) as GeoJSONSource).setData(data)
    } else {
      map.addLayer({
        id,
        type: 'line',
        paint: {
          'line-width': 4,
          "line-color": '#f83'
        },
        source: {
          type: 'geojson',
          data
        }
      })
    }
  }
  private genFeatureCollection(geometry: GeoJSON.Geometry) {
    const geo: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry
        }
      ]
    }
    return geo
  }
  private resetState() {
    if (!this.map) return
    this.map.off('click', this.onMapClickCb)
    this.clickTimes = 0
    this.isActive = false
    this.map.getCanvas().style.cursor = 'grab'
    this.container.style.background = '#fff'
  }
  onRemove(map: Map): void {
    this.resetSource()
    this.container.parentNode?.removeChild(this.container)
    this.map = null
  }
}

async function routePlan(sp: { lng: number; lat: number }, ep: { lng: number; lat: number }) {
  const sp_ep = `${sp.lng},${sp.lat};${ep.lng},${ep.lat}`
  const _ = await fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${sp_ep}?overview=full&geometries=geojson&access_token=${accessToken}`)
  const res: IRoutePlanRes = await _.json()
  return res
}

interface IRoutePlanRes {
  waypoints: Array<{
    location: [number, number]
    name: string
  }>
  routes: Array<{
    legs: Array<{
      steps: any[] // [],
      weight: number // 1332.6,
      distance: number // 4205,
      summary: string // "",
      duration: number // 1126
    }>
    weight_name: string
    geometry: LineString
    weight: number // 1332.6,
    distance: number // 4205,
    duration: number // 1126
  }>
  code: string
}