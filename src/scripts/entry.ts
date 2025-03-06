import { Canvas } from './webgl/Canvas'

const canvasEl = document.querySelector<HTMLCanvasElement>('canvas')!
const canvas = new Canvas(canvasEl)

window.addEventListener('beforeunload', () => {
  canvas.dispose()
})
