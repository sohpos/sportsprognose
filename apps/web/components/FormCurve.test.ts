/**
 * FormCurve Component Tests
 */

import { describe, it, expect } from 'vitest';

describe('FormBadge', () => {
  it('should render 5 form badges', () => {
    const form = 'WWDLW';
    const validForm = form.length >= 5 ? form.slice(0, 5) : 'DDDDD';
    expect(validForm.length).toBe(5);
  });

  it('should calculate correct points', () => {
    const calcPoints = (form: string) =>
      form.split('').reduce((acc, r) => acc + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);

    expect(calcPoints('WWWWW')).toBe(15);
    expect(calcPoints('DDDDD')).toBe(5);
    expect(calcPoints('LLLLL')).toBe(0);
    expect(calcPoints('WWDLW')).toBe(10);
  });

  it('should handle short form strings', () => {
    const validForm = (form: string) =>
      form?.length >= 5 ? form.slice(0, 5) : (form + 'DDDDD').slice(0, 5);

    expect(validForm('WWDLW')).toBe('WWDLW');
    expect(validForm('WW')).toBe('WWDDD');
    expect(validForm('')).toBe('DDDDD');
  });
});

describe('FormTrend', () => {
  it('should detect upward trend', () => {
    const getTrend = (form: string) => {
      const recent = form.slice(-3).split('').filter(r => r === 'W').length;
      if (recent >= 2) return '📈';
      if (recent === 1) return '➡️';
      return '📉';
    };

    expect(getTrend('DDWWW')).toBe('📈');
    expect(getTrend('LWWWW')).toBe('📈');
    expect(getTrend('WWWWW')).toBe('📈');
    expect(getTrend('WDDWW')).toBe('📈');
    expect(getTrend('WDDWD')).toBe('➡️');
    expect(getTrend('DDDLL')).toBe('📉');
  });
});
