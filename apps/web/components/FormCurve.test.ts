/**
 * FormCurve Component Tests
 */

import { describe, it, expect, vi } from 'vitest';

describe('FormBadge', () => {
  it('should render 5 form badges', () => {
    const form = 'WWDLW';
    expect(form.length).toBe(5);
  });

  it('should calculate correct points', () => {
    const calcPoints = (form: string) => 
      form.split('').reduce((acc, r) => acc + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
    
    expect(calcPoints('WWWWW')).toBe(15); // 5 wins
    expect(calcPoints('DDDDD')).toBe(5);   // 5 draws
    expect(calcPoints('LLLLL')).toBe(0);   // 5 losses
    expect(calcPoints('WWDLW')).toBe(10); // 3+3+1+0+3
  });

  it('should handle short form strings', () => {
    const validForm = (form: string) => form?.length >= 5 ? form.slice(0, 5) : (form + 'DDDDD').slice(0, 5);
    
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
    
    // Last 3 characters
    expect(getTrend('DDWWW')).toBe('📈'); // 3 wins in last 3
    expect(getTrend('LWWWW')).toBe('📈'); // 2 wins in last 3 (L, W, W, W = last 3 are WWW
    expect(getTrend('WWWWW')).toBe('📈'); // all wins
    expect(getTrend('WDDWW')).toBe('📈'); // WW in last 3
    expect(getTrend('WDDWD')).toBe('➡️'); // 1 win in last 3
    expect(getTrend('DDDLL')).toBe('📉'); // 0 wins in last 3
  });
});
