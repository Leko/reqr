import React, { useEffect, useRef, useState } from 'react'
import { DetectedBarcode } from '../hooks/useBarcodeDetector'

interface Props {
  width: number
  height: number
  barcodes: DetectedBarcode[]
}

export function DetectionOverlay(props: Props) {
  const { barcodes } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [
    ctx,
    setCanvasRenderingContext2D,
  ] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    setCanvasRenderingContext2D(canvasRef.current.getContext('2d'))
  }, [canvasRef])
  useEffect(() => {
    if (!canvasRef.current || !ctx) {
      return
    }

    ctx.clearRect(0, 0, props.width, props.height)
    canvasRef.current.width = props.width * devicePixelRatio
    canvasRef.current.height = props.height * devicePixelRatio
    for (const barcode of barcodes) {
      ctx.strokeStyle = barcode.hashColor
      ctx.lineWidth = 5 * devicePixelRatio
      const { boundingBox } = barcode
      ctx.strokeRect(
        boundingBox.left * devicePixelRatio,
        boundingBox.top * devicePixelRatio,
        boundingBox.width * devicePixelRatio,
        boundingBox.height * devicePixelRatio
      )

      // const start = barcode.cornerPoints[0]
      // ctx.beginPath()
      // ctx.strokeStyle = barcode.hashColor
      // ctx.lineWidth = 5 * devicePixelRatio
      // ctx.moveTo(start.x * devicePixelRatio, start.y * devicePixelRatio)
      // for (const p of barcode.cornerPoints.slice(1)) {
      //   ctx.lineTo(p.x * devicePixelRatio, p.y * devicePixelRatio)
      // }
      // ctx.closePath()
      // ctx.stroke()
    }
  }, [barcodes, canvasRef, ctx, props.height, props.width])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: props.width, height: props.height }}
    />
  )
}
