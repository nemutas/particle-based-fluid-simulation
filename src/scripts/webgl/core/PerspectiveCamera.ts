import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export class PerspectiveCamera extends THREE.PerspectiveCamera {
  private _controls?: OrbitControls

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    fov?: number,
    aspect?: number,
    near?: number,
    far?: number,
  ) {
    super(fov, aspect, near, far)
  }

  get controls() {
    if (!this._controls) {
      this._controls = new OrbitControls(this, this.renderer.domElement)
      this._controls.enabled = true
      this._controls.enableDamping = true
      this._controls.dampingFactor = 0.08
    }
    return this._controls
  }

  updateAspect(aspect: number) {
    this.aspect = aspect
    this.updateProjectionMatrix()
  }
}
