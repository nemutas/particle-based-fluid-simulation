import * as THREE from 'three'

export class UnworkableCamera extends THREE.Camera {
  constructor() {
    super()
    this.matrixAutoUpdate = false
    this.matrixWorldAutoUpdate = false
  }
}
