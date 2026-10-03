import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  ArrowRight,
  Camera,
  Check,
  Circle,
  Eraser,
  Highlighter,
  LayoutGrid,
  Moon,
  NotebookPen,
  Palette,
  Pencil,
  Square,
  SunMedium,
  Type,
  Undo2,
  X,
  Sparkles,
  Crosshair,
  MonitorUp,
  Redo2
} from 'lucide-react';
import type { ToolType, ThemeMode } from '../../types';

const toolOptions: Array<{ key: ToolType; label: string; icon: React.ReactNode }> = [
  { key: 'pen', label: 'Pen', icon: <Pencil size={16} /> },
  { key: 'marker', label: 'Marker', icon: <Highlighter size={16} /> },
  { key: 'line', label: 'Line', icon: <ArrowRight size={16} /> },
  { key: 'arrow', label: 'Arrow', icon: <ArrowRight size={16} /> },
  { key: 'doubleArrow', label: 'Double', icon: <ArrowLeftRight size={16} /> },
  { key: 'rectangle', label: 'Rect', icon: <Square size={16} /> },
  { key: 'circle', label: 'Circle', icon: <Circle size={16} /> },
  { key: 'text', label: 'Text', icon: <Type size={16} /> },
  { key: 'numbers', label: 'Number', icon: <span style={{ fontSize: 14, fontWeight: 700 }}>1</span> },
  { key: 'check', label: 'Check', icon: <Check size={16} /> },
  { key: 'cross', label: 'Cross', icon: <X size={16} /> },
  { key: 'eraser', label: 'Erase', icon: <Eraser size={16} /> },
  { key: 'blur', label: 'Blur', icon: <Sparkles size={16} /> },
  { key: 'pixelate', label: 'Pixel', icon: <Crosshair size={16} /> },
  { key: 'laser', label: 'Laser', icon: <MonitorUp size={16} /> },
  { key: 'spotlight', label: 'Spot', icon: <Crosshair size={16} /> }
];

type ToolbarProps = {
  tool: ToolType;
  setTool: (value: ToolType) => void;
  color: string;
  setColor: (value: string) => void;
  thickness: number;
  setThickness: (value: number) => void;
  opacity: number;
  setOpacity: (value: number) => void;
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
  onScreenshot: () => void;
  onBoardMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  boardMode: boolean;
  recording: boolean;
  setRecording: (value: boolean) => void;
  notesOpen: boolean;
  setNotesOpen: (value: boolean) => void;
  supportMessage: string;
};

export function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  thickness,
  setThickness,
  opacity,
  setOpacity,
  theme,
  setTheme,
  onScreenshot,
  onBoardMode,
  onUndo,
  onRedo,
  boardMode,
  recording,
  setRecording,
  notesOpen,
  setNotesOpen,
  supportMessage
}: ToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 'min(92vw, 380px)',
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(18px)',
        color: '#f8fafc',
        borderRadius: 22,
        border: '1px solid rgba(148,163,184,0.25)',
        boxShadow: '0 18px 46px rgba(15,23,42,0.45)',
        padding: 12,
        zIndex: 1000
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.6 }}>MARKUP</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" style={iconButton} onClick={onUndo} aria-label="Undo"><Undo2 size={14} /></button>
          <button type="button" style={iconButton} onClick={onRedo} aria-label="Redo"><Redo2 size={14} /></button>
          <button type="button" style={iconButton} onClick={onScreenshot} aria-label="Screenshot"><Camera size={14} /></button>
          <button type="button" style={iconButton} onClick={() => setRecording(!recording)} aria-label="Recording">
            <MonitorUp size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8 }}>
        {toolOptions.map(({ key, label, icon }) => {
          const active = tool === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTool(key)}
              style={{
                ...toolButton,
                background: active ? 'rgba(249,115,22,0.22)' : 'rgba(148,163,184,0.08)',
                borderColor: active ? 'rgba(249,115,22,0.8)' : 'rgba(148,163,184,0.1)'
              }}
              aria-label={label}
            >
              {icon}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={swatch} aria-label="Pick color" />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1', fontSize: 12 }}>
          <span>Weight</span>
          <input type="range" min={1} max={18} value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1', fontSize: 12 }}>
          <span>Opacity</span>
          <input type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button type="button" style={secondaryButton} onClick={onBoardMode}>{boardMode ? 'Board on' : 'Board mode'}</button>
        <button type="button" style={secondaryButton} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <SunMedium size={14} /> : <Moon size={14} />}
          Theme
        </button>
        <button type="button" style={secondaryButton} onClick={() => setNotesOpen(!notesOpen)}>
          <NotebookPen size={14} />
          Notes
        </button>
        <button type="button" style={secondaryButton}>
          <Palette size={14} />
          Drive
        </button>
        <button type="button" style={secondaryButton}>
          <LayoutGrid size={14} />
          PWA
        </button>
      </div>

      <div style={{ marginTop: 10, color: '#cbd5e1', fontSize: 11, opacity: 0.85 }}>{supportMessage}</div>
    </motion.div>
  );
}

const toolButton = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  minHeight: 52,
  borderRadius: 12,
  border: '1px solid rgba(148,163,184,0.15)',
  color: '#f8fafc',
  padding: '8px 6px',
  cursor: 'pointer',
  fontSize: 10,
  fontWeight: 600
};

const secondaryButton = {
  background: 'rgba(148,163,184,0.08)',
  color: '#f8fafc',
  border: '1px solid rgba(148,163,184,0.15)',
  borderRadius: 999,
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  cursor: 'pointer'
} as const;

const iconButton = {
  background: 'rgba(148,163,184,0.08)',
  color: '#f8fafc',
  border: '1px solid rgba(148,163,184,0.15)',
  borderRadius: 999,
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
} as const;

const swatch = {
  width: 42,
  height: 32,
  border: 'none',
  borderRadius: 10,
  background: 'transparent',
  cursor: 'pointer'
} as const;
