import { useEffect } from 'react'
import { useCanvasContext } from '../hooks/canvas-context'
import type { DetectedBarcode } from '../hooks/useBarcodeDetector'

interface Props {
  width: number
  height: number
  barcodes: DetectedBarcode[]
}

export function DetectionOverlay(props: Props) {
  const { barcodes, width, height } = props
  const { ctx, canvasRef } = useCanvasContext()

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    canvasRef.current.width = width
    canvasRef.current.height = height
  }, [canvasRef, width, height])

  useEffect(() => {
    if (!ctx) {
      return
    }

    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, width, height)
      for (const barcode of barcodes) {
        const start = barcode.cornerPoints[0]
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        for (const p of barcode.cornerPoints.slice(1)) {
          ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()
        ctx.strokeStyle = barcode.hashColor
        ctx.lineWidth = 5
        ctx.stroke()
      }
    })
  }, [barcodes, ctx, height, width])

  return <canvas ref={canvasRef} width={width} height={height} />
}
