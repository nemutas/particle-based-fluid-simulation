import Tempus from 'tempus'
import { pane } from '../Gui'
import { Base } from './core/Base'
import { Display } from './renderer/Display'
import { Particle } from './Particle'
import { CollisionPos } from './renderer/CollisionPos'
import { CollisionVel } from './renderer/CollisionVel'
import { Density } from './renderer/Density'
import { ExternalForce } from './renderer/ExternalForce'
import { PressureForce } from './renderer/PressureForce'
import { UpdatePosition } from './renderer/UpdatePosition'
import { ViscosityForce } from './renderer/ViscosityForce'

export class Canvas extends Base {
  private readonly particle: Particle

  private readonly externalForce: ExternalForce
  private readonly density: Density
  private readonly pressureForce: PressureForce
  private readonly viscosityForce: ViscosityForce
  private readonly updatePosition: UpdatePosition
  private readonly collisionPos: CollisionPos
  private readonly collisionVel: CollisionVel

  private readonly display: Display

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, { alpha: true })

    this.particle = new Particle(this.renderer)

    this.externalForce = new ExternalForce(this.renderer, this.particle)
    this.density = new Density(this.renderer, this.particle)
    this.pressureForce = new PressureForce(this.renderer, this.particle)
    this.viscosityForce = new ViscosityForce(this.renderer, this.particle)
    this.updatePosition = new UpdatePosition(this.renderer)
    this.collisionPos = new CollisionPos(this.renderer, this.particle)
    this.collisionVel = new CollisionVel(this.renderer, this.particle)
    this.display = new Display(this.renderer, this.particle)

    pane.expanded = false

    window.addEventListener('resize', this.resize.bind(this))

    // this.renderer.setAnimationLoop(this.render.bind(this))
    Tempus.add(this.render.bind(this), { fps: 75 })
  }

  private get fbo() {
    return this.particle.fbo
  }

  private render() {
    pane.updateFps()
    const dt = this.clock.getDelta()

    // 外力
    this.externalForce.setData(this.fbo.posSrc, this.fbo.velSrc)
    this.externalForce.render(this.fbo.velDst, dt)
    this.fbo.swap('vel')

    // 仮の位置
    this.updatePosition.setData(this.fbo.posSrc, this.fbo.velSrc)
    this.updatePosition.render(this.fbo.posDst, 1 / 120)
    this.fbo.swap('pos')

    // 密度
    this.density.setData(this.fbo.posSrc)
    this.density.render(this.fbo.density)

    // 圧力
    this.pressureForce.setData(this.fbo.posSrc, this.fbo.velSrc, this.fbo.density)
    this.pressureForce.render(this.fbo.velDst, dt)
    this.fbo.swap('vel')

    // 粘性
    this.viscosityForce.setData(this.fbo.posSrc, this.fbo.velSrc, this.fbo.density)
    this.viscosityForce.render(this.fbo.velDst, dt)
    this.fbo.swap('vel')

    // 正確な位置
    this.updatePosition.setData(this.fbo.posSrc, this.fbo.velSrc)
    this.updatePosition.render(this.fbo.posDst, dt)
    this.fbo.swap('pos')

    // 境界条件（速度）
    this.collisionVel.setData(this.fbo.posSrc, this.fbo.velSrc)
    this.collisionVel.render(this.fbo.velDst)
    this.fbo.swap('vel')

    // 境界条件（位置）
    this.collisionPos.setData(this.fbo.posSrc)
    this.collisionPos.render(this.fbo.posDst)
    this.fbo.swap('pos')

    // 描画
    this.display.setData(this.fbo.posSrc, this.fbo.velSrc, this.fbo.density)
    this.display.render()
  }

  protected resize() {
    super.resize()
    this.particle.resize()
    this.collisionVel.resize()
    this.collisionPos.resize()
    this.display.resize()
  }
}
