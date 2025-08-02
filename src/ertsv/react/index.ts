// src/ertsv/react/index.ts
import type { IErtsvApi } from '../../renderer/vite-env.d.ts';

export function useErtsvApi(): IErtsvApi {
  return (window as any).ertsvApi;
}