import * as THREE from 'three'
import { UnworkableCamera } from '@core/UnworkableCamera'
import { RawShaderMaterial } from '@core/ExtendedMaterials'
import vertexShader from '@shader/quad.vs'
import fragmentShader from '@shader/initPosition.fs'

export class FBO {
  private readonly pos0: THREE.WebGLRenderTarget
  private readonly pos1: THREE.WebGLRenderTarget
  private readonly vel0: THREE.WebGLRenderTarget
  private readonly vel1: THREE.WebGLRenderTarget
  public readonly density: THREE.WebGLRenderTarget

  posSrc: THREE.WebGLRenderTarget
  posDst: THREE.WebGLRenderTarget
  velSrc: THREE.WebGLRenderTarget
  velDst: THREE.WebGLRenderTarget

  constructor(width: number, height: number) {
    this.pos0 = this.createRenderTarget(width, height)
    this.pos1 = this.createRenderTarget(width, height)
    this.vel0 = this.createRenderTarget(width, height)
    this.vel1 = this.createRenderTarget(width, height)
    this.density = this.createRenderTarget(width, height)

    this.posSrc = this.pos0
    this.posDst = this.pos1
    this.velSrc = this.vel0
    this.velDst = this.vel1
  }

  private createRenderTarget(width: number, height: number) {
    return new THREE.WebGLRenderTarget(width, height, {
      type: THREE.FloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    })
  }

  initPosition(renderer: THREE.WebGLRenderer, dataTexture: THREE.DataTexture) {
    const scene = new THREE.Scene()
    const camera = new UnworkableCamera()
    const geo = new THREE.PlaneGeometry(2, 2)

    const mat = new RawShaderMaterial({
      uniforms: {
        posMap: { value: dataTexture },
      },
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    renderer.setRenderTarget(this.pos0)
    renderer.render(scene, camera)

    renderer.setRenderTarget(this.pos1)
    renderer.render(scene, camera)

    renderer.setRenderTarget(null)
  }

  swap(target: 'pos' | 'vel') {
    if (target === 'pos') {
      this.posSrc = this.posSrc === this.pos0 ? this.pos1 : this.pos0
      this.posDst = this.posSrc === this.pos0 ? this.pos1 : this.pos0
    } else if (target === 'vel') {
      this.velSrc = this.velSrc === this.vel0 ? this.vel1 : this.vel0
      this.velDst = this.velSrc === this.vel0 ? this.vel1 : this.vel0
    }
  }
}
