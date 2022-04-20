import React, { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { Map, NavigationControl, FullscreenControl, AttributionControl, GeolocateControl, ScaleControl } from 'mapbox-gl'
const accessToken = 'pk.eyJ1Ijoic2V2ZW5sZWUiLCJhIjoiY2tsajU4NzJvMjV4NjJzbWdqZXNhcGk3ZiJ9.s1AAwA9B5ZSdA1qTq5VA_Q'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RpControl } from '../../lib/mapbox-gl/RpControl'
import { add3dBuilding, addMarker, defineContextMenu } from '../../lib/mapbox-gl'
import { TileControl } from '@/lib/mapbox-gl/TileControl'
import { RulerControl, LanguageControl, InspectControl, StylesControl, CompassControl } from 'mapbox-gl-controls'
import 'mapbox-gl-controls/lib/controls.css'
// @ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { ThreeModelCustomLayer } from '@/lib/mapbox-gl/ThreeModelCustomLayer'


export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map>(null)
  useEffect(() => {
    const map = (mapRef as any).current = new Map({
      accessToken,
      container: mapContainerRef.current!,
      center: [116.39059,39.92278],
      zoom: 14,
      style: 'mapbox://styles/mapbox/streets-v11',
      maxZoom: 24,
      attributionControl: false,
      pitch: 60,
      // cooperativeGestures: true // Hold command or ctrl to zoom the map
    })
    map.addControl(new NavigationControl({
      visualizePitch: true
    }), 'bottom-left')
    map.addControl(new FullscreenControl())
    map.addControl(new AttributionControl({
      customAttribution: 'Designed by me'
    }))
    const geolocateControl = new GeolocateControl({
      showUserHeading: true,
      trackUserLocation: true
    })
    geolocateControl.on('geolocate', (e: any) => {
      const marker = addMarker([e.coords.longitude,e.coords.latitude], [30, 30])
      marker.addTo(map)
      // map.setBearing(30)
    })
    map.addControl(geolocateControl)
    map.addControl(new RpControl(), 'top-left')
    map.addControl(new TileControl(), 'top-left')
    map.addControl(new ScaleControl())
    map.addControl(new RulerControl())
    map.addControl(new StylesControl())
    map.addControl(new InspectControl())
    map.addControl(new LanguageControl({
      language: 'zh'
    }))
    map.addControl(new MapboxGeocoder({
      accessToken,
      mapboxgl: mapboxgl
    }))
    map.on('load', () => {
      // geolocateControl.trigger()
      add3dBuilding(map)
      defineContextMenu(map)
      map.addLayer(new ThreeModelCustomLayer({
        id: 'Horse',
        loader: new GLTFLoader(),
        modelUrl: import.meta.env.DEV ? '/Horse.glb' : `${import.meta.env.BASE_URL}/Horse.glb`,
        modelOrigin: [116.39059,39.92278]
      }))
    })
  }, [])

  return (
    <div ref={mapContainerRef} className='w-full h-full' />
  )
}

