import * as THREE from 'three'
import { UnworkableCamera } from './core/UnworkableCamera'
import { RawShaderMaterial } from './core/ExtendedMaterials'

export abstract class SimBase {
  protected readonly scene = new THREE.Scene()
  protected readonly camera = new UnworkableCamera()
  private mesh?: THREE.Mesh<THREE.BufferGeometry, RawShaderMaterial>

  constructor(protected readonly renderer: THREE.WebGLRenderer) {}

  protected create(parameters: THREE.ShaderMaterialParameters) {
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new RawShaderMaterial(parameters)
    const mesh = new THREE.Mesh(geo, mat)
    this.scene.add(mesh)
    this.mesh = mesh
  }

  protected get uniforms() {
    return this.mesh!.material.uniforms
  }

  public setData(..._args: any) {}

  public resize(..._args: any) {}

  public abstract render(...args: any): void
}
