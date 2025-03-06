import * as THREE from 'three'
import { SimBase } from '@webgl/SimBase'
import { Particle } from '@webgl/Particle'
import vertexShader from '@shader/quad.vs'
import fragmentShader from '@shader/density.fs'

export class Density extends SimBase {
  constructor(renderer: THREE.WebGLRenderer, particle: Particle) {
    super(renderer)
    this.createMesh(particle)
  }

  private createMesh(particle: Particle) {
    this.create({
      uniforms: {
        posMap: { value: null },
        mass: { value: particle.mass },
        re: { value: particle.re },
        count: { value: [particle.count.x, particle.count.y] },
      },
      vertexShader,
      fragmentShader,
    })

    particle.setParamaterChangeCallback('re', (v) => (this.uniforms.re.value = v))
  }

  setData(pos: THREE.WebGLRenderTarget) {
    this.uniforms.posMap.value = pos.texture
  }

  render(renderTarget: THREE.WebGLRenderTarget) {
    this.renderer.setRenderTarget(renderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
