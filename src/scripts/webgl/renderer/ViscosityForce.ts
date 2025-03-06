import * as THREE from 'three'
import { SimBase } from '@webgl/SimBase'
import { Particle } from '@webgl/Particle'
import vertexShader from '@shader/quad.vs'
import fragmentShader from '@shader/viscosityForce.fs'

export class ViscosityForce extends SimBase {
  constructor(renderer: THREE.WebGLRenderer, particle: Particle) {
    super(renderer)
    this.createMesh(particle)
  }

  private createMesh(particle: Particle) {
    this.create({
      uniforms: {
        posMap: { value: null },
        velMap: { value: null },
        densityMap: { value: null },
        dt: { value: null },
        mass: { value: particle.mass },
        re: { value: particle.re },
        count: { value: [particle.count.x, particle.count.y] },
        viscosityStrength: { value: particle.viscosityStrength },
      },
      vertexShader,
      fragmentShader,
    })

    particle.setParamaterChangeCallback('re', (v) => (this.uniforms.re.value = v))
    particle.setParamaterChangeCallback('viscosityStrength', (v) => (this.uniforms.viscosityStrength.value = v))
  }

  setData(pos: THREE.WebGLRenderTarget, vel: THREE.WebGLRenderTarget, density: THREE.WebGLRenderTarget) {
    this.uniforms.posMap.value = pos.texture
    this.uniforms.velMap.value = vel.texture
    this.uniforms.densityMap.value = density.texture
  }

  render(renderTarget: THREE.WebGLRenderTarget, dt: number) {
    this.uniforms.dt.value = dt

    this.renderer.setRenderTarget(renderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
