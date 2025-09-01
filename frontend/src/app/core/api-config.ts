const w = window as any;
export const API_BASE: string = (w && w.__API_BASE__) || '/api/v1';
