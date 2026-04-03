// State names for the typing loop.
const STATE = Object.freeze({
  TYPING: 'TYPING',
  PAUSING_AFTER_TYPE: 'PAUSING_AFTER_TYPE',
  ERASING: 'ERASING',
  PAUSING_AFTER_ERASE: 'PAUSING_AFTER_ERASE',
});

class TypedText {
  constructor(element, config) {
    if (!element) throw new Error('TypedText: element is required');
    if (!config.strings || config.strings.length === 0) {
      throw new Error('TypedText: config.strings must be a non-empty array');
    }
    this.element = element;
    this.strings = config.strings;
    this.typingSpeed = config.typingSpeed ?? 80;
    this.eraseSpeed = config.eraseSpeed ?? 40;
    this.pauseDuration = config.pauseDuration ?? 2000;
    this.currentIndex = 0;
    this.currentText = '';
    this.state = STATE.TYPING;
    this.timer = null;
    this._tick();
  }

  // Run one state-machine step, then schedule the next one.
  _tick() {
    const targetString = this.strings[this.currentIndex];
    switch (this.state) {
      case STATE.TYPING: {
        this.currentText = targetString.slice(0, this.currentText.length + 1);
        this._render();
        if (this.currentText === targetString) {
          this.state = STATE.PAUSING_AFTER_TYPE;
          this.timer = setTimeout(() => this._tick(), this.pauseDuration);
        } else {
          this.timer = setTimeout(() => this._tick(), this.typingSpeed);
        }
        break;
      }
      case STATE.PAUSING_AFTER_TYPE: {
        this.state = STATE.ERASING;
        this.timer = setTimeout(() => this._tick(), this.eraseSpeed);
        break;
      }
      case STATE.ERASING: {
        this.currentText = this.currentText.slice(0, -1);
        this._render();
        if (this.currentText === '') {
          this.state = STATE.PAUSING_AFTER_ERASE;
          this.timer = setTimeout(() => this._tick(), 400);
        } else {
          this.timer = setTimeout(() => this._tick(), this.eraseSpeed);
        }
        break;
      }
      case STATE.PAUSING_AFTER_ERASE: {
        this.currentIndex = (this.currentIndex + 1) % this.strings.length;
        this.state = STATE.TYPING;
        this.timer = setTimeout(() => this._tick(), this.typingSpeed);
        break;
      }
    }
  }

  _render() {
    this.element.textContent = this.currentText;
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    this.element.textContent = '';
  }
}

// Read config from HTML and start the component.
document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('typed-target');
  const stringsEl = document.getElementById('typed-strings');
  if (!target || !stringsEl) return;
  let strings;
  try {
    strings = JSON.parse(stringsEl.dataset.strings);
  } catch (e) {
    console.error('TypedText: invalid JSON in data-strings', e);
    return;
  }
  const instance = new TypedText(target, {
    strings,
    typingSpeed: 80,
    eraseSpeed: 40,
    pauseDuration: 2200,
  });
  void instance;
});

export { TypedText };