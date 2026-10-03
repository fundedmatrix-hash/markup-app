import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type LauncherProps = {
  open: boolean;
  onOpen: () => void;
  children?: ReactNode;
};

export function Launcher({ open, onOpen, children }: LauncherProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        width: 62,
        height: 62,
        borderRadius: 18,
        border: 'none',
        background: 'linear-gradient(135deg, #f97316 0%, #fb7185 100%)',
        boxShadow: '0 14px 32px rgba(249,115,22,0.4)',
        color: '#fff',
        fontWeight: 800,
        fontSize: 14,
        cursor: 'pointer',
        zIndex: 1000
      }}
      aria-label="Open MARKUP"
    >
      {open ? '×' : 'M'}
      {children}
    </motion.button>
  );
}
