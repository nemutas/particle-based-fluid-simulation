import * as THREE from 'three'
import { SimBase } from '@webgl/SimBase'
import { Particle } from '@webgl/Particle'
import vertexShader from '@shader/quad.vs'
import fragmentShader from '@shader/externalForce.fs'
import { mouse } from '@webgl/Mouse2D'

export class ExternalForce extends SimBase {
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
        velMap: { value: null },
        dt: { value: null },
        gravity: { value: particle.gravity },
        interactionInputPoint: { value: [mouse.x, mouse.y] },
        interactionInputStrength: { value: 0 },
        interactionInputRadius: { value: particle.interactionRadius },
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
    this.uniforms.interactionInputPoint.value = [mouse.x, mouse.y]
    this.uniforms.interactionInputStrength.value = mouse.active ? this.particle.interactionStrength : 0

    this.renderer.setRenderTarget(renderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
