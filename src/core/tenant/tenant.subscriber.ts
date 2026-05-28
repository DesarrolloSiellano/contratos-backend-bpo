import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { TenantContext } from './tenant.context';

@EventSubscriber()
export class TenantSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>) {
    const store = TenantContext.getStore();
    if (store && event.entity) {
      if ('company' in event.entity && !event.entity.company) {
        event.entity.company = store.company;
      }
      if ('tenantId' in event.entity && !event.entity.tenantId) {
        event.entity.tenantId = store.tenantId;
      }
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const store = TenantContext.getStore();
    if (store && event.entity) {
      if ('company' in event.entity && !event.entity.company) {
        event.entity.company = store.company;
      }
      if ('tenantId' in event.entity && !event.entity.tenantId) {
        event.entity.tenantId = store.tenantId;
      }
    }
  }
}
