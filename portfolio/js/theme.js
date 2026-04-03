const STORAGE_KEY = 'portfolio-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// Pick saved theme or fallback to system preference.
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? DARK_THEME : LIGHT_THEME);
  }
}

// Apply theme and sync toggle button labels/ARIA.
function applyTheme(theme) {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  html.setAttribute('data-theme', theme);
  if (btn) {
    if (theme === LIGHT_THEME) {
      btn.textContent = '🌞 LIGHT';
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      btn.textContent = '🌙 DARK';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Switch to light theme');
    }
  }
}

// Flip theme and persist it.
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || DARK_THEME;
  const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  applyTheme(nextTheme);
  localStorage.setItem(STORAGE_KEY, nextTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);
});