// backend/src/core/index.ts
// Core prediction engine exports

export * from './types';
export * from './poisson';
export * from './teamStrength';
export * from './value';
export * from './predictor';

// Constants
export const MAX_GOALS = 6;
export const DEFAULT_FORM_WINDOW = 5;
export const DEFAULT_HOME_ADVANTAGE = 1.1;