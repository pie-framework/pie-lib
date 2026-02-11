import { updateSpans } from '../updateSpans';

describe('updateSpans', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('prime notation (′ and ′′)', () => {
    it('should add data-prime attribute to single prime', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '′';
      document.body.appendChild(span);

      updateSpans();

      expect(span.getAttribute('data-prime')).toBe('true');
    });

    it('should add data-prime attribute to double prime', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '′′';
      document.body.appendChild(span);

      updateSpans();

      expect(span.getAttribute('data-prime')).toBe('true');
    });

    it('should not add data-prime if already present', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '′';
      span.setAttribute('data-prime', 'true');
      document.body.appendChild(span);

      updateSpans();

      expect(span.getAttribute('data-prime')).toBe('true');
    });

    it('should handle multiple prime notation spans', () => {
      const span1 = document.createElement('span');
      span1.setAttribute('mathquill-command-id', '1');
      span1.innerText = '′';
      document.body.appendChild(span1);

      const span2 = document.createElement('span');
      span2.setAttribute('mathquill-command-id', '2');
      span2.innerText = '′′';
      document.body.appendChild(span2);

      updateSpans();

      expect(span1.getAttribute('data-prime')).toBe('true');
      expect(span2.getAttribute('data-prime')).toBe('true');
    });
  });

  describe('combined scenarios', () => {
    it('should handle both parallel and prime notation in same document', () => {
      const parallelSpan = document.createElement('span');
      parallelSpan.setAttribute('mathquill-command-id', '1');
      parallelSpan.innerText = '∥';
      document.body.appendChild(parallelSpan);

      const primeSpan = document.createElement('span');
      primeSpan.setAttribute('mathquill-command-id', '2');
      primeSpan.innerText = '′';
      document.body.appendChild(primeSpan);

      updateSpans();

      expect(parallelSpan.style.fontSize).toBe('32px');
      expect(primeSpan.getAttribute('data-prime')).toBe('true');
    });

    it('should handle complex document with multiple span types', () => {
      const parallelSpan = document.createElement('span');
      parallelSpan.setAttribute('mathquill-command-id', '1');
      parallelSpan.innerText = '∥';
      document.body.appendChild(parallelSpan);

      const primeSpan = document.createElement('span');
      primeSpan.setAttribute('mathquill-command-id', '2');
      primeSpan.innerText = '′';
      document.body.appendChild(primeSpan);

      const normalSpan = document.createElement('span');
      normalSpan.setAttribute('mathquill-command-id', '3');
      normalSpan.innerText = 'x';
      document.body.appendChild(normalSpan);

      const editableParallel = document.createElement('span');
      editableParallel.setAttribute('mathquill-command-id', '4');
      editableParallel.innerText = '∥';
      editableParallel.className = 'mq-editable-field';
      document.body.appendChild(editableParallel);

      updateSpans();

      expect(parallelSpan.style.fontSize).toBe('32px');
      expect(primeSpan.getAttribute('data-prime')).toBe('true');
      expect(normalSpan.style.fontSize).toBe('');
      expect(normalSpan.getAttribute('data-prime')).toBeNull();
      expect(editableParallel.style.fontSize).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should handle empty document', () => {
      expect(() => updateSpans()).not.toThrow();
    });

    it('should handle document with no mathquill spans', () => {
      const span = document.createElement('span');
      span.innerText = '∥';
      document.body.appendChild(span);

      expect(() => updateSpans()).not.toThrow();
      expect(span.style.fontSize).toBe('');
    });

    it('should handle spans with empty innerText', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '';
      document.body.appendChild(span);

      expect(() => updateSpans()).not.toThrow();
    });

    it('should handle spans with whitespace', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '   ';
      document.body.appendChild(span);

      expect(() => updateSpans()).not.toThrow();
    });

    it('should handle null or undefined spans gracefully', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '∥';
      document.body.appendChild(span);

      expect(() => updateSpans()).not.toThrow();
    });
  });

  describe('idempotency', () => {
    it('should be safe to call multiple times on parallel notation', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '∥';
      document.body.appendChild(span);

      updateSpans();
      const fontSize1 = span.style.fontSize;

      updateSpans();
      const fontSize2 = span.style.fontSize;

      updateSpans();
      const fontSize3 = span.style.fontSize;

      expect(fontSize1).toBe('32px');
      expect(fontSize2).toBe('32px');
      expect(fontSize3).toBe('32px');
    });

    it('should be safe to call multiple times on prime notation', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '′';
      document.body.appendChild(span);

      updateSpans();
      expect(span.getAttribute('data-prime')).toBe('true');

      updateSpans();
      expect(span.getAttribute('data-prime')).toBe('true');

      updateSpans();
      expect(span.getAttribute('data-prime')).toBe('true');
    });
  });

  describe('className variations', () => {
    it('should modify parallel notation with classes other than mq-editable-field', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '∥';
      span.className = 'some-other-class';
      document.body.appendChild(span);

      updateSpans();

      expect(span.style.fontSize).toBe('32px');
    });

    it('should modify parallel notation with no className', () => {
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '∥';
      document.body.appendChild(span);

      updateSpans();

      expect(span.style.fontSize).toBe('32px');
    });
  });

  describe('nested structures', () => {
    it('should handle spans nested in other elements', () => {
      const container = document.createElement('div');
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '∥';
      container.appendChild(span);
      document.body.appendChild(container);

      updateSpans();

      expect(span.style.fontSize).toBe('32px');
    });

    it('should handle deeply nested spans', () => {
      const level1 = document.createElement('div');
      const level2 = document.createElement('div');
      const level3 = document.createElement('div');
      const span = document.createElement('span');
      span.setAttribute('mathquill-command-id', '1');
      span.innerText = '′';

      level3.appendChild(span);
      level2.appendChild(level3);
      level1.appendChild(level2);
      document.body.appendChild(level1);

      updateSpans();

      expect(span.getAttribute('data-prime')).toBe('true');
    });
  });

  describe('special characters', () => {
    it('should only match exact parallel symbol', () => {
      const symbols = ['||', '|', '‖', '∥∥', 'parallel'];

      symbols.forEach((symbol, index) => {
        const span = document.createElement('span');
        span.setAttribute('mathquill-command-id', String(index));
        span.innerText = symbol;
        document.body.appendChild(span);
      });

      const parallelSpan = document.createElement('span');
      parallelSpan.setAttribute('mathquill-command-id', 'correct');
      parallelSpan.innerText = '∥';
      document.body.appendChild(parallelSpan);

      updateSpans();

      expect(parallelSpan.style.fontSize).toBe('32px');

      symbols.forEach((_, index) => {
        const span = document.querySelector(`span[mathquill-command-id="${index}"]`);
        expect(span.style.fontSize).toBe('');
      });
    });

    it('should only match exact prime symbols', () => {
      const symbols = ["'", '"', '`', '´', 'prime'];

      symbols.forEach((symbol, index) => {
        const span = document.createElement('span');
        span.setAttribute('mathquill-command-id', String(index));
        span.innerText = symbol;
        document.body.appendChild(span);
      });

      updateSpans();

      symbols.forEach((_, index) => {
        const span = document.querySelector(`span[mathquill-command-id="${index}"]`);
        expect(span.getAttribute('data-prime')).toBeNull();
      });
    });
  });
});
