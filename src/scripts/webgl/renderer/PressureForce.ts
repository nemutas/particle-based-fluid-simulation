import * as THREE from 'three'
import { SimBase } from '@webgl/SimBase'
import { Particle } from '@webgl/Particle'
import vertexShader from '@shader/quad.vs'
import fragmentShader from '@shader/pressureForce.fs'

export class PressureForce extends SimBase {
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
        targetDensity: { value: particle.targetDensity },
        pressureMultiplier: { value: particle.pressureMultiplier },
        nearPressureMultiplier: { value: particle.nearPressureMultiplier },
      },
      vertexShader,
      fragmentShader,
    })

    particle.setParamaterChangeCallback('re', (v) => (this.uniforms.re.value = v))
    particle.setParamaterChangeCallback('targetDensity', (v) => (this.uniforms.targetDensity.value = v))
    particle.setParamaterChangeCallback('pressureMultiplier', (v) => (this.uniforms.pressureMultiplier.value = v))
    particle.setParamaterChangeCallback('nearPressureMultiplier', (v) => (this.uniforms.nearPressureMultiplier.value = v))
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
