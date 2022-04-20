import { CustomLayerInterface, Map, MercatorCoordinate, } from "mapbox-gl";
import { Camera, DirectionalLight, Loader, Matrix4, Scene, Vector3, WebGLRenderer } from "three";


export class ThreeModelCustomLayer implements CustomLayerInterface {
  id: string = 'id'
  type: 'custom' = 'custom'
  renderingMode: "2d" | "3d" | undefined = '3d'
  renderer!: WebGLRenderer
  scene!: Scene
  camera!: Camera
  map!: Map
  modelTransform!: any
  loader: Loader | undefined
  modelUrl: string | undefined
  constructor(options: {
    id: string,
    loader: Loader,
    modelUrl: string,
    modelOrigin: [number, number]
  }) {
    const { loader, modelUrl, id, modelOrigin } = options
    this.id = id
    this.loader = loader
    this.modelUrl = modelUrl
    this.scene = new Scene()
    this.camera = new Camera()
    const modelAltitude = 100 // 海拔
    // 沿[x, y, z]轴旋转
    const modelRotate = {
      rotateX: Math.PI / 2,
      rotateY: 0,
      rotateZ: 0
    }

    const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    // transformation parameters to position, rotate and scale the 3D model onto the map
    this.modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      ...modelRotate,
      /* Since the 3D model is in real world meters, a scale transform needs to be
      * applied since the CustomLayerInterface expects units in MercatorCoordinates.
      */
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };
  }
  onAdd(map: Map, gl: WebGLRenderingContext) {
    this.map = map
    // create two three.js lights to illuminate the model
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    this.scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    this.scene.add(directionalLight2);

    const loader = this.loader
    if (!loader || !this.modelUrl) return;
    
    loader.loadAsync(this.modelUrl)
      .then((gltf) => {
        this.scene.add(gltf.scene);
      })
    this.renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true // 抗锯齿
    })
    this.renderer.autoClear = false
  }
  render(gl: WebGLRenderingContext, matrix: number[]): void {
    const modelTransform = this.modelTransform
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      modelTransform.rotateZ
    );

    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ
      )
      .scale(
        new Vector3(
          modelTransform.scale * 2,
          -modelTransform.scale * 2,
          modelTransform.scale * 2
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.resetState()
    this.renderer.render(this.scene, this.camera)
    this.map.triggerRepaint()
  }
}
