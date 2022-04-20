import { execCommand } from "@/utils/dom";
import { LngLatLike, Map, Marker } from "mapbox-gl";

export function add3dBuilding(map: Map) {
  const layers = map.getStyle().layers || [];
  const labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout!['text-field']
  )?.id;
  map.addLayer(
    {
      'id': 'add-3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',

        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    },
    labelLayerId
  )
}

export function addMarker(pos: LngLatLike, iconSize: [number, number]) {
  const el = document.createElement('div')
  el.setAttribute('style', `
    width: ${iconSize[0]}px;
    height: ${iconSize[1]}px;
    background-image: url(/logo.svg);
    background-size: 100% 100%;
    border-radius: 50%;
    box-shadow: 2px 2px 12px 0px #000000b0;
    cursor: pointer;
    padding: 0;
  `)
  return new Marker(el)
    .setLngLat(pos)
}

export function defineContextMenu(map: Map) {
  map.on('contextmenu', (e) => {
    const id = 'contextmenu-panel'
    const ctxMenu = document.getElementById(id)
    if (ctxMenu) {
      ctxMenu.style.display = 'block'
      ctxMenu.style.left = `${e.point.x}px`
      ctxMenu.style.top = `${e.point.y}px`
      return
    }
    const parentElement = map.getCanvas().parentElement
    const el = document.createElement('div')
    el.setAttribute('id', 'contextmenu-panel')
    el.setAttribute('style', `
      position: absolute;
      left: ${e.point.x}px;
      top: ${e.point.y}px;
      min-width: 70px;
      color: #000;
      background-color: #fff;
      cursor: pointer;
      box-shadow: 2px 2px 12px 0px #000000b0;
      padding: 4px;
      font-size: 14px;
      border-radius: 4px;
    `)
    parentElement?.appendChild(el)
    el.textContent = 'copy'
    el.onclick = () => {
      execCommand('copy', `${e.lngLat.lng.toFixed(5)},${e.lngLat.lat.toFixed(5)}`)
      el.style.display = 'none'
    }
    map.on('click', () => {
      el.style.display = 'none'
    })
  })
}

export function genCtrlEl(text: string) {
  const container = document.createElement('div')
  container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'
  container.textContent = text
  container.style.background = '#fff'
  container.style.padding = '2px 4px'
  container.style.border = '1px solid #ccc'
  container.setAttribute('style', `
    background: #fff;
    width: 29px;
    height: 29px;
    cursor: pointer;
    color: #000;
    line-height: 29px;
    text-align: center;
    font-weight: 500;
  `)
  return container
}
