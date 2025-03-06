import * as THREE from 'three'
import { RawShaderMaterial } from '@core/ExtendedMaterials'
import { Scene } from '@core/Scene'
import fragmentShader from '@shader/point.fs'
import vertexShader from '@shader/point.vs'
import { Particle } from '@webgl/Particle'

export class Display extends Scene {
  private readonly camera: THREE.OrthographicCamera

  constructor(
    renderer: THREE.WebGLRenderer,
    private readonly particle: Particle,
  ) {
    super(renderer)

    this.scene.background = new THREE.Color('#000')
    // this.scene.add(new THREE.AxesHelper(Math.min(window.innerWidth, window.innerHeight) * 0.2))

    const halfWidth = particle.fieldSize.width * 0.5
    const halfHeight = particle.fieldSize.height * 0.5
    this.camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.01, 10)
    this.camera.position.z = 5

    this.createPoints(particle)
  }

  private createPoints(particle: Particle) {
    const geo = new THREE.BufferGeometry()

    const position: number[] = []

    for (let i = 0; i < particle.count.x * particle.count.y; i++) {
      position.push(0, 0, 0)
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
    geo.setAttribute('uv', particle.uv)

    const mat = new RawShaderMaterial({
      uniforms: {
        posMap: { value: null },
        velMap: { value: null },
        densityMap: { value: null },
        size: { value: particle.size },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    })

    const mesh = new THREE.Points(geo, mat)
    mesh.name = 'points'
    this.scene.add(mesh)
  }

  setData(pos: THREE.WebGLRenderTarget, vel: THREE.WebGLRenderTarget, density: THREE.WebGLRenderTarget) {
    this.uniforms('points').posMap.value = pos.texture
    this.uniforms('points').velMap.value = vel.texture
    this.uniforms('points').densityMap.value = density.texture
  }

  render() {
    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    const halfWidth = this.particle.fieldSize.width * 0.5
    const halfHeight = this.particle.fieldSize.height * 0.5
    this.camera.left = -halfWidth
    this.camera.right = halfWidth
    this.camera.top = halfHeight
    this.camera.bottom = -halfHeight
    this.camera.updateProjectionMatrix()
  }
}
