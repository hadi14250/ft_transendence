// BaseButton.js

class BaseButton {
  constructor(text, options = {}) {
    this.text = text;
    this.options = Object.assign({}, BaseButton.defaultOptions, options);
    this.element = this.createButtonElement();
    this.applyStyles();
  }

  createButtonElement() {
    const button = document.createElement('button');
    button.textContent = this.text;
    button.classList.add('base-button');
    return button;
  }

  applyStyles() {
    this.element.style.outline = 'none';
    this.element.style.backgroundColor = 'transparent';
    this.element.style.border = `2px solid ${this.options.strokeColor}`;
    this.element.style.color = `${this.options.textColor}`;
    this.element.style.padding = '2px 40px';
    this.element.style.margin = '10px';
    this.element.style.fontSize = `${this.options.fontSize}pt`;
    this.element.style.cursor = 'pointer';
    this.element.style.fontWeight = '700';
    this.element.style.fontFamily = 'Jost';
    this.element.style.transition = 'background-color 0.3s, color 0.3s, border-color 0.3s';

    this.element.addEventListener('mouseover', () => {
      this.element.style.backgroundColor = this.options.hoverBackgroundColor;
      this.element.style.color = this.options.hoverTextColor;
      this.element.style.borderColor = 'transparent';
    });

    this.element.addEventListener('mouseout', () => {
      this.element.style.backgroundColor = 'transparent';
      this.element.style.color = this.options.textColor;
      this.element.style.borderColor = this.options.strokeColor;
    });

    this.element.addEventListener('mousedown', () => {
      this.element.style.backgroundColor = this.hexToRgba(this.options.hoverBackgroundColor, 0.3);
    });

    this.element.addEventListener('mouseup', () => {
      this.element.style.backgroundColor = this.options.hoverBackgroundColor;
    });

    this.element.addEventListener('focus', () => {
      this.element.style.outline = 'none';
    });
  }

  hexToRgba(hex, alpha) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }
}

BaseButton.defaultOptions = {
  fontSize: 16,
  textColor: 'white',
  strokeColor: 'white',
  hoverTextColor: 'black',
  hoverBackgroundColor: 'white',
};

// Usage example:
document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll('[data-base-button]');
  buttons.forEach(button => {
    const text = button.textContent.trim();
    const fontSize = button.dataset.fontSize ? parseInt(button.dataset.fontSize) : undefined;
    const textColor = button.dataset.textColor || undefined;
    const strokeColor = button.dataset.strokeColor || undefined;
    const hoverTextColor = button.dataset.hoverTextColor || undefined;
    const hoverBackgroundColor = button.dataset.hoverBackgroundColor || undefined;
    const onClick = button.getAttribute('data-onclick') || undefined;

    const newButton = new BaseButton(text, {
      fontSize,
      textColor,
      strokeColor,
      hoverTextColor,
      hoverBackgroundColor,
    });

    if (onClick && window[onClick] instanceof Function) {
      newButton.element.addEventListener('click', window[onClick]);
    }

    button.parentNode.replaceChild(newButton.element, button);
  });
});
