import type { BookSettings, BindingType } from '../types';
import { BORDER_THICKNESS_VALUES } from '../utils/constants';

function getBindingCSS(type: BindingType): string {
  switch (type) {
    case 'perfect':
      return `box-shadow: inset 4px 0 8px -4px rgba(0,0,0,0.25), inset -4px 0 8px -4px rgba(0,0,0,0.25), 0 2px 8px rgba(26,23,20,0.1), 0 12px 32px rgba(26,23,20,0.15);`;
    case 'hardcover':
      return `box-shadow: inset 6px 0 12px -4px rgba(0,0,0,0.4), inset -6px 0 12px -4px rgba(0,0,0,0.4), 0 4px 16px rgba(26,23,20,0.2), 0 16px 48px rgba(26,23,20,0.25); border: 3px solid rgba(26,23,20,0.2); border-radius: 4px;`;
    case 'magazine':
      return `box-shadow: inset 2px 0 4px -2px rgba(0,0,0,0.1), inset -2px 0 4px -2px rgba(0,0,0,0.1), 0 1px 4px rgba(26,23,20,0.08), 0 8px 24px rgba(26,23,20,0.12);`;
    case 'spiral':
      return `box-shadow: 0 2px 8px rgba(26,23,20,0.1), 0 8px 24px rgba(26,23,20,0.12); border-top: 12px solid #6B6560; border-radius: 2px 2px 4px 4px;`;
    case 'japanese':
      return `box-shadow: 0 2px 8px rgba(26,23,20,0.08), 0 8px 24px rgba(26,23,20,0.1);`;
    default:
      return '';
  }
}

function getBindingExtraCSS(type: BindingType): string {
  switch (type) {
    case 'spiral':
      return `.book-wrapper::before { content: ''; position: absolute; top: -12px; left: 10%; right: 10%; height: 12px; background: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, #888 6px, #888 8px, transparent 8px, transparent 20px); z-index: 10; }`;
    case 'japanese':
      return `.book-wrapper::after { content: ''; position: absolute; top: 5%; bottom: 5%; left: 50%; transform: translateX(-50%); width: 4px; background: repeating-linear-gradient(180deg, #C2410C 0px, #C2410C 8px, transparent 8px, transparent 16px); z-index: 10; pointer-events: none; }`;
    default:
      return '';
  }
}

export function generateCSS(settings: BookSettings): string {
  const dir = settings.direction;
  const isRtl = dir === 'rtl';

  let bgStyles = '';
  switch (settings.background.type) {
    case 'gradient':
      bgStyles = `background: linear-gradient(${settings.background.gradientAngle}deg, ${settings.background.gradientColors[0]}, ${settings.background.gradientColors[1]});`;
      break;
    case 'image':
      if (settings.background.imageData) {
        bgStyles = `background-image: url(${settings.background.imageData}); background-size: cover; background-position: center;`;
      } else {
        bgStyles = `background: ${settings.colors.background};`;
      }
      break;
    default:
      bgStyles = `background: ${settings.colors.background};`;
  }

  let borderStyles = '';
  if (settings.border.type === 'solid') {
    borderStyles = `border: ${BORDER_THICKNESS_VALUES[settings.border.thickness]}px solid ${settings.border.color};`;
  } else if (settings.border.type === 'double') {
    borderStyles = `border: ${BORDER_THICKNESS_VALUES[settings.border.thickness]}px double ${settings.border.color};`;
  }

  let shadowStyles = '';
  if (settings.border.shadow || settings.border.type === 'shadow') {
    const i = settings.border.shadowIntensity / 100;
    const parseColor = (c: string): string => {
      const m = c.trim().match(/^#([0-9a-f]{6})$/i);
      if (m && m[1]) {
        const r = parseInt(m[1].substring(0, 2), 16);
        const g = parseInt(m[1].substring(2, 4), 16);
        const bl = parseInt(m[1].substring(4, 6), 16);
        return `${r}, ${g}, ${bl}`;
      }
      const rgbaMatch = c.match(/rgba?\(([^)]+)\)/);
      if (rgbaMatch && rgbaMatch[1]) {
        return rgbaMatch[1].split(',').slice(0, 3).map((p) => p.trim()).join(', ');
      }
      return '26, 23, 20';
    };
    const rgb = parseColor(settings.border.shadowColor);
    shadowStyles = `box-shadow: 0 4px 16px rgba(${rgb},${(0.35 * i).toFixed(3)}), 0 20px 48px rgba(${rgb},${(0.5 * i).toFixed(3)});`;
  }

  return `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  font-family: ${isRtl ? "'IBM Plex Sans Arabic'" : "'IBM Plex Sans'"}, sans-serif;
  -webkit-font-smoothing: antialiased;
}

body {
  ${bgStyles}
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}

#book-container {
  display: flex; align-items: center; justify-content: center;
  flex: 1; width: 100%; height: 100vh;
  padding: 10px 10px 70px 10px;
  overflow: hidden;
}

.book-wrapper {
  ${borderStyles}
  transition: transform 0.25s ease;
  transform-origin: center center;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  ${settings.border.radius > 0 ? `border-radius: ${settings.border.radius}px;` : ''}
  ${getBindingCSS(settings.binding.type)}
  ${shadowStyles}
}

${getBindingExtraCSS(settings.binding.type)}

.page { background: white; overflow: hidden; }
.page img { width: 100%; height: 100%; object-fit: contain; display: block; }

.cover-page {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 24px; padding: 32px; position: relative; overflow: hidden;
}
.cover-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
}
.cover-page.front { background: ${settings.colors.frontCover}; }
.cover-page.back { background: ${settings.colors.backCover}; }

.cover-logo { max-width: 40%; max-height: 30%; object-fit: contain; }
.cover-title {
  text-align: center; font-weight: 600; line-height: 1.3;
  color: ${settings.cover.titleColor};
  font-size: ${settings.cover.titleSize}px;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
}

/* Toolbar */
#toolbar {
  display: flex; align-items: center; justify-content: center;
  gap: 24px; padding: 8px 20px;
  background: ${settings.colors.toolbar};
  color: ${settings.colors.toolbarText};
  border-radius: 12px;
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  box-shadow: 0 1px 3px rgba(26,23,20,0.06), 0 6px 16px rgba(26,23,20,0.08);
  z-index: 100;
  user-select: none;
  direction: ${dir};
}

.toolbar-section { display: flex; align-items: center; gap: 8px; }

.icon-btn {
  width: 36px; height: 36px; border: none; background: none;
  color: inherit; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; opacity: 0.85; transition: all 0.15s;
}
.icon-btn:hover { background: rgba(255,255,255,0.15); opacity: 1; }

.icon-btn svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.page-indicator {
  font-size: 13px; font-family: 'IBM Plex Mono', monospace;
  font-weight: 500; opacity: 0.9; white-space: nowrap; min-width: 120px; text-align: center;
}

.go-to-input {
  width: 70px; padding: 4px 8px; background: transparent;
  border: 1px solid ${settings.colors.toolbarText}33;
  border-radius: 6px; font-size: 12px; font-family: 'IBM Plex Mono', monospace;
  text-align: center; outline: none; color: inherit;
}
.go-to-input::-webkit-outer-spin-button,
.go-to-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.go-to-input[type="number"] { -moz-appearance: textfield; }

.zoom-label {
  font-size: 12px; font-family: 'IBM Plex Mono', monospace;
  min-width: 40px; text-align: center; opacity: 0.8;
}

.separator { width: 1px; height: 20px; background: currentColor; opacity: 0.2; margin: 0 4px; }

/* Side Panels (ToC, Search) */
.side-panel {
  position: fixed; top: 16px; inset-inline-start: 16px; width: 280px; max-height: 70vh;
  background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(26,23,20,0.08), 0 16px 40px rgba(26,23,20,0.12);
  z-index: 110; display: flex; flex-direction: column; overflow: hidden;
  border: 1px solid rgba(26,23,20,0.08); direction: ${dir};
}

.panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid rgba(26,23,20,0.08);
}
.panel-header h3 { font-size: 14px; font-weight: 600; }
.panel-close {
  width: 28px; height: 28px; border: none; background: none; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  color: #6B6560; transition: all 0.15s;
}
.panel-close:hover { background: #E5E0D8; color: #1A1714; }
.panel-close svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }

.panel-body { overflow-y: auto; padding: 8px 0; flex: 1; }

/* ToC items */
.toc-item {
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 8px 16px; gap: 8px; text-align: start; border: none; background: none;
  cursor: pointer; transition: background 0.15s; font: inherit; color: inherit;
}
.toc-item:hover { background: rgba(194, 65, 12, 0.08); }
.toc-title { font-size: 13px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.toc-page { font-size: 12px; font-family: 'IBM Plex Mono', monospace; color: #9C9590; flex-shrink: 0; }

/* Thumbnail Bar */
.thumb-bar {
  position: fixed; bottom: 72px; left: 50%; transform: translateX(-50%);
  max-width: 80vw; overflow-x: auto; overflow-y: hidden;
  padding: 8px 12px; background: rgba(255,255,255,0.95); border-radius: 10px;
  box-shadow: 0 1px 3px rgba(26,23,20,0.06), 0 6px 16px rgba(26,23,20,0.08);
  z-index: 99; display: flex; gap: 6px; scrollbar-width: thin; direction: ${dir};
}
.thumb-item {
  flex-shrink: 0; width: 48px; display: flex; flex-direction: column; align-items: center;
  gap: 2px; padding: 3px; border-radius: 6px; border: 2px solid transparent;
  cursor: pointer; transition: all 0.15s; background: none;
}
.thumb-item:hover { border-color: rgba(26,23,20,0.15); background: #E5E0D8; }
.thumb-item.active { border-color: #C2410C; background: rgba(194, 65, 12, 0.08); }
.thumb-item img { width: 42px; height: 58px; object-fit: cover; border-radius: 3px; box-shadow: 0 1px 2px rgba(26,23,20,0.04); }
.thumb-item span { font-size: 9px; font-family: 'IBM Plex Mono', monospace; color: #9C9590; }
.thumb-item.active span { color: #C2410C; }

.icon-btn.active { background: rgba(255,255,255,0.2); opacity: 1; }

/* Fullscreen styles */
:fullscreen #toolbar { bottom: 20px; }
:fullscreen body { cursor: none; }
:fullscreen body:hover { cursor: default; }
`;
}
