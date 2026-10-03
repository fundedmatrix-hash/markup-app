import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { detectPlatform, getSupportLabel } from './lib/platform';
import { readStorage, writeStorage, STORAGE_KEYS, defaultPreferences } from './lib/storage';
import type { ThemeMode, ToolType } from './types';
import { Toolbar } from './features/annotation/Toolbar';
import { Launcher } from './features/annotation/Launcher';
import { AnnotationCanvas } from './features/annotation/AnnotationCanvas';

function App() {
  const capability = useMemo(() => detectPlatform(), []);
  const [tool, setTool] = useState<ToolType>(readStorage(STORAGE_KEYS.preferences, defaultPreferences).tool ?? 'pen');
  const [theme, setTheme] = useState<ThemeMode>(readStorage(STORAGE_KEYS.preferences, defaultPreferences).theme ?? 'system');
  const [color, setColor] = useState(readStorage(STORAGE_KEYS.preferences, defaultPreferences).color ?? '#f97316');
  const [thickness, setThickness] = useState(readStorage(STORAGE_KEYS.preferences, defaultPreferences).thickness ?? 3);
  const [opacity, setOpacity] = useState(readStorage(STORAGE_KEYS.preferences, defaultPreferences).opacity ?? 0.9);
  const [boardMode, setBoardMode] = useState(readStorage(STORAGE_KEYS.preferences, defaultPreferences).boardMode ?? false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [recording, setRecording] = useState(false);
  const [notes, setNotes] = useState(readStorage(STORAGE_KEYS.notes, ''));

  const applyPreference = (next: Partial<typeof defaultPreferences>) => {
    const previous = readStorage(STORAGE_KEYS.preferences, defaultPreferences);
    const merged = { ...previous, ...next };
    writeStorage(STORAGE_KEYS.preferences, merged);
  };

  const saveNotes = (value: string) => {
    setNotes(value);
    writeStorage(STORAGE_KEYS.notes, value);
  };

  const supportMessage = getSupportLabel(capability);

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `markup-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleUndo = () => {
    console.info('Undo action triggered');
  };

  const handleRedo = () => {
    console.info('Redo action triggered');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: boardMode ? 'radial-gradient(circle at center, rgba(15,23,42,0.98), rgba(2,6,23,1))' : 'linear-gradient(180deg, #f8fafc, #e2e8f0)',
        color: boardMode ? '#e2e8f0' : '#0f172a',
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ flex: 1, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>MARKUP</div>
            <div style={{ fontSize: 12, opacity: 0.8, textTransform: 'capitalize' }}>{capability.browser} • {capability.platform}</div>
          </div>

          <div style={{ width: '100%', height: 'calc(100vh - 110px)', borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.28)', background: boardMode ? '#0f172a' : '#ffffff' }}>
            <AnnotationCanvas
              tool={tool}
              color={color}
              thickness={thickness}
              opacity={opacity}
              boardMode={boardMode}
            />
          </div>
        </div>
      </motion.div>

      {!toolbarOpen ? <Launcher open={false} onOpen={() => setToolbarOpen(true)} /> : null}
      {toolbarOpen ? (
        <Toolbar
          tool={tool}
          setTool={(nextTool) => {
            setTool(nextTool);
            applyPreference({ tool: nextTool });
          }}
          color={color}
          setColor={(nextColor) => {
            setColor(nextColor);
            applyPreference({ color: nextColor });
          }}
          thickness={thickness}
          setThickness={(nextThickness) => {
            setThickness(nextThickness);
            applyPreference({ thickness: nextThickness });
          }}
          opacity={opacity}
          setOpacity={(nextOpacity) => {
            setOpacity(nextOpacity);
            applyPreference({ opacity: nextOpacity });
          }}
          theme={theme}
          setTheme={(nextTheme) => {
            setTheme(nextTheme);
            applyPreference({ theme: nextTheme });
          }}
          onScreenshot={handleScreenshot}
          onBoardMode={() => {
            const nextBoardMode = !boardMode;
            setBoardMode(nextBoardMode);
            applyPreference({ boardMode: nextBoardMode });
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          boardMode={boardMode}
          recording={recording}
          setRecording={setRecording}
          notesOpen={notesOpen}
          setNotesOpen={setNotesOpen}
          supportMessage={supportMessage}
        />
      ) : null}

      {notesOpen ? (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'fixed', left: 24, top: 24, width: 290, height: 240, background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(14px)', borderRadius: 20, border: '1px solid rgba(148,163,184,0.25)', boxShadow: '0 18px 36px rgba(15,23,42,0.2)', padding: 12, zIndex: 1200 }}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Notes</div>
          <textarea value={notes} onChange={(event) => saveNotes(event.target.value)} placeholder="Explain the idea, annotations, and follow-ups" style={{ width: '100%', height: 'calc(100% - 28px)', background: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 14, padding: 10, resize: 'none' }} />
        </motion.div>
      ) : null}
    </div>
  );
}

export default memo(App);
