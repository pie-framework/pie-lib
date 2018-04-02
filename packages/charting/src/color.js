class C {
  constructor(name, main, text) {
    this.name = name;
    this.raw = {
      main,
      text
    };
  }

  get main() {
    return `var(--pie-${this.name}, ${this.raw.main})`;
  }
  get text() {
    return `var(--pie-${this.name}-text, ${this.raw.text})`;
  }
}

export const correct = new C('correct', '#4caf50', '#000000');

export const incorrect = new C('incorrect', '#ff6f00', '#000000');

export const primary = new C('primary', '#2196f3', '#ffffff');

export const secondary = new C('secondary', 'rgb(225, 0, 80)', '#ffffff');

export const disabled = new C('disabled', '#9e9e9e', '#000000');
