import * as THREE from 'three'
import { SimBase } from '@webgl/SimBase'
import vertexShader from '@shader/quad.vs'
import fragmentShader from '@shader/updatePosition.fs'

export class UpdatePosition extends SimBase {
  constructor(renderer: THREE.WebGLRenderer) {
    super(renderer)
    this.createMesh()
  }

  private createMesh() {
    this.create({
      uniforms: {
        posMap: { value: null },
        velMap: { value: null },
        dt: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    })
  }

  setData(pos: THREE.WebGLRenderTarget, vel: THREE.WebGLRenderTarget) {
    this.uniforms.posMap.value = pos.texture
    this.uniforms.velMap.value = vel.texture
  }

  render(renderTarget: THREE.WebGLRenderTarget, dt: number) {
    this.uniforms.dt.value = dt

    this.renderer.setRenderTarget(renderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
