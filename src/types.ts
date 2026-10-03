export type ToolType =
  | 'pen'
  | 'marker'
  | 'line'
  | 'arrow'
  | 'doubleArrow'
  | 'rectangle'
  | 'circle'
  | 'text'
  | 'numbers'
  | 'check'
  | 'cross'
  | 'eraser'
  | 'blur'
  | 'pixelate'
  | 'laser'
  | 'spotlight';

export type ThemeMode = 'light' | 'dark' | 'system';

export type DrawPoint = {
  x: number;
  y: number;
};

export type DrawingStroke = {
  id: string;
  tool: ToolType;
  color: string;
  thickness: number;
  opacity: number;
  points: DrawPoint[];
  start?: DrawPoint;
  end?: DrawPoint;
  text?: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  kind: 'screenshot' | 'recording' | 'note' | 'drawing' | 'project';
  createdAt: string;
  path?: string;
};

export type AppPreferences = {
  theme: ThemeMode;
  boardMode: boolean;
  color: string;
  thickness: number;
  opacity: number;
  tool: ToolType;
};
