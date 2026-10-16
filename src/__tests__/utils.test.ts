import { isValidCssColor } from '../utils';

describe('isValidCssColor', () => {
  let cssDescriptor: PropertyDescriptor | undefined;
  let documentDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    cssDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'CSS');
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
  });

  afterEach(() => {
    if (cssDescriptor) {
      Object.defineProperty(globalThis, 'CSS', cssDescriptor);
    } else {
      delete (globalThis as { CSS?: unknown }).CSS;
    }
    if (documentDescriptor) {
      Object.defineProperty(globalThis, 'document', documentDescriptor);
    } else {
      delete (globalThis as { document?: unknown }).document;
    }
  });

  it('returns false when document is unavailable', () => {
    let documentWasChecked = false;

    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      get: () => {
        documentWasChecked = true;
        return undefined;
      },
    });

    expect(isValidCssColor('#123456')).toBe(false);
    expect(documentWasChecked).toBe(true);
  });

  it.each([
    { color: '#123456', supportsResult: true, expected: true },
    { color: 'white', supportsResult: true, expected: true },
    { color: 'not-a-color', supportsResult: false, expected: false },
  ])('uses CSS.supports when available: $color -> $expected', ({ color, supportsResult, expected }) => {
    const supports = jest.fn().mockReturnValue(supportsResult);
    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { supports },
    });

    expect(isValidCssColor(color)).toBe(expected);
    expect(supports).toHaveBeenCalledWith('color', color);
  });

  it('falls back safely when CSS.supports throws', () => {
    const supports = jest.fn().mockImplementation(() => {
      throw new Error('unsupported');
    });
    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { supports },
    });

    expect(isValidCssColor('#123456')).toBe(false);
  });
});
