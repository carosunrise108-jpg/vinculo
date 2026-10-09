// Máquina de estados de la membresía (18-VENTA-HOTMART.md). Un evento viejo reentregado
// nunca debe poder resucitar un refund/chargeback — eso se aplica en la RPC apply_hotmart_event.

export type Status = 'none' | 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded' | 'chargeback';

export interface PerfilAcceso {
  status: Status;
  access_until: string | null;
  grace_ends_at: string | null;
}

/** ¿Esta cuenta puede entrar a la app? El status solo NO decide: cancelled y past_due consultan
 * su fecha (acceso hasta el fin de lo ya pagado / periodo de gracia por pago fallido). 'none'
 * (cuenta creada sin compra), expired, refunded y chargeback NO entran (18-VENTA-HOTMART.md). */
export function tieneAcceso(p: PerfilAcceso | null, ahora: Date = new Date()): boolean {
  if (!p) return false;
  if (p.status === 'trialing' || p.status === 'active') return true;
  if (p.status === 'cancelled') return !!p.access_until && ahora < new Date(p.access_until);
  if (p.status === 'past_due') return !!p.grace_ends_at && ahora < new Date(p.grace_ends_at);
  return false;
}

// ⚠️ PLACEHOLDER — verificar en el panel de Hotmart (Herramientas → Webhook) antes de confiar
// en la métrica trial→pago. Es plausible que el inicio de prueba llegue como PURCHASE_APPROVED
// con valor 0, no como un evento propio — si es así, hay que ajustar este mapa (ver 18, sección
// "El evento de inicio de trial es un PLACEHOLDER").
const TRIAL_START_EVENT = 'SUBSCRIPTION_TRIAL_START'; // (verificar con un pago de prueba real)

export const EVENT_TO_STATUS: Record<string, Status> = {
  [TRIAL_START_EVENT]: 'trialing',
  PURCHASE_APPROVED: 'active',
  PURCHASE_COMPLETE: 'active',
  PURCHASE_DELAYED: 'past_due',
  SUBSCRIPTION_CANCELLATION: 'cancelled',
  PURCHASE_EXPIRED: 'expired',
  PURCHASE_REFUNDED: 'refunded',
  PURCHASE_CHARGEBACK: 'chargeback',
};

export const PLAN_CHANGE_EVENT = 'SWITCH_PLAN';

export function statusForEvent(event: string): Status | null {
  return EVENT_TO_STATUS[event] ?? null;
}
