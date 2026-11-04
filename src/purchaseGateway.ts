/** Fail-closed billing boundary; existing memories remain available. */
export type PurchaseGateway = { configured: boolean; purchase(productId: string): Promise<never>; restore(): Promise<never> };
export const purchaseGateway: PurchaseGateway = { configured: false, async purchase(_productId) { throw new Error('Store billing not configured'); }, async restore() { throw new Error('Store billing not configured'); } };
