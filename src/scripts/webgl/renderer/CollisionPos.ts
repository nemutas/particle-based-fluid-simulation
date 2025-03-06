import * as THREE from 'three'
import { SimBase } from '@webgl/SimBase'
import { Particle } from '@webgl/Particle'
import vertexShader from '@shader/quad.vs'
import fragmentShader from '@shader/collisionPos.fs'

export class CollisionPos extends SimBase {
  constructor(
    renderer: THREE.WebGLRenderer,
    private readonly particle: Particle,
  ) {
    super(renderer)
    this.createMesh(particle)
  }

  private createMesh(particle: Particle) {
    this.create({
      uniforms: {
        posMap: { value: null },
        particleSize: { value: particle.size },
        fieldSize: { value: [particle.fieldSize.width, particle.fieldSize.height] },
        collisionDamping: { value: particle.collisionDamping },
      },
      vertexShader,
      fragmentShader,
    })
  }

  setData(pos: THREE.WebGLRenderTarget) {
    this.uniforms.posMap.value = pos.texture
  }

  resize() {
    this.uniforms.fieldSize.value = [this.particle.fieldSize.width, this.particle.fieldSize.height]
  }

  render(renderTarget: THREE.WebGLRenderTarget) {
    this.renderer.setRenderTarget(renderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
