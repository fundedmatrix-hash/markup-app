import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { detectPlatform, getSupportLabel } from '../../lib/platform';
import type { ThemeMode, ToolType } from '../../types';
import { AnnotationCanvas } from './AnnotationCanvas';
import { Toolbar } from './Toolbar';

export function Board() {
  const report = useMemo(() => detectPlatform(), []);
  const supportMessage = getSupportLabel(report);

  const [tool, setTool] = useState<ToolType>('pen');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [color, setColor] = useState('#f97316');
  const [thickness, setThickness] = useState(3);
  const [opacity, setOpacity] = useState(0.9);
  const [boardMode, setBoardMode] = useState(false);
  const [recording, setRecording] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(true);
  const [notes, setNotes] = useState('');

  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `markup-${Date.now()}.png`;
    a.click();
  };

  const handleUndo = () => {
    console.info('Undo request');
  };

  const handleRedo = () => {
    console.info('Redo request');
  };

  const boardBackground = boardMode
    ? 'radial-gradient(circle at center, rgba(15,23,42,0.92), rgba(15,23,42,1))'
    : 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(241,245,249,0.96))';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: boardBackground,
        overflow: 'hidden',
        color: theme === 'dark' ? '#e2e8f0' : '#0f172a'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: boardMode ? 'radial-gradient(circle at center, rgba(96,165,250,0.16), rgba(15,23,42,0.94))' : 'transparent'
        }}
      />

      <div style={{ position: 'relative', padding: '24px 20px 120px', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 0.7 }}>MARKUP</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ opacity: 0.8, fontSize: 12 }}>Web</span>
            <span style={{ opacity: 0.8, fontSize: 12 }}>•</span>
            <span style={{ opacity: 0.8, fontSize: 12 }}>{report.browser}</span>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 120px)',
            borderRadius: 28,
            overflow: 'hidden',
            border: '1px solid rgba(148,163,184,0.25)',
            background: boardMode ? '#0f172a' : '#ffffff',
            boxShadow: '0 18px 36px rgba(15,23,42,0.12)'
          }}
        >
          <AnnotationCanvas
            tool={tool}
            color={color}
            thickness={thickness}
            opacity={opacity}
            boardMode={boardMode}
          />
        </div>
      </div>

      {notesOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'fixed',
            left: 20,
            top: 20,
            width: 280,
            height: 220,
            background: 'rgba(15,23,42,0.85)',
            border: '1px solid rgba(148,163,184,0.25)',
            borderRadius: 18,
            color: '#f8fafc',
            padding: 12,
            backdropFilter: 'blur(10px)',
            zIndex: 1100
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Notes</div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add context, next steps, meeting notes..."
            style={{
              width: '100%',
              height: 'calc(100% - 32px)',
              background: 'rgba(15,23,42,0.5)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: 12,
              color: '#f8fafc',
              resize: 'none',
              padding: 10,
              fontSize: 13
            }}
          />
        </motion.div>
      )}

      {launcherOpen && (
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          thickness={thickness}
          setThickness={setThickness}
          opacity={opacity}
          setOpacity={setOpacity}
          theme={theme}
          setTheme={setTheme}
          onScreenshot={takeScreenshot}
          onBoardMode={() => setBoardMode((value) => !value)}
          onUndo={handleUndo}
          onRedo={handleRedo}
          boardMode={boardMode}
          recording={recording}
          setRecording={setRecording}
          notesOpen={notesOpen}
          setNotesOpen={setNotesOpen}
          supportMessage={supportMessage}
        />
      )}

      <button
        type="button"
        onClick={() => setLauncherOpen((value) => !value)}
        style={{
          position: 'fixed',
          left: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: 18,
          border: 'none',
          background: 'linear-gradient(135deg, #f97316 0%, #fb7185 100%)',
          color: '#fff',
          fontSize: 18,
          fontWeight: 800,
          boxShadow: '0 12px 24px rgba(249,115,22,0.38)',
          cursor: 'pointer',
          zIndex: 1200
        }}
        aria-label="Open toolbar"
      >
        {launcherOpen ? '×' : 'M'}
      </button>
    </motion.div>
  );
}
