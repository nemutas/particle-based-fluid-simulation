import * as THREE from 'three'
import { pane } from '../Gui'
import { FBO } from './FBO'

export class Particle {
  /** 粒子の数 */
  public readonly count = { x: 70, y: 70 } as const
  /** 粒子の質量 */
  public readonly mass: number = 1.0
  /** 粒子の大きさ */
  public readonly size: number = 8
  /** 粒子間距離 */
  public readonly distance: number = this.size + 1
  /** 影響半径 */
  public readonly re: number = 30
  /** 重力加速度 */
  public readonly gravity = [0, -9.8 * 0, 0] as const
  /** 領域サイズ */
  public readonly fieldSize = { width: window.innerWidth, height: window.innerHeight }
  /** 静止密度 ρ0 */
  public readonly targetDensity: number = 5
  /** 温度に依存する気体定数 k */
  public readonly pressureMultiplier: number = 100
  /** 至近距離間での温度に依存する気体定数 k */
  public readonly nearPressureMultiplier: number = 50
  /** 流体の粘性係数 μ */
  public readonly viscosityStrength: number = 0.08
  /** 領域端に達したときの速度減衰率 */
  public readonly collisionDamping: number = 0.9
  /** マウスの有効範囲 */
  public readonly interactionRadius: number = 150
  /** マウスの強さ */
  public readonly interactionStrength: number = 5000
  /** buffer群 */
  public readonly fbo: FBO
  /** bufferにアクセスするためのuv */
  public readonly uv: THREE.Float32BufferAttribute

  public paramaterChangeCallbacks: { [key in string]: ((v: number) => void)[] } & Object = {}

  constructor(renderer: THREE.WebGLRenderer) {
    this.re = this.loadParam('re') ?? this.re
    this.targetDensity = this.loadParam('targetDensity') ?? this.targetDensity
    this.pressureMultiplier = this.loadParam('pressureMultiplier') ?? this.pressureMultiplier
    this.nearPressureMultiplier = this.loadParam('nearPressureMultiplier') ?? this.nearPressureMultiplier
    this.viscosityStrength = this.loadParam('viscosityStrength') ?? this.viscosityStrength

    const { posData, uv } = this.createData()

    this.fbo = new FBO(this.count.x, this.count.y)
    this.fbo.initPosition(renderer, posData)

    this.uv = uv

    this.setGUI()
  }

  private createData() {
    const posTemp: number[] = []
    const uvTemp: number[] = []

    const gap = this.size + 2

    const offset = [gap * (this.count.x - 1) * 0.5, gap * (this.count.y - 1) * 0.5]

    for (let ix = 0; ix < this.count.x; ix++) {
      for (let iy = 0; iy < this.count.y; iy++) {
        const x = ix * gap - offset[0]
        const y = iy * gap - offset[1]
        const z = 0
        posTemp.push(x, y, z, 0)
        uvTemp.push(ix / this.count.x + (1 / this.count.x) * 0.5, iy / this.count.y + (1 / this.count.y) * 0.5)
      }
    }

    // 位置
    const posData = new THREE.DataTexture(Float32Array.from(posTemp), this.count.x, this.count.y, THREE.RGBAFormat, THREE.FloatType)
    posData.minFilter = THREE.NearestFilter
    posData.magFilter = THREE.NearestFilter
    posData.needsUpdate = true

    // bufferにアクセスするためのUV
    const uv = new THREE.Float32BufferAttribute(uvTemp, 2)

    return { posData, uv }
  }

  resize() {
    this.fieldSize.width = window.innerWidth
    this.fieldSize.height = window.innerHeight
  }

  private setGUI() {
    pane.addBinding(this, 're', { min: 1, max: 50, step: 0.1 }).on('change', (e) => {
      this.paramaterChangeCallbacks['re']?.forEach((cb) => cb(e.value))
    })
    pane.addBinding(this, 'targetDensity', { min: 1, max: 20, step: 1 }).on('change', (e) => {
      this.paramaterChangeCallbacks['targetDensity']?.forEach((cb) => cb(e.value))
    })
    pane.addBinding(this, 'pressureMultiplier', { min: 1, max: 200, step: 1 }).on('change', (e) => {
      this.paramaterChangeCallbacks['pressureMultiplier']?.forEach((cb) => cb(e.value))
    })
    pane.addBinding(this, 'nearPressureMultiplier', { min: 1, max: 200, step: 1 }).on('change', (e) => {
      this.paramaterChangeCallbacks['nearPressureMultiplier']?.forEach((cb) => cb(e.value))
    })
    pane.addBinding(this, 'viscosityStrength', { min: 0, max: 1, step: 0.001 }).on('change', (e) => {
      this.paramaterChangeCallbacks['viscosityStrength']?.forEach((cb) => cb(e.value))
    })

    pane.addButton({ title: 'save paramaters' }).on('click', () => {
      localStorage.setItem('re', this.re.toFixed(1))
      localStorage.setItem('targetDensity', this.targetDensity.toFixed(1))
      localStorage.setItem('pressureMultiplier', this.pressureMultiplier.toFixed(1))
      localStorage.setItem('nearPressureMultiplier', this.nearPressureMultiplier.toFixed(1))
      localStorage.setItem('viscosityStrength', this.viscosityStrength.toFixed(3))
    })

    pane.addButton({ title: 'reset paramaters' }).on('click', () => {
      localStorage.clear()
      location.reload()
    })
  }

  setParamaterChangeCallback(propertyName: string, callback: (v: number) => void) {
    if (this.paramaterChangeCallbacks.hasOwnProperty(propertyName)) {
      this.paramaterChangeCallbacks[propertyName].push(callback)
    } else {
      this.paramaterChangeCallbacks[propertyName] = [callback]
    }
  }

  private loadParam(propertyName: string) {
    const val = localStorage.getItem(propertyName)
    return val ? Number(val) : null
  }
}
