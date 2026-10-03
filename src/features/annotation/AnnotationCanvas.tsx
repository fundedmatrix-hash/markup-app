import { useEffect, useRef, useState } from 'react';
import type { DrawingStroke, ToolType } from '../types';

const toPoint = (event: PointerEvent | React.PointerEvent<HTMLCanvasElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, event.clientX - rect.left),
    y: Math.max(0, event.clientY - rect.top)
  };
};

type Props = {
  tool: ToolType;
  color: string;
  thickness: number;
  opacity: number;
  boardMode: boolean;
  onChange?: (strokes: DrawingStroke[]) => void;
};

export function AnnotationCanvas({ tool, color, thickness, opacity, boardMode, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const activeStroke = useRef<DrawingStroke | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const parent = canvas.parentElement;
    if (parent) {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = boardMode ? '#111827' : '#f8fafc';
    context.fillRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => drawStroke(context, stroke));
    onChange?.(strokes);
  }, [boardMode, strokes, onChange]);

  const beginStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = toPoint(event);
    const newStroke: DrawingStroke = {
      id: `${Date.now()}-${Math.random()}`,
      tool,
      color,
      thickness,
      opacity,
      points: [point],
      start: point,
      end: point,
      text: tool === 'text' ? 'T' : tool === 'numbers' ? '1' : tool === 'check' ? '✓' : tool === 'cross' ? '✕' : undefined
    };

    activeStroke.current = newStroke;
    setStrokes((previous) => [...previous, newStroke]);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const continueStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeStroke.current) return;
    const point = toPoint(event);
    const current = activeStroke.current;
    const updated = {
      ...current,
      points: [...current.points, point],
      end: point
    };

    setStrokes((previous) => {
      const next = [...previous];
      next[next.length - 1] = updated;
      return next;
    });

    activeStroke.current = updated;
  };

  const finishStroke = () => {
    activeStroke.current = null;
  };

  const undo = () => setStrokes((previous) => previous.slice(0, -1));
  const redo = () => {
    // re-render remains optimistic; the current feature set is intentionally local-only
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: boardMode ? '#0f172a' : '#f8fafc',
          borderRadius: 24,
          boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.25)'
        }}
        onPointerDown={beginStroke}
        onPointerMove={continueStroke}
        onPointerUp={finishStroke}
        onPointerLeave={finishStroke}
      />
      <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', gap: 8 }}>
        <button type="button" onClick={undo} style={buttonStyle}>Undo</button>
        <button type="button" onClick={redo} style={buttonStyle}>Redo</button>
      </div>
    </div>
  );
}

function drawStroke(context: CanvasRenderingContext2D, stroke: DrawingStroke) {
  const { color, opacity, thickness, tool } = stroke;

  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = color;
  context.fillStyle = color;
  context.globalAlpha = opacity;
  context.lineWidth = thickness;

  if (tool === 'marker') {
    context.globalAlpha = opacity * 0.42;
    context.lineWidth = thickness * 2.4;
  }

  if (tool === 'eraser') {
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = thickness * 2.6;
  }

  if (tool === 'pen' || tool === 'marker' || tool === 'line' || tool === 'arrow' || tool === 'doubleArrow' || tool === 'laser') {
    const points = stroke.points;
    if (points.length < 2) {
      const point = points[0];
      if (point) {
        context.beginPath();
        context.arc(point.x, point.y, thickness / 2, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      return;
    }

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    if (tool === 'arrow' || tool === 'doubleArrow' || tool === 'laser') {
      drawArrowHead(context, points, tool === 'doubleArrow');
    }

    context.restore();
    return;
  }

  if (tool === 'rectangle' && stroke.start && stroke.end) {
    const left = Math.min(stroke.start.x, stroke.end.x);
    const top = Math.min(stroke.start.y, stroke.end.y);
    const width = Math.abs(stroke.start.x - stroke.end.x);
    const height = Math.abs(stroke.start.y - stroke.end.y);
    context.strokeRect(left, top, width, height);
  }

  if (tool === 'circle' && stroke.start && stroke.end) {
    const radius = Math.hypot(stroke.end.x - stroke.start.x, stroke.end.y - stroke.start.y);
    context.beginPath();
    context.arc(stroke.start.x, stroke.start.y, radius, 0, Math.PI * 2);
    context.stroke();
  }

  if (tool === 'blur' && stroke.start && stroke.end) {
    context.filter = 'blur(16px)';
    context.fillStyle = color;
    context.fillRect(stroke.start.x, stroke.start.y, Math.abs(stroke.end.x - stroke.start.x), Math.abs(stroke.end.y - stroke.start.y));
  }

  if (tool === 'pixelate' && stroke.start && stroke.end) {
    context.imageSmoothingEnabled = false;
    const width = Math.abs(stroke.end.x - stroke.start.x);
    const height = Math.abs(stroke.end.y - stroke.start.y);
    const cell = Math.max(8, thickness * 2);
    context.fillStyle = color;
    for (let x = 0; x < width; x += cell) {
      for (let y = 0; y < height; y += cell) {
        context.fillRect(stroke.start.x + x, stroke.start.y + y, Math.min(cell, width - x), Math.min(cell, height - y));
      }
    }
  }

  if (tool === 'spotlight' && stroke.start && stroke.end) {
    const gradient = context.createRadialGradient(
      stroke.start.x,
      stroke.start.y,
      10,
      stroke.start.x,
      stroke.start.y,
      Math.max(100, Math.hypot(stroke.end.x - stroke.start.x, stroke.end.y - stroke.start.y))
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(15,23,42,0.7)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2000, 2000);
  }

  if (tool === 'text' && stroke.start) {
    context.font = `${Math.max(18, thickness * 4)}px sans-serif`;
    context.fillText(stroke.text ?? 'T', stroke.start.x, stroke.start.y);
  }

  if (tool === 'numbers' && stroke.start) {
    context.font = `${Math.max(18, thickness * 4)}px sans-serif`;
    context.fillText(stroke.text ?? '1', stroke.start.x, stroke.start.y);
  }

  if (tool === 'check' && stroke.start) {
    context.beginPath();
    context.moveTo(stroke.start.x, stroke.start.y + 10);
    context.lineTo(stroke.start.x + 12, stroke.start.y + 24);
    context.lineTo(stroke.start.x + 36, stroke.start.y - 10);
    context.stroke();
  }

  if (tool === 'cross' && stroke.start) {
    context.beginPath();
    context.moveTo(stroke.start.x - 18, stroke.start.y - 18);
    context.lineTo(stroke.start.x + 18, stroke.start.y + 18);
    context.moveTo(stroke.start.x + 18, stroke.start.y - 18);
    context.lineTo(stroke.start.x - 18, stroke.start.y + 18);
    context.stroke();
  }

  context.restore();
}

function drawArrowHead(context: CanvasRenderingContext2D, points: { x: number; y: number }[], doubleArrow: boolean) {
  if (points.length < 2) return;

  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  const size = 18;

  context.beginPath();
  context.moveTo(last.x, last.y);
  context.lineTo(last.x - size * Math.cos(angle - Math.PI / 6), last.y - size * Math.sin(angle - Math.PI / 6));
  context.lineTo(last.x - size * Math.cos(angle + Math.PI / 6), last.y - size * Math.sin(angle + Math.PI / 6));
  context.closePath();
  context.fill();

  if (doubleArrow) {
    const start = points[0];
    const angleStart = Math.atan2(start.y - prev.y, start.x - prev.x);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(start.x + size * Math.cos(angleStart - Math.PI / 6), start.y + size * Math.sin(angleStart - Math.PI / 6));
    context.lineTo(start.x + size * Math.cos(angleStart + Math.PI / 6), start.y + size * Math.sin(angleStart + Math.PI / 6));
    context.closePath();
    context.fill();
  }
}

const buttonStyle = {
  background: '#0f172a',
  color: 'white',
  border: 'none',
  borderRadius: 999,
  padding: '8px 12px',
  fontSize: 12,
  cursor: 'pointer'
} as const;
