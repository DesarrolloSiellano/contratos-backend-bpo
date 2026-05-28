import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContextStore {
  company: string;
  tenantId: string;
  isSuperAdmin: boolean;
}

export class TenantContext {
  private static readonly storage = new AsyncLocalStorage<TenantContextStore>();

  static run(store: TenantContextStore, callback: () => any) {
    return this.storage.run(store, callback);
  }

  static getStore(): TenantContextStore | undefined {
    return this.storage.getStore();
  }

  static getCompany(): string | undefined {
    return this.getStore()?.company;
  }

  static getTenantId(): string | undefined {
    return this.getStore()?.tenantId;
  }

  static isSuperAdmin(): boolean {
    return !!this.getStore()?.isSuperAdmin;
  }
}
