import React, { useEffect, useRef } from 'react'
import {
  Scene, PerspectiveCamera, WebGLRenderer, Mesh,
  MeshBasicMaterial, BoxGeometry, LineBasicMaterial,
  Vector3, BufferGeometry, Line, Shape, ExtrudeGeometry,
  MeshPhongMaterial, CurvePath, Path, Color, Fog,
  GridHelper, Material, PlaneGeometry, DirectionalLight,
  HemisphereLight, Float32BufferAttribute, Spherical,
  AxesHelper, CameraHelper, PlaneHelper, Plane, Quaternion,
  PointsMaterial, Points
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function ThreeJS() {
  const rendererRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!rendererRef.current) return
    const container = rendererRef.current
    const aspect = container.clientWidth / container.clientHeight
    const { scene, camera, renderer } = genThree(aspect)
    camera.position.set(30, 50, 120 ) // 设置相机偏移位置 x(左右), y(上下), z(前后)
		camera.lookAt( new Vector3( 0, 5, 0 ) ) // 以某个坐标为中心点，看向它

    // lights
    genLights(scene)
    // ground
    genGround(scene)
    // cube
    genCube(scene)
    // axes
    genAxesHelp(scene)

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild(renderer.domElement)
    const orbCtl = new OrbitControls(camera, renderer.domElement)
    orbCtl.addEventListener( 'change', render )
    render()
    function render() {
      renderer.render( scene, camera )
    }
    window.onresize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
      // renderer.setPixelRatio( window.devicePixelRatio );
    }
  }, [])
  
  return (
    <div ref={rendererRef} className="w-full h-full" />
  )
}

function genThree(aspect?: number) {
  const scene = new Scene()
  scene.background = new Color( '#000' )
  // scene.fog = new Fog( 0xe0e0e0, 20, 100 )

  // 60° 类比眼睛睁开的角度，闭眼=0°，睁开越大，角度越大
  const camera = new PerspectiveCamera(60, aspect, 0.1, 1000)
  const renderer = new WebGLRenderer()

  // scene.add(new CameraHelper(camera))

  return { scene, camera, renderer }
}

export function genAxesHelp(scene: Scene) {
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)
}

export function genLights(scene: Scene) {
  const dirLight = new DirectionalLight( 0xffffff )
  dirLight.position.set( 0, 0, 0 )
  scene.add( dirLight )
  const hemiLight = new HemisphereLight( 0xffffff, 0x444444 )
  hemiLight.position.set( 0, 0, 0 )
  scene.add( hemiLight )
}

export function genGround(scene: Scene) {
  const grid = new GridHelper( 200, 40, '#fff', '#fff' );
  (grid.material as Material).opacity = 0.5;
  (grid.material as Material).transparent = true
  scene.add( grid )
  const mesh = new Mesh( new PlaneGeometry( 2000, 2000 ), new MeshPhongMaterial( { color: '#000', depthWrite: false } ) )
  mesh.rotation.x = - Math.PI / 2
  scene.add( mesh )
}

export function genCube(scene: Scene) {
  const geometry = new BoxGeometry(2, 2, 2)
  // geometry.translate(5, 5, 5)
  const material = new MeshBasicMaterial( { color: '#ffcc00', wireframe: true, wireframeLinecap: 'square' } )
  const cube = new Mesh( geometry, material )
  scene.add( cube )
  return cube
}

export function genPoints(points: number[], color?: string) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  const material = new PointsMaterial( { color: color || 0x888888 } );

  return new Points( geometry, material );
}