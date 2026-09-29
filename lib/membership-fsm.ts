// Máquina de estados de la membresía (18-VENTA-HOTMART.md). Un evento viejo reentregado
// nunca debe poder resucitar un refund/chargeback — eso se aplica en la RPC apply_hotmart_event.

export type Status = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded' | 'chargeback';

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
