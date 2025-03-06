class Mouse2D {
  public x = 0
  public y = 0
  public active = false

  constructor() {
    this.addMouseEvents()
  }

  private addMouseEvents() {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas')!

    canvas.addEventListener('mousemove', (e) => {
      this.x = e.clientX - window.innerWidth * 0.5
      this.y = -(e.clientY - window.innerHeight * 0.5)
    })
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.active = true
      }
    })
    canvas.addEventListener('mouseup', (e) => {
      if (this.active && e.button === 0) {
        this.active = false
      }
    })
  }
}

export const mouse = new Mouse2D()
