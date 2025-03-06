import * as THREE from 'three'

export abstract class Scene {
  protected readonly scene: THREE.Scene

  constructor(protected readonly renderer: THREE.WebGLRenderer) {
    this.scene = new THREE.Scene()
  }

  public abstract render(...args: any): void

  public resize(..._args: any) {}

  protected createRenderTarget(options?: THREE.RenderTargetOptions) {
    return new THREE.WebGLRenderTarget(this.resolution.width, this.resolution.height, options)
  }

  protected mesh<G extends THREE.BufferGeometry, M extends THREE.Material>(name: string) {
    return this.scene.getObjectByName(name) as THREE.Mesh<G, M>
  }

  protected uniforms(meshName: string) {
    return this.mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>(meshName).material.uniforms
  }

  protected get size() {
    const { width, height } = this.renderer.domElement
    return { width, height, aspect: width / height }
  }

  protected get resolution() {
    const dpr = this.renderer.getPixelRatio()
    return { width: this.renderer.domElement.width * dpr, height: this.renderer.domElement.height * dpr }
  }
}
