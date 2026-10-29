import { HttpErrorResponse } from '@angular/common/http';
import { ErrorApi } from '../models/api.models';

export function apiMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ErrorApi | null;
    if (body?.mensaje) return body.mensaje;
    if (typeof error.error === 'string' && error.error.trim()) return error.error;
  }
  return fallback;
}
